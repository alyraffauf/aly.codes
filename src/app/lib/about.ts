import fs from "fs";
import path from "path";

const aboutPath = path.join(process.cwd(), "content/about.md");

export function getAboutContent() {
    return fs.readFileSync(aboutPath, "utf8");
}