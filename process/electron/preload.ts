import { contextBridge, ipcRenderer } from "electron";

/**
 * The only surface the renderer gets.
 *
 * Expose named functions, never `ipcRenderer` itself: the bridge is what keeps
 * a compromised renderer from invoking arbitrary channels. Each entry here is
 * a deliberate decision about what the UI is allowed to ask for.
 */
const api = {
  config: () => ipcRenderer.invoke("app:config"),
};

contextBridge.exposeInMainWorld("Main", api);

export type MainApi = typeof api;
