import type { WorkbenchFile } from "./types";

export const baseName = (path: string) => path.split("/").pop() ?? path;
export const dirName = (path: string) =>
  path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "";

const LANGUAGES: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  json: "json",
  css: "css",
  scss: "scss",
  less: "less",
  html: "html",
  htm: "html",
  xml: "xml",
  svg: "xml",
  md: "markdown",
  yml: "yaml",
  yaml: "yaml",
  liquid: "liquid",
  py: "python",
  sh: "shell",
  sql: "sql",
};

export function guessLanguage(path: string): string {
  const ext = baseName(path).split(".").pop()?.toLowerCase() ?? "";
  return LANGUAGES[ext] ?? "plaintext";
}

export type TreeNode = {
  /** Full path of the file or folder. */
  path: string;
  name: string;
  file?: WorkbenchFile;
  children?: TreeNode[];
};

/** Paths as a tree: folders first, then files, each sorted by name. */

export function buildTree(
  files: WorkbenchFile[],
  /** Folders to show even when no file is in them. */
  emptyFolders: string[] = [],
): TreeNode[] {
  const root: TreeNode = { path: "", name: "", children: [] };
  const folders = new Map<string, TreeNode>([["", root]]);
  const folderAt = (parts: string[]) => {
    let parent = root;
    parts.forEach((name, index) => {
      const path = parts.slice(0, index + 1).join("/");
      let folder = folders.get(path);
      if (!folder) {
        folder = { path, name, children: [] };
        folders.set(path, folder);
        parent.children!.push(folder);
      }
      parent = folder;
    });
    return parent;
  };
  for (const folder of emptyFolders) {
    folderAt(folder.split("/").filter(Boolean));
  }
  for (const file of files) {
    const parts = file.path.split("/").filter(Boolean);
    const name = parts.pop();
    if (!name) continue;
    folderAt(parts).children!.push({ path: file.path, name, file });
  }
  const sort = (node: TreeNode) => {
    node.children?.sort(
      (a, b) =>
        Number(!a.children) - Number(!b.children) || a.name.localeCompare(b.name),
    );
    node.children?.forEach(sort);
  };
  sort(root);
  return root.children!;
}

/** Subsequence match, like Quick Open: `whf` finds `widgets/hero.fluid`. */
export function fuzzyScore(query: string, text: string): number | null {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let score = 0;
  let from = 0;
  let last = -1;
  for (const char of q) {
    const at = t.indexOf(char, from);
    if (at === -1) return null;
    // Letters next to each other, and matches in the file name, rank higher.
    score += at === last + 1 ? 3 : 1;
    if (at >= t.lastIndexOf("/") + 1) score += 2;
    last = at;
    from = at + 1;
  }
  return score - t.length / 100;
}

/** Every folder a list of file paths implies: `a/b/c.txt` gives `a` and `a/b`. */
export function foldersOf(paths: string[]): Set<string> {
  const found = new Set<string>();
  for (const path of paths) {
    const parts = path.split("/").filter(Boolean).slice(0, -1);
    parts.forEach((_, index) => found.add(parts.slice(0, index + 1).join("/")));
  }
  return found;
}
