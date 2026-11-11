import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

export interface ElectronAPI {
  isElectron: boolean;
  platform: string;
  getAppVersion: () => Promise<string>;
  getStoragePath: () => Promise<string>;
  db: {
    getAreas: () => Promise<any[]>;
    getResources: (filters?: any) => Promise<any[]>;
    getResourceById: (id: number) => Promise<any>;
    getUsers: () => Promise<any[]>;
    getUserByUsername: (username: string) => Promise<any>;
    getStudentActivityNote: (resourceId: number, userId: number) => Promise<any>;
    saveStudentActivityNote: (data: any) => Promise<{ success: boolean }>;
    getAuditLogs: (limit?: number) => Promise<any[]>;
    recordAudit: (action: string, userId?: number, details?: string) => Promise<void>;
  };
  files: {
    openFile: (relativePath: string) => Promise<{ success: boolean; error?: string }>;
    checkFileExists: (relativePath: string) => Promise<boolean>;
  };
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

@Injectable({ providedIn: 'root' })
export class ElectronService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  get isElectron(): boolean {
    return this.isBrowser && typeof window !== 'undefined' && !!window.electronAPI?.isElectron;
  }

  get api(): ElectronAPI | null {
    if (this.isElectron) {
      return window.electronAPI ?? null;
    }
    return null;
  }

  async openLocalFile(relativePath: string): Promise<{ success: boolean; error?: string }> {
    if (this.api?.files) {
      return await this.api.files.openFile(relativePath);
    }
    return { success: false, error: 'No está en entorno de escritorio.' };
  }
}

