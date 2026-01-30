const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Receive app closing notification
    onAppClosing: (callback) => {
        ipcRenderer.on('app-closing', () => callback());
    },

    // Notify main process that save is complete
    saveComplete: () => {
        return ipcRenderer.invoke('save-complete');
    },

    // Get application path
    getAppPath: () => {
        return ipcRenderer.invoke('get-app-path');
    },

    // Check if running in Electron
    isElectron: true
});

console.log('Preload script loaded - Electron API exposed');
