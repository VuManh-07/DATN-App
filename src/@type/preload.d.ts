import type { MainApi } from "../../process/electron/preload";

declare global {
  interface Window {
    /** Preload bridge. See process/electron/preload.ts. */
    Main: MainApi;
  }
}

export {};
