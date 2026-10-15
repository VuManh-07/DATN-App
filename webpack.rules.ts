import type { ModuleOptions } from "webpack";

export const rules: Required<ModuleOptions>["rules"] = [
  // Native node modules. The asset relocator emits a "fake" .node file that is
  // really CJS, hence matching on the native_modules path rather than on .node.
  {
    test: /native_modules[/\\].+\.node$/,
    use: "node-loader",
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@vercel/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: "ts-loader",
      // Types are checked out-of-band by fork-ts-checker, so the loader only
      // transpiles: it keeps rebuilds fast without losing type errors.
      options: { transpileOnly: true },
    },
  },
  {
    test: /\.s[ac]ss$/i,
    use: [
      "style-loader",
      "css-loader",
      {
        loader: "sass-loader",
        // dart-sass deprecates the legacy JS API that sass-loader defaults to.
        options: { api: "modern" },
      },
    ],
  },
  {
    test: /\.css$/,
    use: ["style-loader", "css-loader"],
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: "asset/resource",
  },
];
