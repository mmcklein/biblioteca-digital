/**
 * Preload Script seguro para Electron
 * Biblioteca Digital - I.E. Secundaria Micaela Bastidas Puyucahua
 *
 * Expone de forma segura las capacidades de escritorio mediante contextBridge
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  getStoragePath: () => ipcRenderer.invoke('app:getStoragePath'),

  // Módulo A: Autenticación y Usuarios
  auth: {
    login: (username, password) => ipcRenderer.invoke('auth:login', username, password),
  },
  users: {
    getAll: () => ipcRenderer.invoke('users:getAll'),
    getByUsername: (username) => ipcRenderer.invoke('users:getByUsername', username),
    create: (data) => ipcRenderer.invoke('users:create', data),
    setActive: (userId, active) => ipcRenderer.invoke('users:setActive', userId, active),
    update: (id, data) => ipcRenderer.invoke('users:update', id, data),
  },

  // Módulo B: Base de datos y Catálogo
  db: {
    getAreas: () => ipcRenderer.invoke('db:getAreas'),
    getResources: (filters) => ipcRenderer.invoke('db:getResources', filters),
    getResourceById: (id) => ipcRenderer.invoke('db:getResourceById', id),
    saveResource: (data, userId) => ipcRenderer.invoke('db:saveResource', data, userId),
    getStudentActivityNote: (resourceId, userId) =>
      ipcRenderer.invoke('db:getStudentActivityNote', resourceId, userId),
    saveStudentActivityNote: (data) =>
      ipcRenderer.invoke('db:saveStudentActivityNote', data),
    getAuditLogs: (limit) => ipcRenderer.invoke('db:getAuditLogs', limit),
    createBackup: () => ipcRenderer.invoke('db:createBackup'),
    listBackups: () => ipcRenderer.invoke('db:listBackups'),
  },

  // Módulo C: Archivos Educativos Locales
  files: {
    openFile: (relativePath) => ipcRenderer.invoke('files:openFile', relativePath),
    checkFileExists: (relativePath) => ipcRenderer.invoke('files:checkFileExists', relativePath),
  },
});
