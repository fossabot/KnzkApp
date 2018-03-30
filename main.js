var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 650, height: 800});
  mainWindow.loadURL('file://' + __dirname + '/www/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

