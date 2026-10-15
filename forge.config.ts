import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {},
  /**
   * No native addon is bundled (see `externals` in webpack.main.config.ts), so
   * skip @electron/rebuild entirely -- it would otherwise try to compile every
   * transitive native dependency from source and need a full MSVC + Windows
   * SDK setup. Remove this once a real native module is added.
   */
  rebuildConfig: { onlyModules: [] },
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      /**
       * Dev-server ports, moved off the plugin defaults (3000 / 9000) because
       * those collide with anything else serving a web app on this machine.
       */
      port: 3040,
      loggerPort: 9040,
      /**
       * Renderer CSP for `start`.
       *
       * Every host the renderer talks to must be listed here or the browser
       * blocks the request before it leaves the process -- and a blocked call
       * looks exactly like an empty response, so add the host at the same time
       * you add the code that calls it.
       */
      devContentSecurityPolicy: [
        "connect-src 'self'",
        "http://localhost:*",
        "ws://localhost:*",
        "'unsafe-eval'",
      ].join(" "),
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./public/index.html",
            js: "./src/index.tsx",
            name: "main_window",
            preload: {
              js: "./process/electron/preload.ts",
            },
          },
        ],
      },
    }),
  ],
};

export default config;
