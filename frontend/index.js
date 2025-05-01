const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');


let win;

function createWindow() {
  // Créer la fenêtre du navigateur
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame:false,
    icon: path.join(__dirname, 'display-frame.png'),
    webPreferences: {
      nodeIntegration: true, // Pour activer l'intégration de Node.js dans ton frontend
      contextIsolation: false,
    }
  });
  ipcMain.on('window-control', (event, action) => {
    if (!win) return;
    if (action === 'minimize') win.minimize();
    if (action === 'maximize') win.isMaximized() ? win.unmaximize() : win.maximize();
    if (action === 'close') win.close();
  });
  

  // Charger le fichier HTML d'accueil (home.html)
  win.loadFile(path.join(__dirname, 'public', 'index.html'));

  // Ouvrir les outils de développement pour le debug
  win.webContents.openDevTools();

  // Fermer la fenêtre quand l'application est fermée
  win.on('closed', () => {
    win = null;
  });
}

// Lancer l'application une fois qu'Electron est prêt
app.whenReady().then(createWindow);

// Quitter l'application lorsque toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Créer une nouvelle fenêtre lorsque l'application est lancée sur macOS
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
