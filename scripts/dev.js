import { createServer } from "http";
import { stat } from "fs/promises";
import { createReadStream } from "fs";
import { dirname, extname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");
const publicDir = join(projectRoot, "public");
const host = process.env.HOST || "0.0.0.0";
const port = Number.parseInt(process.env.PORT || "5173", 10);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".json": "application/json; charset=utf-8",
};

async function resolveFile(urlPath) {
  if (urlPath === "/") {
    const filePath = join(projectRoot, "index.html");
    await stat(filePath);
    return filePath;
  }

  const relativePath = `.${urlPath}`;
  const candidates = [
    { root: projectRoot, path: resolve(projectRoot, relativePath) },
    { root: publicDir, path: resolve(publicDir, relativePath) },
  ];

  let isWithinAllowedRoot = false;

  for (const { root, path } of candidates) {
    if (!path.startsWith(root)) {
      continue;
    }

    isWithinAllowedRoot = true;

    try {
      let filePath = path;
      const stats = await stat(path);

      if (stats.isDirectory()) {
        filePath = join(filePath, "index.html");
        await stat(filePath);
      }

      return filePath;
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  if (!isWithinAllowedRoot) {
    const error = new Error("Forbidden");
    error.code = "FORBIDDEN";
    throw error;
  }

  const notFoundError = new Error("Not found");
  notFoundError.code = "ENOENT";
  throw notFoundError;
}

async function sendFile(res, filePath) {
  const extension = extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extension] ?? "application/octet-stream";
  res.writeHead(200, { "Content-Type": contentType });
  createReadStream(filePath).pipe(res);
}

async function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = decodeURIComponent(url.pathname);
    const filePath = await resolveFile(pathname);
    await sendFile(res, filePath);
  } catch (error) {
    if (error.code === "FORBIDDEN") {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    if (error.code === "ENOENT") {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    console.error("Dev server error:", error);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Internal server error");
  }
}

createServer(handler).listen(port, host, () => {
  console.log(`Development server running at http://${host}:${port}`);
  console.log("Press Ctrl+C to stop the server.");
});
