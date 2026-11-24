import type { OnMount } from "@monaco-editor/react";
import type { CSSProperties, ReactNode } from "react";

export type MonacoEditor = Parameters<OnMount>[0];
export type Monaco = Parameters<OnMount>[1];

/** One file in the explorer. Folders are made from the paths. */
export type WorkbenchFile = {
  /** Path with forward slashes, e.g. `widgets/hero.fluid`. Also its id. */
  path: string;
  /** Not text: shown with `renderBinary` instead of the editor. */
  binary?: boolean;
  /** Opens in the editor but can't be changed. */
  readOnly?: boolean;
};

export type WorkbenchProblem = {
  /** The file it's about. Leave out for a problem about the whole project. */
  path?: string;
  message: string;
  severity?: "error" | "warning" | "info";
  /** 1-based. With a line, the problem is underlined in the editor. */
  line?: number;
  column?: number;
};

/** An extra view in the side bar, with its own button in the activity bar. */
export type WorkbenchActivity = {
  id: string;
  /** A codicon name without the prefix, e.g. `history`, `source-control`. */
  icon: string;
  title: string;
  /** Number or short text on the button. */
  badge?: ReactNode;
  render: () => ReactNode;
};

/** What a ref to the workbench can do. */
export type WorkbenchHandle = {
  open: (path: string, position?: { line: number; column?: number }) => void;
  /** Save the active file. Resolves false when there was nothing to save or it failed. */
  save: () => Promise<boolean>;
  saveAll: () => Promise<boolean>;
  /** Drop what's loaded and read it again: one file, or every open file. */
  reload: (path?: string) => void;
  dirtyPaths: () => string[];
};

export type WorkbenchProps = {
  /** Shown in the middle of the title bar. */
  title?: ReactNode;
  files: WorkbenchFile[];
  /** A text file's content. Called the first time a file is opened, and on reload. */
  readFile: (path: string) => Promise<string>;
  /**
   * Store a file. Throw (or reject) to keep it marked unsaved; the error's
   * message is shown in the status bar.
   */
  onSave?: (path: string, content: string) => Promise<void> | void;
  /**
   * Copy a file (Copy then Paste in the explorer). Without it, text files are
   * copied by reading the original and creating and saving the copy; other
   * files can't be copied.
   */
  onCopy?: (path: string, newPath: string) => Promise<void> | void;
  /**
   * Rename or move a whole folder. Without it, a folder is renamed by calling
   * `onRename` for each file inside.
   */
  onRenameFolder?: (path: string, newPath: string) => Promise<void> | void;
  /** Delete a folder and what's in it. Without it, only empty folders made in the explorer can be removed. */
  onDeleteFolder?: (path: string) => Promise<void> | void;
  /**
   * Folders to show even when they hold no file. Folders that have files are
   * worked out from `files`, so most hosts never need this.
   */
  folders?: string[];
  /**
   * With these, the explorer offers New File, Rename and Delete. `onRename`
   * also handles a file dragged to another folder: the new path is the folder
   * it was dropped on plus its name.
   */
  onCreate?: (path: string) => Promise<void> | void;
  /**
   * Make a real, empty folder. Leave it out when your storage has no empty
   * folders (object storage, say): New Folder then makes one that lives in
   * the explorer until a file is created inside it. New Folder is offered
   * whenever this or `onCreate` is given.
   */
  onCreateFolder?: (path: string) => Promise<void> | void;
  /**
   * Files dropped onto the explorer from outside the page. Called once per
   * file with the path it was dropped at (`folder/name`). Without it, the
   * explorer ignores outside files.
   */
  onUpload?: (file: File, path: string) => Promise<void> | void;
  /** Adds a Refresh button to the explorer: re-fetch your file list here. */
  onRefresh?: () => Promise<void> | void;
  onRename?: (path: string, newPath: string) => Promise<void> | void;
  onDelete?: (path: string) => Promise<void> | void;

  problems?: WorkbenchProblem[];
  theme?: "dark" | "light";
  /** Nothing can be edited, saved, created, renamed or deleted. */
  readOnly?: boolean;
  /**
   * Show a file as saved the moment a save starts, and as unsaved again if
   * `onSave` throws. `onDirtyChange` and `dirtyPaths()` still count it as
   * unsaved until `onSave` has finished. Off by default.
   */
  optimisticSave?: boolean;

  /** Monaco language id for a path. Defaults to a guess from the extension. */
  language?: (path: string) => string | undefined;
  /** Icon for a file or folder. Defaults to codicons. */
  fileIcon?: (path: string, state: { folder: boolean; open: boolean }) => ReactNode;
  /** What to show for a `binary` file (an image preview, say). */
  renderBinary?: (file: WorkbenchFile) => ReactNode;

  /** Buttons at the right of the title bar. */
  actions?: ReactNode;
  /** More side bar views, after the Explorer. */
  activities?: WorkbenchActivity[];
  statusLeft?: ReactNode;
  statusRight?: ReactNode;
  /** Heading of the explorer tree. Defaults to `title` or "Files". */
  explorerTitle?: string;

  /** Runs once before the first editor is made: register languages, schemas, themes. */
  beforeMount?: (monaco: Monaco) => void;
  onMount?: (editor: MonacoEditor, monaco: Monaco) => void;
  /** Merged over the defaults. */
  editorOptions?: Record<string, unknown>;
  /** Prefix of every model URI; make it unique when two workbenches share a page. */
  modelScope?: string;

  onActiveFileChange?: (path: string | null) => void;
  onDirtyChange?: (paths: string[]) => void;

  className?: string;
  /** The workbench fills its parent; give the parent a height, or set one here. */
  style?: CSSProperties;
};
