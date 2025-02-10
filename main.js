const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec } = require("child_process");

const isDev = process.env.NODE_ENV !== "production";
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startURL = isDev
    ? "http://localhost:5173" // Sesuaikan dengan port React Vite
    : `file://${path.join(__dirname, "client/dist/index.html")}`;

  mainWindow.loadURL(startURL);

  mainWindow.on("closed", () => (mainWindow = null));
}

app.whenReady().then(() => {
  if (isDev) {
    exec("npm run server"); // Otomatis menjalankan backend
    exec("npm run client"); // Otomatis menjalankan frontend
  }
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
