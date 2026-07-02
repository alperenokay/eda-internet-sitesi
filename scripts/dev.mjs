#!/usr/bin/env node
/** Dev sunucusu: NODE_ENV=development zorunlu (aksi halde jsxDEV hatası). */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadEnv } from "./load-env.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const astroCli = join(root, "node_modules", "astro", "astro.js");

loadEnv();
process.env.NODE_ENV = "development";

const child = spawn(process.execPath, [astroCli, "dev"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
