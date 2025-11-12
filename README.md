# print.fun Development Guide

This project uses Node.js scripts located in the repository root. If you see an error similar to:

```
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path /home/.../package.json
```

it usually means `npm` was executed from a directory that does not contain this project's `package.json`. Run commands from the repository root (the folder that contains `package.json`).

## Getting Started

1. Install dependencies (even if none are currently listed, this ensures `node_modules` exists):
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build the project for production:
   ```bash
   npm run build
   ```

If you are working from a different path on your machine, adjust the commands to ensure the current working directory is the root of this repository before running `npm`.

## Project Configuration

The repository's [`package.json`](./package.json) defines two scripts:

- `npm run dev` — starts `scripts/dev.js`, a simple static file development server bound to `HOST`/`PORT` (defaults to `0.0.0.0:5173`).
- `npm run build` — runs `scripts/build.js` to clean and repopulate the `dist/` directory with the app's static assets.

The manifest does not yet list runtime dependencies, so `npm install` completes immediately but still creates a `package-lock.json` to capture the Node version metadata. Running either script from any directory other than the repository root will re-create the earlier ENOENT error, because npm looks for `package.json` in the current working directory.
