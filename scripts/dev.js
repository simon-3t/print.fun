import { createServer } from "http";
import { stat } from "fs/promises";
import { createReadStream } from "fs";
import { dirname, extname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");
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

function resolvePath(urlPath) {
  if (urlPath === "/") {
    return join(projectRoot, "index.html");
  }

  const targetPath = resolve(projectRoot, `.${urlPath}`);
  if (!targetPath.startsWith(projectRoot)) {
    return null;
  }

  return targetPath;
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
    let filePath = resolvePath(pathname);
    if (!filePath) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    const stats = await stat(filePath);
    if (stats.isDirectory()) {
      filePath = join(filePath, "index.html");
    }

    await sendFile(res, filePath);
  } catch (error) {
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
