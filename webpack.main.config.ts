import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";

export const mainConfig: Configuration = {
  /** Entry point of the Electron main process. */
  entry: "./process/electron/main.ts",
  module: { rules },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
  /**
   * Native addons are listed here rather than bundled, so a machine without a
   * C++ toolchain can still build the app. Guard the matching `require` at
   * runtime so the feature degrades instead of crashing.
   */
  externals: {},
};
