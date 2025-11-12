import { cp, mkdir, rm } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, "..");
const distDir = join(projectRoot, "dist");

async function clean() {
  await rm(distDir, { recursive: true, force: true });
}

async function ensureDist() {
  await mkdir(distDir, { recursive: true });
}

async function copyFileOrDir(source, destination, options = {}) {
  await cp(source, destination, { recursive: true, force: true, ...options });
}

async function build() {
  await clean();
  await ensureDist();
  await copyFileOrDir(join(projectRoot, "index.html"), join(distDir, "index.html"));
  await copyFileOrDir(join(projectRoot, "src"), join(distDir, "src"));
  await copyFileOrDir(join(projectRoot, "public"), distDir);
  console.log("Build completed: dist folder is ready.");
}

build().catch((error) => {
  console.error("Build failed:", error);
  process.exitCode = 1;
});
