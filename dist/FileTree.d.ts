import { type ReactNode } from "react";
import { type MenuItem } from "./Menu";
import type { WorkbenchFile } from "./types";
import { type TreeNode } from "./util";
/** What's being typed in the tree: a new file or folder, or a new name for a file. */
export type TreeEdit = {
    kind: "create";
    type: "file" | "folder";
    folder: string;
} | {
    kind: "rename";
    path: string;
} | null;
/** The row the keyboard and the header buttons act on. */
export type TreeFocus = {
    path: string;
    folder: boolean;
} | null;
type Props = {
    files: WorkbenchFile[];
    /** Folders to show even when empty. */
    emptyFolders: string[];
    activePath: string | null;
    dirtyPaths: Set<string>;
    problemOf: (path: string) => "error" | "warning" | undefined;
    icon: (path: string, state: {
        folder: boolean;
        open: boolean;
    }) => ReactNode;
    collapsed: Set<string>;
    onToggle: (folder: string) => void;
    onOpen: (file: WorkbenchFile) => void;
    onFocus: (focus: TreeFocus) => void;
    edit: TreeEdit;
    onEdit: (edit: TreeEdit) => void;
    /** The typed name was confirmed; `path` is the full new path. */
    onSubmitEdit: (edit: NonNullable<TreeEdit>, path: string) => void;
    canCreateFile: boolean;
    canCreateFolder: boolean;
    canRename: boolean;
    canDelete: boolean;
    onDelete: (file: WorkbenchFile) => void;
    /** A file was dragged onto another folder. */
    /** The right-click menu for a row, or for the empty space (`null`). */
    menuFor: (node: TreeNode | null) => MenuItem[];
    /** The path that was cut, shown dimmed until it's pasted. */
    cutPath: string | null;
    /** ⌘C / ⌘X / ⌘V and F2 / Delete on the focused row. */
    onShortcut: (action: "copy" | "cut" | "paste" | "rename" | "delete", node: TreeNode) => void;
    canMove: boolean;
    onMove: (path: string, newPath: string) => void;
    /** Files were dropped in from outside the page. */
    canUpload: boolean;
    onDropFiles: (files: File[], folder: string) => void;
};
export declare function FileTree(props: Props): import("react").JSX.Element;
export {};
