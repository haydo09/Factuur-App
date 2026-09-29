const { contextBridge, ipcRenderer } = require('electron');

// Expose a minimal, safe API to the renderer process.
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node
  },
  db: {
    klanten: {
      getAll: () => ipcRenderer.invoke('klanten:getAll'),
      insert: (data) => ipcRenderer.invoke('klanten:insert', data),
      update: (id, data) => ipcRenderer.invoke('klanten:update', id, data),
      delete: (id) => ipcRenderer.invoke('klanten:delete', id)
    },
    facturen: {
      getAll: () => ipcRenderer.invoke('facturen:getAll'),
      insert: (data) => ipcRenderer.invoke('facturen:insert', data),
      update: (id, data) => ipcRenderer.invoke('facturen:update', id, data),
      delete: (id) => ipcRenderer.invoke('facturen:delete', id)
    },
    instellingen: {
      get: () => ipcRenderer.invoke('instellingen:get'),
      save: (data) => ipcRenderer.invoke('instellingen:save', data)
    },
    meta: {
      get: (key) => ipcRenderer.invoke('meta:get', key),
      set: (key, value) => ipcRenderer.invoke('meta:set', key, value)
    }
  }
});
