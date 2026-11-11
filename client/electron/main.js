/**
 * Proceso Principal de Electron (Main Process)
 * Biblioteca Digital - I.E. Secundaria Micaela Bastidas Puyucahua
 *
 * Aplicación de escritorio offline-first para la gestión y consulta de materiales educativos
 */

const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const express = require('express');
const dbService = require('./services/db.service');

const isDev = process.env.ELECTRON_IS_DEV === '1' || process.argv.includes('--dev');
const STORAGE_ROOT = path.resolve(__dirname, '../../storage');
const ANGULAR_DIST_BROWSER = path.resolve(__dirname, '../angular/dist/angular/browser');

let mainWindow = null;
let localServer = null;
let localServerPort = 0;

/**
 * Servidor HTTP local embebido para garantizar funcionamiento 100% offline
 * de la Single Page Application (SPA) Angular con rutas limpias y assets estáticos.
 */
function startLocalServer() {
  return new Promise((resolve, reject) => {
    const serverApp = express();

    // Servir archivos estáticos generados por el build de Angular
    serverApp.use(express.static(ANGULAR_DIST_BROWSER));

    // Servir archivos multimedia locales desde storage/
    serverApp.use('/storage', express.static(STORAGE_ROOT));

    // Fallback para todas las rutas Angular (SPA Routing: /inicio, /admin, /estudiante, etc.)
    serverApp.use((req, res) => {
      const indexPath = path.join(ANGULAR_DIST_BROWSER, 'index.csr.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        const altIndex = path.join(ANGULAR_DIST_BROWSER, 'inicio/index.html');
        if (fs.existsSync(altIndex)) {
          res.sendFile(altIndex);
        } else {
          res.status(404).send('No se encontró el build de Angular. Ejecuta "npm run build" primero.');
        }
      }
    });

    const server = http.createServer(serverApp);
    // Escuchar en puerto aleatorio disponible en localhost
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      localServerPort = addr.port;
      console.log(`[Electron] Servidor local offline activo en http://127.0.0.1:${localServerPort}`);
      resolve(server);
    });

    server.on('error', (err) => {
      reject(err);
    });
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 620,
    title: 'Biblioteca Digital - I.E. Micaela Bastidas Puyucahua',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false, // Se muestra al estar listo para evitar parpadeo blanco
  });

  setupAppMenu();

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('[Electron] Ventana principal lista y desplegada.');
  });

  // Abrir enlaces externos en el navegador del sistema, no dentro de Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      void shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  loadApplication();
}

function loadApplication() {
  if (isDev) {
    const devUrl = 'http://localhost:4200';
    console.log(`[Electron] Modo Desarrollo: Conectando a ${devUrl}`);
    mainWindow.loadURL(devUrl).catch(() => {
      console.warn(`[Electron] Dev server en ${devUrl} no disponible. Cargando servidor local offline...`);
      loadProductionUrl();
    });
  } else {
    loadProductionUrl();
  }
}

function loadProductionUrl() {
  const prodUrl = `http://127.0.0.1:${localServerPort}`;
  console.log(`[Electron] Modo Producción: Cargando ${prodUrl}`);
  mainWindow.loadURL(prodUrl);
}

function setupAppMenu() {
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Inicio',
          accelerator: 'CmdOrCtrl+H',
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(`http://127.0.0.1:${localServerPort}/inicio`);
            }
          },
        },
        { type: 'separator' },
        { label: 'Salir', role: 'quit', accelerator: 'CmdOrCtrl+Q' },
      ],
    },
    {
      label: 'Ver',
      submenu: [
        { label: 'Recargar', role: 'reload', accelerator: 'CmdOrCtrl+R' },
        { label: 'Forzar Recarga', role: 'forceReload', accelerator: 'CmdOrCtrl+Shift+R' },
        { type: 'separator' },
        { label: 'Restablecer Zoom', role: 'resetZoom' },
        { label: 'Acercar Zoom', role: 'zoomIn', accelerator: 'CmdOrCtrl+Plus' },
        { label: 'Alejar Zoom', role: 'zoomOut', accelerator: 'CmdOrCtrl+-' },
        { type: 'separator' },
        { label: 'Pantalla Completa', role: 'togglefullscreen', accelerator: 'F11' },
      ],
    },
    {
      label: 'Herramientas',
      submenu: [
        {
          label: 'Herramientas de Desarrollador',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools();
            }
          },
        },
      ],
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Acerca de Biblioteca Digital',
          click: () => {
            if (mainWindow) {
              mainWindow.loadURL(`http://127.0.0.1:${localServerPort}/acerca`);
            }
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * Handlers IPC para comunicación segura entre Angular y Electron
 */
function registerIpcHandlers() {
  // App Info
  ipcMain.handle('app:getVersion', () => app.getVersion());
  ipcMain.handle('app:getStoragePath', () => STORAGE_ROOT);

  // Database Handlers
  ipcMain.handle('db:getAreas', () => dbService.getAreas());
  ipcMain.handle('db:getResources', (_event, filters) => dbService.getResources(filters));
  ipcMain.handle('db:getResourceById', (_event, id) => dbService.getResourceById(id));
  ipcMain.handle('db:getUsers', () => dbService.getUsers());
  ipcMain.handle('db:getUserByUsername', (_event, username) => dbService.getUserByUsername(username));
  ipcMain.handle('db:getStudentActivityNote', (_event, resourceId, userId) =>
    dbService.getStudentActivityNote(resourceId, userId)
  );
  ipcMain.handle('db:saveStudentActivityNote', (_event, data) =>
    dbService.saveStudentActivityNote(data)
  );
  ipcMain.handle('db:getAuditLogs', (_event, limit) => dbService.getAuditLogs(limit));
  ipcMain.handle('db:recordAudit', (_event, action, userId, details) =>
    dbService.recordAudit(action, userId, details)
  );

  // File Handlers
  ipcMain.handle('files:checkFileExists', (_event, relativePath) => {
    const fullPath = path.join(STORAGE_ROOT, relativePath);
    return fs.existsSync(fullPath);
  });

  ipcMain.handle('files:openFile', async (_event, relativePath) => {
    const fullPath = path.join(STORAGE_ROOT, relativePath);
    if (!fs.existsSync(fullPath)) {
      return { success: false, error: 'El archivo no existe en el almacenamiento local.' };
    }
    const result = await shell.openPath(fullPath);
    if (result) {
      return { success: false, error: result };
    }
    return { success: true };
  });
}

// Inicialización de la aplicación
app.whenReady().then(async () => {
  try {
    localServer = await startLocalServer();
    registerIpcHandlers();
    createMainWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  } catch (error) {
    console.error('[Electron] Error crítico al inicializar aplicación:', error);
  }
});

app.on('window-all-closed', () => {
  dbService.close();
  if (localServer) {
    localServer.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

