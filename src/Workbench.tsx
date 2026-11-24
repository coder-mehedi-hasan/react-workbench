import Editor from "@monaco-editor/react";
import "@vscode/codicons/dist/codicon.css";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { FileTree, type TreeEdit, type TreeFocus } from "./FileTree";
import { defaultFileIcon, Icon } from "./Icon";
import { Menu, tidyMenu, type MenuItem } from "./Menu";
import { QuickOpen, type QuickCommand } from "./QuickOpen";
import type {
  Monaco,
  MonacoEditor,
  WorkbenchHandle,
  WorkbenchProblem,
  WorkbenchProps,
} from "./types";
import {
  baseName,
  dirName,
  foldersOf,
  guessLanguage,
  type TreeNode,
} from "./util";
import "./workbench.css";

type Buffer = { text: string; saved: string };
type Severity = NonNullable<WorkbenchProblem["severity"]>;

const EXPLORER = "explorer";
const SEVERITY_ICON: Record<Severity, string> = {
  error: "error",
  warning: "warning",
  info: "info",
};
const isMac =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
const MOD = isMac ? "⌘" : "Ctrl+";

/** A draggable divider. `onDrag` gets the pointer position on its axis. */
function Sash({
  axis,
  onDrag,
}: {
  axis: "x" | "y";
  onDrag: (position: number) => void;
}) {
  const [dragging, setDragging] = useState(false);
  return (
    <div
      className={`wb-sash wb-sash-${axis}`}
      data-dragging={dragging}
      role="separator"
      aria-orientation={axis === "x" ? "vertical" : "horizontal"}
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
      }}
      onPointerMove={(event) => {
        if (dragging) onDrag(axis === "x" ? event.clientX : event.clientY);
      }}
      onPointerUp={(event) => {
        event.currentTarget.releasePointerCapture(event.pointerId);
        setDragging(false);
      }}
    />
  );
}

const messageOf = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

/**
 * A VS Code style workbench: activity bar, explorer, tabs, a Monaco editor,
 * a problems panel and a status bar. It keeps the open tabs and unsaved text
 * itself; the host supplies the file list and how to read and store a file.
 */
export const Workbench = forwardRef<WorkbenchHandle, WorkbenchProps>(
  function Workbench(props, ref) {
    const {
      files,
      readFile,
      onSave,
      onCreate,
      onCreateFolder,
      onRefresh,
      onUpload,
      onRename,
      onDelete,
      onCopy,
      onRenameFolder,
      onDeleteFolder,
      problems = [],
      theme = "dark",
      readOnly = false,
      modelScope = "workbench",
    } = props;

    const rootRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<MonacoEditor | null>(null);
    const [monaco, setMonaco] = useState<Monaco | null>(null);

    const [sideView, setSideView] = useState<string | null>(EXPLORER);
    const [sideWidth, setSideWidth] = useState(260);
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelHeight, setPanelHeight] = useState(200);
    /** What Go to File starts with: "" for files, ">" for commands. */
    const [quickOpen, setQuickOpen] = useState<string | null>(null);

    const [openPaths, setOpenPaths] = useState<string[]>([]);
    const [activePath, setActivePath] = useState<string | null>(null);
    const [buffers, setBuffers] = useState<Record<string, Buffer>>({});
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
    const [edit, setEdit] = useState<TreeEdit>(null);
    // Folders made in the explorer that the host has no record of yet.
    const [localFolders, setLocalFolders] = useState<Set<string>>(new Set());
    const [refreshing, setRefreshing] = useState(false);
    const treeFocus = useRef<TreeFocus>(null);
    const [cursor, setCursor] = useState({ line: 1, column: 1 });
    const [notice, setNotice] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // Latest values for handlers that outlive a render (editor commands, the ref).
    const live = useRef({ buffers, activePath, openPaths, files });
    live.current = { buffers, activePath, openPaths, files };
    const loading = useRef(new Set<string>());
    const savingPaths = useRef(new Set<string>());
    const pendingReveal = useRef<{
      path: string;
      line: number;
      column: number;
    } | null>(null);
    const pendingOpen = useRef<string | null>(null);
    const renaming = useRef(new Set<string>());
    const [clipboard, setClipboard] = useState<{
      path: string;
      mode: "cut" | "copy";
    } | null>(null);
    const [tabMenu, setTabMenu] = useState<{
      x: number;
      y: number;
      path: string;
    } | null>(null);

    const filesByPath = useMemo(
      () => new Map(files.map((file) => [file.path, file])),
      [files],
    );
    const activeFile = activePath ? (filesByPath.get(activePath) ?? null) : null;
    const realFolders = useMemo(
      () => foldersOf(files.map((file) => file.path)),
      [files],
    );
    const emptyFolders = useMemo(
      () => [...new Set([...(props.folders ?? []), ...localFolders])],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [props.folders, localFolders],
    );
    // Once a file is in a folder it's real: stop tracking it as explorer-only.
    useEffect(() => {
      setLocalFolders((current) => {
        const kept = [...current].filter((folder) => !realFolders.has(folder));
        return kept.length === current.size ? current : new Set(kept);
      });
    }, [realFolders]);
    const activeBuffer = activePath ? buffers[activePath] : undefined;

    const dirtyPaths = useMemo(
      () =>
        Object.entries(buffers)
          .filter(([, buffer]) => buffer.text !== buffer.saved)
          .map(([path]) => path),
      [buffers],
    );
    const dirtySet = useMemo(() => new Set(dirtyPaths), [dirtyPaths]);

    const { onActiveFileChange, onDirtyChange } = props;
    useEffect(() => {
      onActiveFileChange?.(activePath);
      // The readout is the new file's until its editor reports a position.
      setCursor({ line: 1, column: 1 });
    }, [activePath, onActiveFileChange]);
    const dirtyKey = dirtyPaths.join("\n");
    useEffect(
      () => onDirtyChange?.(dirtyKey ? dirtyKey.split("\n") : []),
      [dirtyKey, onDirtyChange],
    );

    const languageOf = useCallback(
      (path: string) => props.language?.(path) ?? guessLanguage(path),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [props.language],
    );
    const iconOf = useCallback(
      (path: string, state = { folder: false, open: false }): ReactNode =>
        props.fileIcon?.(path, state) ?? defaultFileIcon(path, state),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [props.fileIcon],
    );
    const uriOf = useCallback(
      (path: string) => `file:///${modelScope}/${path}`,
      [modelScope],
    );

    const load = useCallback(
      (path: string) => {
        if (loading.current.has(path)) return;
        loading.current.add(path);
        readFile(path)
          .then((text) =>
            setBuffers((current) => ({
              ...current,
              [path]: { text, saved: text },
            })),
          )
          .catch((error) => {
            // A file removed while it was being read isn't worth reporting.
            if (live.current.files.some((file) => file.path === path)) {
              setNotice(`Couldn't open ${path}: ${messageOf(error)}`);
            }
          })
          .finally(() => loading.current.delete(path));
      },
      [readFile],
    );

    const open = useCallback(
      (path: string, position?: { line: number; column?: number }) => {
        const file = live.current.files.find((entry) => entry.path === path);
        if (!file) {
          // Just created: open it once the host lists it.
          pendingOpen.current = path;
          return;
        }
        setNotice(null);
        setOpenPaths((current) =>
          current.includes(path) ? current : [...current, path],
        );
        setActivePath(path);
        if (position) {
          pendingReveal.current = {
            path,
            line: position.line,
            column: position.column ?? 1,
          };
        }
        if (!file.binary && !live.current.buffers[path]) load(path);
      },
      [load],
    );

    const disposeModel = useCallback(
      (path: string) => {
        monaco?.editor.getModel(monaco.Uri.parse(uriOf(path)))?.dispose();
      },
      [monaco, uriOf],
    );

    const forget = useCallback(
      (paths: string[]) => {
        if (!paths.length) return;
        const gone = new Set(paths);
        setOpenPaths((current) => {
          const rest = current.filter((path) => !gone.has(path));
          setActivePath((active) => {
            if (!active || !gone.has(active)) return active;
            const index = current.indexOf(active);
            return rest[Math.min(index, rest.length - 1)] ?? null;
          });
          return rest;
        });
        setBuffers((current) => {
          const next = { ...current };
          for (const path of paths) delete next[path];
          return next;
        });
        paths.forEach(disposeModel);
      },
      [disposeModel],
    );

    const close = (path: string) => {
      if (
        dirtySet.has(path) &&
        !window.confirm(
          `Close ${baseName(path)} without saving? Your changes will be lost.`,
        )
      ) {
        return;
      }
      forget([path]);
    };

    // The host's file list is the truth: tabs of files that are gone close.
    useEffect(() => {
      forget(
        live.current.openPaths.filter(
          (path) => !filesByPath.has(path) && !renaming.current.has(path),
        ),
      );
      const wanted = pendingOpen.current;
      if (wanted && filesByPath.has(wanted)) {
        pendingOpen.current = null;
        open(wanted);
      }
    }, [filesByPath, forget, open]);

    const save = useCallback(
      async (path: string | null = live.current.activePath) => {
        const buffer = path ? live.current.buffers[path] : undefined;
        if (!path || !buffer || !onSave || readOnly) return false;
        if (buffer.text === buffer.saved || savingPaths.current.has(path)) {
          return false;
        }
        const text = buffer.text;
        savingPaths.current.add(path);
        setSaving(true);
        setNotice(null);
        try {
          await onSave(path, text);
          setBuffers((current) =>
            current[path]
              ? { ...current, [path]: { ...current[path]!, saved: text } }
              : current,
          );
          return true;
        } catch (error) {
          setNotice(`Couldn't save ${baseName(path)}: ${messageOf(error)}`);
          return false;
        } finally {
          savingPaths.current.delete(path);
          setSaving(savingPaths.current.size > 0);
        }
      },
      [onSave, readOnly],
    );

    const saveAll = useCallback(async () => {
      const results = await Promise.all(
        Object.keys(live.current.buffers).map((path) => {
          const buffer = live.current.buffers[path]!;
          return buffer.text === buffer.saved ? true : save(path);
        }),
      );
      return results.every(Boolean);
    }, [save]);

    const reload = useCallback(
      (path?: string) => {
        // Only files that still exist: a tab whose file is gone is closing.
        const paths = (path ? [path] : live.current.openPaths).filter((each) =>
          filesByPath.has(each),
        );
        setBuffers((current) => {
          const next = { ...current };
          for (const each of paths) delete next[each];
          return next;
        });
        for (const each of paths) {
          disposeModel(each);
          if (!filesByPath.get(each)?.binary) load(each);
        }
      },
      [disposeModel, filesByPath, load],
    );

    useImperativeHandle(
      ref,
      () => ({
        open,
        save: () => save(),
        saveAll,
        reload,
        dirtyPaths: () =>
          Object.entries(live.current.buffers)
            .filter(([, buffer]) => buffer.text !== buffer.saved)
            .map(([path]) => path),
      }),
      [open, reload, save, saveAll],
    );

    const isFolder = (path: string) =>
      realFolders.has(path) || emptyFolders.includes(path);
    const exists = (path: string) => filesByPath.has(path) || isFolder(path);

    /** Files changed path: carry their tabs and unsaved text along. */
    const movePaths = (moves: Map<string, string>) => {
      setOpenPaths((current) => current.map((each) => moves.get(each) ?? each));
      setActivePath((active) => (active ? (moves.get(active) ?? active) : active));
      setBuffers((current) => {
        const next: Record<string, Buffer> = {};
        for (const [each, buffer] of Object.entries(current)) {
          next[moves.get(each) ?? each] = buffer;
        }
        return next;
      });
      for (const from of moves.keys()) disposeModel(from);
    };

    const rename = async (from: string, to: string) => {
      const moves = new Map<string, string>();
      if (isFolder(from)) {
        for (const file of files) {
          if (file.path.startsWith(`${from}/`)) {
            moves.set(file.path, `${to}${file.path.slice(from.length)}`);
          }
        }
      } else {
        moves.set(from, to);
      }
      for (const each of moves.keys()) renaming.current.add(each);
      try {
        if (!isFolder(from)) await onRename?.(from, to);
        else if (onRenameFolder) await onRenameFolder(from, to);
        else {
          for (const [each, target] of moves) await onRename?.(each, target);
        }
        movePaths(moves);
        // Explorer-only folders inside it move too.
        setLocalFolders((current) => {
          const next = new Set<string>();
          for (const folder of current) {
            next.add(
              folder === from || folder.startsWith(`${from}/`)
                ? `${to}${folder.slice(from.length)}`
                : folder,
            );
          }
          return next;
        });
      } finally {
        for (const each of moves.keys()) renaming.current.delete(each);
      }
    };

    const submitEdit = async (done: NonNullable<TreeEdit>, path: string) => {
      setEdit(null);
      setNotice(null);
      if (exists(path)) {
        setNotice(`${path} already exists`);
        return;
      }
      try {
        if (done.kind === "create" && done.type === "folder") {
          if (onCreateFolder) await onCreateFolder(path);
          else setLocalFolders((current) => new Set(current).add(path));
          setCollapsed((current) => {
            const next = new Set(current);
            next.delete(path);
            return next;
          });
          treeFocus.current = { path, folder: true };
        } else if (done.kind === "create") {
          await onCreate?.(path);
          open(path);
        } else {
          await rename(done.path, path);
        }
      } catch (error) {
        setNotice(messageOf(error));
      }
    };

    /** A free name in a folder: `a.txt`, then `a copy.txt`, `a copy 2.txt`, … */
    const freePath = (folder: string, name: string) => {
      const at = (candidate: string) => (folder ? `${folder}/${candidate}` : candidate);
      if (!exists(at(name))) return at(name);
      const dot = name.lastIndexOf(".");
      const stem = dot > 0 ? name.slice(0, dot) : name;
      const ext = dot > 0 ? name.slice(dot) : "";
      for (let count = 1; ; count++) {
        const candidate = `${stem} copy${count > 1 ? ` ${count}` : ""}${ext}`;
        if (!exists(at(candidate))) return at(candidate);
      }
    };

    const paste = async (folder: string) => {
      if (!clipboard) return;
      const { path: from, mode } = clipboard;
      setNotice(null);
      try {
        if (mode === "cut") {
          setClipboard(null);
          const to = folder ? `${folder}/${baseName(from)}` : baseName(from);
          if (to === from) return;
          if (exists(to)) throw new Error(`${to} already exists`);
          await rename(from, to);
          return;
        }
        const to = freePath(folder, baseName(from));
        if (onCopy) {
          await onCopy(from, to);
        } else if (filesByPath.get(from)?.binary || !onCreate) {
          throw new Error(`${baseName(from)} can't be copied here`);
        } else {
          const content = live.current.buffers[from]?.saved ?? (await readFile(from));
          await onCreate(to);
          if (content) await onSave?.(to, content);
        }
        open(to);
      } catch (error) {
        setNotice(messageOf(error));
      }
    };

    /** Where the header's New File / New Folder go: the focused folder, like VS Code. */
    const targetFolder = () => {
      const focus = treeFocus.current;
      if (focus) return focus.folder ? focus.path : dirName(focus.path);
      return activePath ? dirName(activePath) : "";
    };
    const startCreate = (type: "file" | "folder") => {
      const folder = targetFolder();
      setCollapsed((current) => {
        if (!folder || !current.has(folder)) return current;
        const next = new Set(current);
        next.delete(folder);
        return next;
      });
      setEdit({ kind: "create", type, folder });
    };
    const upload = async (dropped: File[], folder: string) => {
      setNotice(null);
      setSaving(true);
      try {
        for (const file of dropped) {
          await onUpload?.(file, folder ? `${folder}/${file.name}` : file.name);
        }
      } catch (error) {
        setNotice(messageOf(error));
      } finally {
        setSaving(savingPaths.current.size > 0);
      }
    };
    const refresh = async () => {
      if (!onRefresh || refreshing) return;
      setRefreshing(true);
      setNotice(null);
      try {
        await onRefresh();
      } catch (error) {
        setNotice(messageOf(error));
      } finally {
        setRefreshing(false);
      }
    };

    const remove = async (path: string) => {
      setNotice(null);
      try {
        if (!isFolder(path)) await onDelete?.(path);
        else if (onDeleteFolder) await onDeleteFolder(path);
        setLocalFolders((current) => {
          const kept = [...current].filter(
            (folder) => folder !== path && !folder.startsWith(`${path}/`),
          );
          return kept.length === current.size ? current : new Set(kept);
        });
      } catch (error) {
        setNotice(messageOf(error));
      }
    };

    // Problems, by file, and the worst one for a file's label colour.
    const worst = useMemo(() => {
      const map = new Map<string, "error" | "warning">();
      for (const problem of problems) {
        if (!problem.path || problem.severity === "info") continue;
        const severity = problem.severity === "warning" ? "warning" : "error";
        if (map.get(problem.path) !== "error") map.set(problem.path, severity);
      }
      return map;
    }, [problems]);
    const counts = useMemo(() => {
      const total = { error: 0, warning: 0, info: 0 };
      for (const problem of problems) total[problem.severity ?? "error"]++;
      return total;
    }, [problems]);
    const grouped = useMemo(() => {
      const groups = new Map<string, WorkbenchProblem[]>();
      for (const problem of problems) {
        const key = problem.path ?? "";
        groups.set(key, [...(groups.get(key) ?? []), problem]);
      }
      return [...groups];
    }, [problems]);

    // Underline the open file's problems that name a line.
    useEffect(() => {
      if (!monaco || !activePath || !activeBuffer) return;
      const model = monaco.editor.getModel(monaco.Uri.parse(uriOf(activePath)));
      if (!model) return;
      monaco.editor.setModelMarkers(
        model,
        "workbench",
        problems
          .filter((problem) => problem.path === activePath)
          .map((problem) => {
            const line = Math.min(
              Math.max(problem.line ?? 1, 1),
              model.getLineCount(),
            );
            const column = Math.max(problem.column ?? 1, 1);
            return {
              severity:
                problem.severity === "warning"
                  ? monaco.MarkerSeverity.Warning
                  : problem.severity === "info"
                    ? monaco.MarkerSeverity.Info
                    : monaco.MarkerSeverity.Error,
              message: problem.message,
              startLineNumber: line,
              startColumn: column,
              endLineNumber: line,
              endColumn: model.getLineMaxColumn(line),
            };
          }),
      );
    }, [monaco, activePath, activeBuffer, problems, uriOf]);

    // Jump to a problem's line once its file is showing.
    useEffect(() => {
      const target = pendingReveal.current;
      const editor = editorRef.current;
      if (!target || !editor || target.path !== activePath || !activeBuffer) {
        return;
      }
      const timer = setTimeout(() => {
        pendingReveal.current = null;
        editor.revealLineInCenter(target.line);
        editor.setPosition({ lineNumber: target.line, column: target.column });
        editor.focus();
      }, 0);
      return () => clearTimeout(timer);
    }, [activePath, activeBuffer]);

    // Shortcuts work anywhere in the workbench, editor included.
    const onKeyDownCapture = (event: React.KeyboardEvent | KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === "s") {
        event.preventDefault();
        event.stopPropagation();
        void (event.shiftKey ? saveAll() : save());
      } else if (key === "p" && !event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        setQuickOpen("");
      } else if (key === "p") {
        event.preventDefault();
        event.stopPropagation();
        setQuickOpen(">");
      } else if (key === "b") {
        event.preventDefault();
        setSideView((view) => (view ? null : EXPLORER));
      } else if (key === "j") {
        event.preventDefault();
        setPanelOpen((value) => !value);
      }
    };

    // With nothing focused (a fresh page, the welcome screen) keys land on
    // <body> and never reach the workbench, so pick them up from there too.
    const shortcut = useRef(onKeyDownCapture);
    shortcut.current = onKeyDownCapture;
    useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.target === document.body) shortcut.current(event);
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, []);

    /** The workbench's own commands, then everything the open editor can do. */
    const commands = (): QuickCommand[] => {
      const editor = editorRef.current;
      return [
        { id: "wb.save", label: "File: Save", run: () => void save() },
        { id: "wb.saveAll", label: "File: Save All", run: () => void saveAll() },
        {
          id: "wb.sideBar",
          label: "View: Toggle Side Bar",
          run: () => setSideView((view) => (view ? null : EXPLORER)),
        },
        {
          id: "wb.problems",
          label: "View: Toggle Problems",
          run: () => setPanelOpen((value) => !value),
        },
        ...(editor?.getSupportedActions() ?? [])
          .filter((action) => action.label)
          .map((action) => ({
            id: action.id,
            // Monaco's own palette, which shows each command's shortcut.
            label:
              action.id === "editor.action.quickCommand"
                ? "Editor: Command Palette (F1)"
                : action.label,
            run: () => {
              editor?.focus();
              void action.run();
            },
          })),
      ];
    };

    // Unsaved text asks before the page goes away.
    const hasDirty = dirtyPaths.length > 0;
    useEffect(() => {
      if (!hasDirty) return;
      const warn = (event: BeforeUnloadEvent) => event.preventDefault();
      window.addEventListener("beforeunload", warn);
      return () => window.removeEventListener("beforeunload", warn);
    }, [hasDirty]);

    const canEdit = !readOnly;
    const canCreateFile = Boolean(onCreate) && canEdit;
    const canCreateFolder = Boolean(onCreateFolder || onCreate) && canEdit;
    const canRenameFile = Boolean(onRename) && canEdit;
    const canRenameFolder = Boolean(onRenameFolder || onRename) && canEdit;
    const canDeleteFile = Boolean(onDelete) && canEdit;
    const canCopy = Boolean(onCopy || onCreate) && canEdit;
    const canPaste =
      canEdit &&
      Boolean(clipboard) &&
      (clipboard?.mode === "cut" ? canRenameFile : canCopy);
    /** A folder that can go: with the host's help, or an empty one made here. */
    const canDeleteFolder = (path: string) =>
      canEdit &&
      (Boolean(onDeleteFolder) ||
        (localFolders.has(path) && !realFolders.has(path)));
    const createIn = (type: "file" | "folder", folder: string) => {
      setCollapsed((current) => {
        if (!folder || !current.has(folder)) return current;
        const next = new Set(current);
        next.delete(folder);
        return next;
      });
      setEdit({ kind: "create", type, folder });
    };
    const copyPath = (path: string) => void navigator.clipboard?.writeText(path);
    const collapseAll = () =>
      setCollapsed(new Set([...realFolders, ...emptyFolders]));

    /** The explorer's right-click menu, laid out like VS Code's. */
    const explorerMenu = (node: TreeNode | null): MenuItem[] => {
      const folder = Boolean(node?.children);
      const target = node ? (folder ? node.path : dirName(node.path)) : "";
      const create: MenuItem[] = [];
      if (canCreateFile) {
        create.push({ label: "New File…", run: () => createIn("file", target) });
      }
      if (canCreateFolder) {
        create.push({
          label: "New Folder…",
          run: () => createIn("folder", target),
        });
      }
      const pasteItem: MenuItem | null =
        canRenameFile || canCopy
          ? {
              label: "Paste",
              keys: `${MOD}V`,
              disabled: !canPaste,
              run: () => void paste(target),
            }
          : null;
      if (!node) {
        return tidyMenu([
          ...create,
          "separator",
          pasteItem,
          "separator",
          onRefresh ? { label: "Refresh Explorer", run: () => void refresh() } : null,
          { label: "Collapse Folders", run: collapseAll },
        ]);
      }
      if (folder) {
        return tidyMenu([
          ...create,
          "separator",
          pasteItem,
          "separator",
          { label: "Copy Path", run: () => copyPath(node.path) },
          "separator",
          canRenameFolder
            ? {
                label: "Rename…",
                keys: "F2",
                run: () => setEdit({ kind: "rename", path: node.path }),
              }
            : null,
          canDeleteFolder(node.path)
            ? { label: "Delete", keys: "Del", run: () => void remove(node.path) }
            : null,
        ]);
      }
      return tidyMenu([
        { label: "Open", run: () => open(node.path) },
        "separator",
        canRenameFile
          ? {
              label: "Cut",
              keys: `${MOD}X`,
              run: () => setClipboard({ path: node.path, mode: "cut" }),
            }
          : null,
        canCopy
          ? {
              label: "Copy",
              keys: `${MOD}C`,
              run: () => setClipboard({ path: node.path, mode: "copy" }),
            }
          : null,
        pasteItem,
        "separator",
        { label: "Copy Path", run: () => copyPath(node.path) },
        "separator",
        canRenameFile
          ? {
              label: "Rename…",
              keys: "F2",
              run: () => setEdit({ kind: "rename", path: node.path }),
            }
          : null,
        canDeleteFile
          ? { label: "Delete", keys: "Del", run: () => void remove(node.path) }
          : null,
      ]);
    };

    const treeShortcut = (
      action: "copy" | "cut" | "paste" | "rename" | "delete",
      node: TreeNode,
    ) => {
      const folder = Boolean(node.children);
      if (action === "paste") {
        if (canPaste) void paste(folder ? node.path : dirName(node.path));
      } else if (action === "rename") {
        if (folder ? canRenameFolder : canRenameFile) {
          setEdit({ kind: "rename", path: node.path });
        }
      } else if (action === "delete") {
        if (folder ? canDeleteFolder(node.path) : canDeleteFile) {
          void remove(node.path);
        }
      } else if (!folder && (action === "cut" ? canRenameFile : canCopy)) {
        setClipboard({ path: node.path, mode: action });
      }
    };

    /** Close several tabs, asking once if any has unsaved text. */
    const closeMany = (paths: string[]) => {
      const unsaved = paths.filter((path) => dirtySet.has(path));
      if (
        unsaved.length &&
        !window.confirm(
          unsaved.length === 1
            ? `Close ${baseName(unsaved[0]!)} without saving? Your changes will be lost.`
            : `Close ${unsaved.length} files without saving? Your changes will be lost.`,
        )
      ) {
        return;
      }
      forget(paths);
    };
    const tabMenuItems = (path: string): MenuItem[] => {
      const index = openPaths.indexOf(path);
      const others = openPaths.filter((each) => each !== path);
      const right = openPaths.slice(index + 1);
      const saved = openPaths.filter((each) => !dirtySet.has(each));
      return tidyMenu([
        { label: "Close", run: () => closeMany([path]) },
        {
          label: "Close Others",
          disabled: !others.length,
          run: () => closeMany(others),
        },
        {
          label: "Close to the Right",
          disabled: !right.length,
          run: () => closeMany(right),
        },
        { label: "Close Saved", disabled: !saved.length, run: () => forget(saved) },
        { label: "Close All", run: () => closeMany(openPaths) },
        "separator",
        { label: "Copy Path", run: () => copyPath(path) },
        {
          label: "Reveal in Explorer",
          run: () => {
            setSideView(EXPLORER);
            setCollapsed((current) => {
              const next = new Set(current);
              for (const folder of foldersOf([path])) next.delete(folder);
              return next;
            });
            open(path);
          },
        },
      ]);
    };

    const activities = [
      { id: EXPLORER, icon: "files", title: "Explorer", badge: undefined },
      ...(props.activities ?? []),
    ];
    const activeActivity = props.activities?.find(
      (activity) => activity.id === sideView,
    );
    const toggleFolder = (folder: string) =>
      setCollapsed((current) => {
        const next = new Set(current);
        if (!next.delete(folder)) next.add(folder);
        return next;
      });
    const fileReadOnly = readOnly || !onSave || Boolean(activeFile?.readOnly);

    return (
      <div
        ref={rootRef}
        className={`wb${props.className ? ` ${props.className}` : ""}`}
        data-theme={theme}
        style={props.style}
        onKeyDownCapture={onKeyDownCapture}
      >
        <header className="wb-titlebar">
          <div className="wb-titlebar-title">
            <button
              type="button"
              className="wb-command-center"
              title={`Go to File (${MOD}P)`}
              onClick={() => setQuickOpen("")}
            >
              <Icon name="search" />
              <span>{props.title ?? "Search files"}</span>
            </button>
          </div>
          <div className="wb-titlebar-actions">{props.actions}</div>
        </header>

        <div className="wb-body">
          <nav className="wb-activitybar" aria-label="Views">
            {activities.map((activity) => (
              <button
                type="button"
                key={activity.id}
                className="wb-activity"
                title={activity.title}
                aria-label={activity.title}
                aria-pressed={sideView === activity.id}
                onClick={() =>
                  setSideView((view) => (view === activity.id ? null : activity.id))
                }
              >
                <Icon name={activity.icon} />
                {activity.badge !== undefined && activity.badge !== null ? (
                  <span className="wb-activity-badge">{activity.badge}</span>
                ) : null}
              </button>
            ))}
            <div className="wb-activity-spacer" />
            <button
              type="button"
              className="wb-activity"
              title={`Problems (${MOD}J)`}
              aria-label="Problems"
              aria-pressed={panelOpen}
              onClick={() => setPanelOpen((value) => !value)}
            >
              <Icon name="warning" />
              {problems.length ? (
                <span className="wb-activity-badge">{problems.length}</span>
              ) : null}
            </button>
          </nav>

          {sideView ? (
            <>
              <aside className="wb-sidebar" style={{ width: sideWidth }}>
                <div className="wb-sidebar-title">
                  <span>{activeActivity?.title ?? "Explorer"}</span>
                </div>
                {activeActivity ? (
                  <div className="wb-sidebar-body">{activeActivity.render()}</div>
                ) : (
                  <>
                    <div className="wb-section-header">
                      <Icon name="chevron-down" />
                      <span className="wb-grow">
                        {props.explorerTitle ??
                          (typeof props.title === "string" ? props.title : "Files")}
                      </span>
                      <span className="wb-section-actions">
                        {canCreateFile ? (
                          <button
                            type="button"
                            className="wb-icon-button"
                            title="New File…"
                            aria-label="New file"
                            onClick={() => startCreate("file")}
                          >
                            <Icon name="new-file" />
                          </button>
                        ) : null}
                        {canCreateFolder ? (
                          <button
                            type="button"
                            className="wb-icon-button"
                            title="New Folder…"
                            aria-label="New folder"
                            onClick={() => startCreate("folder")}
                          >
                            <Icon name="new-folder" />
                          </button>
                        ) : null}
                        {onRefresh ? (
                          <button
                            type="button"
                            className="wb-icon-button"
                            title="Refresh Explorer"
                            aria-label="Refresh explorer"
                            disabled={refreshing}
                            onClick={() => void refresh()}
                          >
                            <Icon name="refresh" />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="wb-icon-button"
                          title="Collapse Folders"
                          aria-label="Collapse folders"
                          onClick={collapseAll}
                        >
                          <Icon name="collapse-all" />
                        </button>
                      </span>
                    </div>
                    <div className="wb-sidebar-body">
                      <FileTree
                        files={files}
                        emptyFolders={emptyFolders}
                        menuFor={explorerMenu}
                        cutPath={clipboard?.mode === "cut" ? clipboard.path : null}
                        onShortcut={treeShortcut}
                        onFocus={(focus) => {
                          treeFocus.current = focus;
                        }}
                        activePath={activePath}
                        dirtyPaths={dirtySet}
                        problemOf={(path) => worst.get(path)}
                        icon={iconOf}
                        collapsed={collapsed}
                        onToggle={toggleFolder}
                        onOpen={(file) => open(file.path)}
                        edit={edit}
                        onEdit={setEdit}
                        onSubmitEdit={(done, path) => void submitEdit(done, path)}
                        canMove={canRenameFile}
                        onMove={(from, to) =>
                          void submitEdit({ kind: "rename", path: from }, to)
                        }
                        canUpload={Boolean(onUpload) && canEdit}
                        onDropFiles={(dropped, folder) =>
                          void upload(dropped, folder)
                        }
                        canCreateFile={canCreateFile}
                        canCreateFolder={canCreateFolder}
                        canRename={canRenameFile}
                        canDelete={canDeleteFile}
                        onDelete={(file) => void remove(file.path)}
                      />
                    </div>
                  </>
                )}
              </aside>
              <Sash
                axis="x"
                onDrag={(x) => {
                  const left =
                    (rootRef.current?.getBoundingClientRect().left ?? 0) + 44;
                  setSideWidth(Math.min(Math.max(x - left, 160), 640));
                }}
              />
            </>
          ) : null}

          <main className="wb-main">
            {openPaths.length ? (
              <div className="wb-tabs" role="tablist">
                {openPaths.map((path) => (
                  <div
                    key={path}
                    role="tab"
                    aria-selected={path === activePath}
                    className="wb-tab"
                    data-dirty={dirtySet.has(path)}
                    data-problem={worst.get(path)}
                    title={path}
                    onClick={() => open(path)}
                    onAuxClick={(event) => {
                      if (event.button === 1) close(path);
                    }}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      setTabMenu({ x: event.clientX, y: event.clientY, path });
                    }}
                  >
                    <span className="wb-file-icon">{iconOf(path)}</span>
                    <span className="wb-tab-label">{baseName(path)}</span>
                    <button
                      type="button"
                      className="wb-tab-close"
                      aria-label={`Close ${baseName(path)}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        close(path);
                      }}
                    >
                      <span className="wb-dirty-dot" />
                      <Icon name="close" className="wb-close-icon" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            {activePath ? (
              <div className="wb-breadcrumbs">
                {activePath.split("/").map((part, index) => (
                  <span
                    key={`${index}:${part}`}
                    style={{ display: "contents" }}
                  >
                    {index ? <Icon name="chevron-right" /> : null}
                    <span>{part}</span>
                  </span>
                ))}
              </div>
            ) : null}

            <div className="wb-editor">
              {!activeFile ? (
                <div className="wb-welcome">
                  <Icon name="code" />
                  <dl>
                    <dt>Go to File</dt>
                    <dd>
                      <span className="wb-kbd">{MOD}P</span>
                    </dd>
                    <dt>Save</dt>
                    <dd>
                      <span className="wb-kbd">{MOD}S</span>
                    </dd>
                    <dt>Toggle Side Bar</dt>
                    <dd>
                      <span className="wb-kbd">{MOD}B</span>
                    </dd>
                    <dt>Toggle Problems</dt>
                    <dd>
                      <span className="wb-kbd">{MOD}J</span>
                    </dd>
                  </dl>
                </div>
              ) : activeFile.binary ? (
                <div className="wb-binary">
                  {props.renderBinary?.(activeFile) ??
                    "This file isn't text and can't be shown in the editor."}
                </div>
              ) : activeBuffer ? (
                <div className="wb-editor-fill">
                  <Editor
                    path={uriOf(activeFile.path)}
                    language={languageOf(activeFile.path)}
                    value={activeBuffer.text}
                    theme={theme === "dark" ? "vs-dark" : "vs"}
                    beforeMount={props.beforeMount}
                    onMount={(editor, instance) => {
                      editorRef.current = editor;
                      setMonaco(instance);
                      editor.onDidChangeCursorPosition((event) =>
                        setCursor({
                          line: event.position.lineNumber,
                          column: event.position.column,
                        }),
                      );
                      props.onMount?.(editor, instance);
                    }}
                    onChange={(text) => {
                      const path = activeFile.path;
                      setBuffers((current) =>
                        current[path]
                          ? {
                              ...current,
                              [path]: { ...current[path]!, text: text ?? "" },
                            }
                          : current,
                      );
                    }}
                    options={{
                      readOnly: fileReadOnly,
                      automaticLayout: true,
                      fontSize: 13,
                      tabSize: 2,
                      minimap: { enabled: true },
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      renderWhitespace: "selection",
                      bracketPairColorization: { enabled: true },
                      guides: { bracketPairs: true, indentation: true },
                      stickyScroll: { enabled: true },
                      quickSuggestions: {
                        other: true,
                        comments: false,
                        strings: true,
                      },
                      padding: { top: 6 },
                      ...props.editorOptions,
                    }}
                  />
                </div>
              ) : (
                <div className="wb-welcome">Loading…</div>
              )}
            </div>

            {panelOpen ? (
              <>
                <Sash
                  axis="y"
                  onDrag={(y) => {
                    const rect = rootRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    setPanelHeight(
                      Math.min(
                        Math.max(rect.bottom - 22 - y, 80),
                        rect.height - 160,
                      ),
                    );
                  }}
                />
                <section className="wb-panel" style={{ height: panelHeight }}>
                  <div className="wb-panel-header">
                    <span className="wb-panel-tab">
                      Problems
                      {problems.length ? (
                        <span className="wb-count">{problems.length}</span>
                      ) : null}
                    </span>
                    <span style={{ flex: 1 }} />
                    <button
                      type="button"
                      className="wb-icon-button"
                      title="Close Panel"
                      aria-label="Close panel"
                      onClick={() => setPanelOpen(false)}
                    >
                      <Icon name="close" />
                    </button>
                  </div>
                  <div className="wb-panel-body">
                    {!problems.length ? (
                      <div className="wb-empty">
                        No problems have been detected.
                      </div>
                    ) : (
                      grouped.map(([path, list]) => (
                        <div key={path || "(project)"}>
                          <div className="wb-problem-file">
                            <span className="wb-file-icon">
                              {path ? iconOf(path) : <Icon name="project" />}
                            </span>
                            <span>{path ? baseName(path) : "Project"}</span>
                            <span className="wb-quickopen-dir">{path}</span>
                            <span className="wb-count">{list.length}</span>
                          </div>
                          {list.map((problem, index) => {
                            const severity = problem.severity ?? "error";
                            return (
                              <button
                                type="button"
                                key={index}
                                className="wb-problem"
                                disabled={!path || !filesByPath.has(path)}
                                onClick={() =>
                                  open(path, {
                                    line: problem.line ?? 1,
                                    column: problem.column,
                                  })
                                }
                              >
                                <Icon
                                  name={SEVERITY_ICON[severity]}
                                  className={`wb-severity-${severity}`}
                                />
                                <span className="wb-problem-message">
                                  {problem.message}
                                </span>
                                {problem.line ? (
                                  <span className="wb-problem-position">
                                    [Ln {problem.line}
                                    {problem.column ? `, Col ${problem.column}` : ""}]
                                  </span>
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </>
            ) : null}
          </main>
        </div>

        <footer className="wb-statusbar">
          <div className="wb-status-group">
            <button
              type="button"
              className="wb-status-item"
              title="Problems"
              onClick={() => setPanelOpen((value) => !value)}
            >
              <Icon name="error" />
              {counts.error}
              <Icon name="warning" />
              {counts.warning}
            </button>
            {notice ? (
              <span className="wb-status-item" data-kind="error" role="alert">
                {notice}
              </span>
            ) : saving ? (
              <span className="wb-status-item">
                <Icon name="sync" /> Saving…
              </span>
            ) : hasDirty ? (
              <span className="wb-status-item">{dirtyPaths.length} unsaved</span>
            ) : null}
            {props.statusLeft}
          </div>
          <div className="wb-status-group" data-side="right">
            {props.statusRight}
            {activeFile && !activeFile.binary ? (
              <>
                <span className="wb-status-item">
                  Ln {cursor.line}, Col {cursor.column}
                </span>
                <span className="wb-status-item">Spaces: 2</span>
                <span className="wb-status-item">UTF-8</span>
                <span className="wb-status-item">
                  {languageOf(activeFile.path)}
                </span>
              </>
            ) : null}
          </div>
        </footer>

        {tabMenu ? (
          <Menu
            x={tabMenu.x}
            y={tabMenu.y}
            items={tabMenuItems(tabMenu.path)}
            onClose={() => setTabMenu(null)}
          />
        ) : null}
        {quickOpen !== null ? (
          <QuickOpen
            key={quickOpen}
            start={quickOpen}
            commands={commands()}
            files={files}
            recent={openPaths}
            icon={(path) => iconOf(path)}
            onOpen={(file) => open(file.path)}
            onClose={() => {
              setQuickOpen(null);
              // After the key that closed it is done, so it isn't typed.
              setTimeout(() => editorRef.current?.focus(), 0);
            }}
          />
        ) : null}
      </div>
    );
  },
);
