const { app, BrowserWindow, shell, Menu, ipcMain } = require('electron');
const path = require('path');
const db = require('./database');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1350,
    height: 700,
    center: true,
    title: 'Factuur App',
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });

  mainWindow.loadFile('index.html');
  //mainWindow.webContents.openDevTools();

  // Open http(s) links in the default OS browser instead of an Electron window.
  // file:// links (e.g. invoice-template.html) are allowed to open in a new window.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    // Wider window for the invoice template so the A4 content fits
    if (url.includes('invoice-template.html')) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          width: 1100,
          height: 850,
          center: true,
          title: 'Factuur Template'
        }
      };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

// ====== NeDB IPC Handlers ======

// Klanten
ipcMain.handle('klanten:getAll', () => {
  return new Promise((resolve, reject) => {
    db.klanten.find({}, (err, docs) => err ? reject(err) : resolve(docs));
  });
});

ipcMain.handle('klanten:insert', (event, data) => {
  return new Promise((resolve, reject) => {
    db.klanten.insert(data, (err, doc) => err ? reject(err) : resolve(doc));
  });
});

ipcMain.handle('klanten:update', (event, id, data) => {
  return new Promise((resolve, reject) => {
    db.klanten.update({ _id: id }, { $set: data }, {}, (err) => err ? reject(err) : resolve());
  });
});

ipcMain.handle('klanten:delete', (event, id) => {
  return new Promise((resolve, reject) => {
    db.klanten.remove({ _id: id }, {}, (err) => err ? reject(err) : resolve());
  });
});

// Facturen
ipcMain.handle('facturen:getAll', () => {
  return new Promise((resolve, reject) => {
    db.facturen.find({}, (err, docs) => err ? reject(err) : resolve(docs));
  });
});

ipcMain.handle('facturen:insert', (event, data) => {
  return new Promise((resolve, reject) => {
    db.facturen.insert(data, (err, doc) => err ? reject(err) : resolve(doc));
  });
});

ipcMain.handle('facturen:update', (event, id, data) => {
  return new Promise((resolve, reject) => {
    db.facturen.update({ _id: id }, { $set: data }, {}, (err) => err ? reject(err) : resolve());
  });
});

ipcMain.handle('facturen:delete', (event, id) => {
  return new Promise((resolve, reject) => {
    db.facturen.remove({ _id: id }, {}, (err) => err ? reject(err) : resolve());
  });
});

// Instellingen
ipcMain.handle('instellingen:get', () => {
  return new Promise((resolve, reject) => {
    db.instellingen.findOne({ id: 'company' }, (err, doc) => err ? reject(err) : resolve(doc || {}));
  });
});

ipcMain.handle('instellingen:save', (event, data) => {
  return new Promise((resolve, reject) => {
    db.instellingen.update({ id: 'company' }, data, { upsert: true }, (err) => err ? reject(err) : resolve());
  });
});

// Meta
ipcMain.handle('meta:get', (event, key) => {
  return new Promise((resolve, reject) => {
    db.meta.findOne({ key }, (err, doc) => err ? reject(err) : resolve(doc));
  });
});

ipcMain.handle('meta:set', (event, key, value) => {
  return new Promise((resolve, reject) => {
    db.meta.update({ key }, { key, value }, { upsert: true }, (err) => err ? reject(err) : resolve());
  });
});

app.whenReady().then(() => {
  Menu.setApplicationMenu(null); // Disable default menu bar
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
