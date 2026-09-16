import fs from "fs";
import path from "path";

const projectsPath = path.join(process.cwd(), "content/projects.md");

export function getProjectsContent() {
  return fs.readFileSync(projectsPath, "utf8");
}
