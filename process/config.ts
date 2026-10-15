"use strict";

/**
 * Runtime configuration for the Electron main process.
 *
 * Everything that talks to a server is configured here, so the renderer never
 * needs to know a host name and a packaged build can be pointed at a different
 * backend without a rebuild. Values the *renderer* needs are a separate, much
 * smaller list -- see RENDERER_ENV in webpack.plugins.ts -- because those get
 * baked into the bundle and are readable by anyone with the app.
 */

import dotenv from "dotenv";
dotenv.config();

/** Parse the "1 / true / yes" convention used for boolean env vars. */
const flag = (value: string | undefined) => /^(1|true|yes)$/i.test(value || "");

export const config = {
  /** Base URL of the backend API. */
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:1255/api/v1",

  /** HTTP timeout for every server call, in ms. */
  requestTimeout: Number(process.env.API_TIMEOUT || 20000),

  /** Extra logging in the main process. Off unless asked for. */
  debug: flag(process.env.DEBUG),
};

export default config;
