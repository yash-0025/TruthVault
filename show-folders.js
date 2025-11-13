import fs from "fs";
import path from "path";

// Folders we care about
const IMPORTANT = ["app", "pages", "src"];

// Ignore list
const IGNORE = ["node_modules", ".next", "dist", "build", "out"];

function print(dir, depth = 0, maxDepth = 4) {
  if (depth > maxDepth) return;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    if (IGNORE.includes(item)) continue;

    const full = path.join(dir, item);
    const isDir = fs.lstatSync(full).isDirectory();

    // Print only folders
    if (isDir) {
      console.log("  ".repeat(depth) + "📂 " + item);
      print(full, depth + 1, maxDepth);
    }
  }
}

// Only print important root folders
for (const folder of IMPORTANT) {
  if (fs.existsSync(folder) && fs.lstatSync(folder).isDirectory()) {
    console.log("📌 " + folder);
    print(folder);
  }
}
