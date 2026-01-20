declare module 'clamav.js' {
  interface ClamAVResult {
    isInfected: boolean;
    viruses?: string[];
  }

  class ClamAV {
    constructor(options?: { host?: string; port?: number; timeout?: number });
    isAvailable(): Promise<boolean>;
    scanFile(filePath: string): Promise<ClamAVResult>;
    scanBuffer(buffer: Buffer): Promise<ClamAVResult>;
  }

  export = ClamAV;
}
