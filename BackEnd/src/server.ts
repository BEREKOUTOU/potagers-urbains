import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './config/database.ts';
import authRoutes from './routes/auth.ts';
import userRoutes from './routes/users.ts';
import gardenRoutes from './routes/gardens.ts';
import eventRoutes from './routes/events.ts';
import discussionRoutes from './routes/discussions.ts';
import resourceRoutes from './routes/resources.ts';
import photoRoutes from './routes/photos.ts';
import statRoutes from './routes/stats.ts';
import { errorHandler } from './middleware/errorHandler.ts';

// --- Env validation (early exit on missing critical secrets) ---
const requiredRuntimeEnv = ['JWT_SECRET'];
const missingRuntime = requiredRuntimeEnv.filter((k) => !process.env[k]);

if (missingRuntime.length > 0) {
  console.error(`Missing required runtime environment variables: ${missingRuntime.join(', ')}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/temp/'; // default

    if (req.path.includes('/photos')) {
      uploadPath = 'uploads/photos/';
    } else if (req.path.includes('/events')) {
      uploadPath = 'uploads/events/';
    }

    cb(null, path.join(__dirname, '..', uploadPath));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Green City Grow Hub API',
      version: '1.0.0',
      description: 'API for Green City Grow Hub - Urban Gardening Platform',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration - must be before other middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gardens', gardenRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/stats', statRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});



