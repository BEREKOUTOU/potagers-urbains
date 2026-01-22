import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import express, { Request, Response, NextFunction } from 'express';
import * as Express from 'express';
import ClamAV from 'clamav.js';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename?: string;
  path?: string;
  buffer?: Buffer;
}

// Get __dirname equivalent for ES modules
const __filenameMulter = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filenameMulter);

// Allowed file types with magic bytes
const ALLOWED_TYPES = {
  'image/jpeg': {
    extensions: ['.jpg', '.jpeg'],
    magicBytes: [0xFF, 0xD8, 0xFF]
  },
  'image/png': {
    extensions: ['.png'],
    magicBytes: [0x89, 0x50, 0x4E, 0x47]
  },
  'image/gif': {
    extensions: ['.gif'],
    magicBytes: [0x47, 0x49, 0x46, 0x38]
  },
  'image/webp': {
    extensions: ['.webp'],
    magicBytes: [0x52, 0x49, 0x46, 0x46] // RIFF
  }
};

// Validate file using magic bytes
const validateFileMagicBytes = (buffer: Buffer, mimetype: string): boolean => {
  const typeInfo = ALLOWED_TYPES[mimetype as keyof typeof ALLOWED_TYPES];
  if (!typeInfo) return false;

  const magicBytes = typeInfo.magicBytes;
  for (let i = 0; i < magicBytes.length; i++) {
    if (buffer[i] !== magicBytes[i]) {
      return false;
    }
  }
  return true;
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/temp/'; // default

    if (req.path.includes('/photos')) {
      uploadPath = 'uploads/photos/';
    } else if (req.path.includes('/events')) {
      uploadPath = 'uploads/events/';
    }

    // Ensure directory exists
    const fullPath = path.join(__dirname, '..', '..', uploadPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    // Sanitize filename and ensure it's safe
    const sanitizedName = path.basename(file.originalname).replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(sanitizedName).toLowerCase();

    // Validate extension matches mimetype
    const typeInfo = ALLOWED_TYPES[file.mimetype as keyof typeof ALLOWED_TYPES];
    if (!typeInfo || !typeInfo.extensions.includes(ext)) {
      cb(null, '');
      return;
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + ext);
  }
});

const fileFilter = (req: Request, file: MulterFile, cb: multer.FileFilterCallback) => {
  // Check if mimetype is allowed
  if (!ALLOWED_TYPES[file.mimetype as keyof typeof ALLOWED_TYPES]) {
    cb(null, false);
    return;
  }

  // Additional security checks
  const originalName = path.basename(file.originalname);
  if (originalName.length > 255) {
    cb(null, false);
    return;
  }

  // Check for suspicious patterns
  if (originalName.includes('..') || originalName.startsWith('.')) {
    cb(null, false);
    return;
  }

  cb(null, true);
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Reduced to 5MB for better security
    files: 1, // Only one file per request
  }
});

// Additional validation middleware for magic bytes
export const validateFileContent = (req: Request, res: Response, next: NextFunction) => {
  const file = req.file as MulterFile | undefined;
  if (!file) {
    return next();
  }

  try {
    const buffer = fs.readFileSync(file.path as string);
    const isValid = validateFileMagicBytes(buffer, file.mimetype);

    if (!isValid) {
      // Clean up invalid file
      if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      res.status(400).json({ error: 'File content does not match declared type' });
      return;
    }

    next();
  } catch (error) {
    console.error('File validation error:', error);
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    res.status(500).json({ error: 'File validation failed' });
  }
};

// Antivirus scanning middleware
export const scanFileAntivirus = async (req: Request, res: Response, next: NextFunction) => {
  const file = req.file as MulterFile | undefined;
  if (!file) {
    return next();
  }

  try {
    // Initialize ClamAV scanner
    const clamav = new ClamAV();

    // Check if ClamAV daemon is available
    const isAvailable = await clamav.isAvailable();
    if (!isAvailable) {
      console.warn('ClamAV daemon not available, skipping antivirus scan');
      return next();
    }

    // Scan the file
    const result = await clamav.scanFile(file.path as string);

    if (result.isInfected) {
      // Clean up infected file
      if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      res.status(400).json({ error: 'File contains malware and has been rejected' });
      return;
    }

    next();
  } catch (error) {
    console.error('Antivirus scanning error:', error);
    // In case of scanning error, we can choose to allow the file or reject it
    // For security, we'll reject on error
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    res.status(500).json({ error: 'File security scan failed' });
  }
};
