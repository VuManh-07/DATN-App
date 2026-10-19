"use strict";

import { ipcMain } from "electron";
import { config } from "../config";

/**
 * IPC handlers, registered once after the app is ready.
 *
 * One rule worth keeping: a handler must never let an exception escape as a
 * raw rejection, because the renderer then sees "Error invoking remote method"
 * instead of what actually went wrong. Return a result the caller can act on,
 * or throw an Error whose message is written for the person reading it.
 */
async function registerIpc() {
  ipcMain.handle("app:config", () => ({
    apiBaseUrl: config.apiBaseUrl,
  }));
}

export default registerIpc;
