const { ipcRenderer, ipcMain } = require('electron-ipc-mock')();

module.exports = {
  ipcRenderer,
  ipcMain
};
