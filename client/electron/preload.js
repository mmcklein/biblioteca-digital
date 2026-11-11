/**
 * Preload Script seguro para Electron
 * Biblioteca Digital - I.E. Secundaria Micaela Bastidas Puyucahua
 *
 * Expone de forma segura las capacidades de escritorio mediante contextBridge
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Información de la plataforma y aplicación
  isElectron: true,
  platform: process.platform,
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  getStoragePath: () => ipcRenderer.invoke('app:getStoragePath'),

  // Base de datos local SQLite
  db: {
    getAreas: () => ipcRenderer.invoke('db:getAreas'),
    getResources: (filters) => ipcRenderer.invoke('db:getResources', filters),
    getResourceById: (id) => ipcRenderer.invoke('db:getResourceById', id),
    getUsers: () => ipcRenderer.invoke('db:getUsers'),
    getUserByUsername: (username) => ipcRenderer.invoke('db:getUserByUsername', username),
    getStudentActivityNote: (resourceId, userId) =>
      ipcRenderer.invoke('db:getStudentActivityNote', resourceId, userId),
    saveStudentActivityNote: (data) =>
      ipcRenderer.invoke('db:saveStudentActivityNote', data),
    getAuditLogs: (limit) => ipcRenderer.invoke('db:getAuditLogs', limit),
    recordAudit: (action, userId, details) =>
      ipcRenderer.invoke('db:recordAudit', action, userId, details),
  },

  // Manejo de archivos locales en storage
  files: {
    openFile: (relativePath) => ipcRenderer.invoke('files:openFile', relativePath),
    checkFileExists: (relativePath) => ipcRenderer.invoke('files:checkFileExists', relativePath),
  },
});

