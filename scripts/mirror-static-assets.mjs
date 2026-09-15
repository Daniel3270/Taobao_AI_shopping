import { copyFile, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const exportDirectory = path.resolve("out");
const nextChunks = path.join(exportDirectory, "_next", "static", "chunks");
const safeLineAssets = path.join(exportDirectory, "assets");
const textExtensions = new Set([".css", ".html", ".js", ".txt"]);

async function rewriteNextPaths(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await rewriteNextPaths(entryPath);
      continue;
    }

    if (!textExtensions.has(path.extname(entry.name))) {
      continue;
    }

    const source = await readFile(entryPath, "utf8");
    const rewritten = source
      .replaceAll("/_next/", "/")
      .replaceAll("static/chunks/", "");

    if (rewritten !== source) {
      await writeFile(entryPath, rewritten, "utf8");
    }
  }
}

const chunkEntries = await readdir(nextChunks, { withFileTypes: true });

for (const entry of chunkEntries) {
  if (entry.isFile()) {
    await copyFile(
      path.join(nextChunks, entry.name),
      path.join(safeLineAssets, entry.name),
    );
  }
}

await rewriteNextPaths(exportDirectory);

console.log(`Flattened SafeLine static assets into ${safeLineAssets}`);
