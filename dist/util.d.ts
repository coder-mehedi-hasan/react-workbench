import type { WorkbenchFile } from "./types";
export declare const baseName: (path: string) => string;
export declare const dirName: (path: string) => string;
export declare function guessLanguage(path: string): string;
export type TreeNode = {
    /** Full path of the file or folder. */
    path: string;
    name: string;
    file?: WorkbenchFile;
    children?: TreeNode[];
};
/** Paths as a tree: folders first, then files, each sorted by name. */
export declare function buildTree(files: WorkbenchFile[], 
/** Folders to show even when no file is in them. */
emptyFolders?: string[]): TreeNode[];
/** Subsequence match, like Quick Open: `whf` finds `widgets/hero.fluid`. */
export declare function fuzzyScore(query: string, text: string): number | null;
/** Every folder a list of file paths implies: `a/b/c.txt` gives `a` and `a/b`. */
export declare function foldersOf(paths: string[]): Set<string>;
