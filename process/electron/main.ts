import { app, BrowserWindow } from "electron";
import registerIpc from "./ipc";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: "#141414",
    // Avoid the white flash before React mounts.
    show: false,
    webPreferences: {
      /**
       * The renderer gets no direct Node access: everything it needs is an
       * explicit function on the preload bridge. Turning this on is the usual
       * shortcut and the usual way an XSS becomes arbitrary file access.
       */
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.removeMenu();
};

app
  .whenReady()
  .then(registerIpc)
  .then(createWindow)
  .catch((error) => {
    console.error("Startup failed", error);
    app.quit();
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
