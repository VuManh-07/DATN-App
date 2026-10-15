import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { DefinePlugin } from "webpack";
import dotenv from "dotenv";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

dotenv.config();

/**
 * Env vars the renderer is allowed to see.
 *
 * The renderer has no `process.env` at runtime, so these are substituted as
 * string literals at build time. Keep the list explicit: whatever is added
 * here ends up readable in the shipped bundle, so it is for endpoints and
 * public identifiers only -- never a secret. Anything sensitive stays in the
 * main process, which reads .env directly through process/config.ts.
 */
const RENDERER_ENV: string[] = [
  // "API_BASE_URL",
];

const rendererEnv = RENDERER_ENV.reduce<Record<string, string>>((acc, key) => {
  acc[`process.env.${key}`] = JSON.stringify(process.env[key] || "");
  return acc;
}, {});

export const plugins = [
  new ForkTsCheckerWebpackPlugin({ logger: "webpack-infrastructure" }),
  new DefinePlugin(rendererEnv),
];
