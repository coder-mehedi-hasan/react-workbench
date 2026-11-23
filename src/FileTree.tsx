import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { Icon } from "./Icon";
import { Menu, type MenuItem } from "./Menu";
import type { WorkbenchFile } from "./types";
import { baseName, buildTree, dirName, type TreeNode } from "./util";

/** What's being typed in the tree: a new file or folder, or a new name for a file. */
export type TreeEdit =
  | { kind: "create"; type: "file" | "folder"; folder: string }
  | { kind: "rename"; path: string }
  | null;

/** The row the keyboard and the header buttons act on. */
export type TreeFocus = { path: string; folder: boolean } | null;

type Props = {
  files: WorkbenchFile[];
  /** Folders to show even when empty. */
  emptyFolders: string[];
  activePath: string | null;
  dirtyPaths: Set<string>;
  problemOf: (path: string) => "error" | "warning" | undefined;
  icon: (path: string, state: { folder: boolean; open: boolean }) => ReactNode;
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
  onShortcut: (
    action: "copy" | "cut" | "paste" | "rename" | "delete",
    node: TreeNode,
  ) => void;
  canMove: boolean;
  onMove: (path: string, newPath: string) => void;
  /** Files were dropped in from outside the page. */
  canUpload: boolean;
  onDropFiles: (files: File[], folder: string) => void;
};

/** Marks a drag that started in this tree, so other drags aren't mistaken for one. */
const DRAG_TYPE = "application/x-workbench-path";
/** `dropTarget` value for the top level, which has no path of its own. */
const ROOT = "\u0000root";

function NameInput({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const input = ref.current;
    if (!input) return;
    input.focus();
    // Like VS Code: select the name, not the extension.
    const dot = initial.lastIndexOf(".");
    input.setSelectionRange(0, dot > 0 ? dot : initial.length);
  }, [initial]);
  const finish = (value: string | null) => {
    if (done.current) return;
    done.current = true;
    // A name, or a nested path: `a/b.txt` makes the folder too.
    const name = value?.trim().replace(/^\/+|\/+$/g, "");
    if (name && name !== initial) onSubmit(name);
    else onCancel();
  };
  return (
    <input
      ref={ref}
      className="wb-tree-input"
      defaultValue={initial}
      spellCheck={false}
      onClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.stopPropagation()}
      onBlur={(event) => finish(event.target.value)}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "Enter") finish(event.currentTarget.value);
        if (event.key === "Escape") finish(null);
      }}
    />
  );
}

export function FileTree(props: Props) {
  const { files, edit, collapsed } = props;
  const tree = useMemo(
    () => buildTree(files, props.emptyFolders),
    [files, props.emptyFolders],
  );
  // Keyboard focus follows the open file until a click or the arrows move it.
  const [focused, setFocused] = useState<string | null>(null);
  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    node: TreeNode | null;
  } | null>(null);
  useEffect(() => setFocused(null), [props.activePath]);

  // Drag and drop: a file onto a folder moves it; files from outside upload.
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const accepts = (event: React.DragEvent) => {
    const types = [...event.dataTransfer.types];
    if (types.includes(DRAG_TYPE)) return props.canMove;
    return types.includes("Files") && props.canUpload;
  };
  const dragOver = (event: React.DragEvent, folder: string) => {
    if (!accepts(event)) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = event.dataTransfer.types.includes(DRAG_TYPE)
      ? "move"
      : "copy";
    const target = folder || ROOT;
    if (target === dropTarget) return;
    setDropTarget(target);
    // Resting on a closed folder opens it, so you can drop deeper.
    clearTimeout(hoverTimer.current);
    if (folder && collapsed.has(folder)) {
      hoverTimer.current = setTimeout(() => props.onToggle(folder), 600);
    }
  };
  const endDrag = () => {
    clearTimeout(hoverTimer.current);
    setDropTarget(null);
  };
  const drop = (event: React.DragEvent, folder: string) => {
    if (!accepts(event)) return;
    event.preventDefault();
    event.stopPropagation();
    endDrag();
    const from = event.dataTransfer.getData(DRAG_TYPE);
    if (from) {
      const to = folder ? `${folder}/${baseName(from)}` : baseName(from);
      if (to !== from) props.onMove(from, to);
      return;
    }
    const dropped = [...event.dataTransfer.files];
    if (dropped.length) props.onDropFiles(dropped, folder);
  };

  const rows: { node: TreeNode; depth: number }[] = [];
  const walk = (nodes: TreeNode[], depth: number) => {
    for (const node of nodes) {
      rows.push({ node, depth });
      if (node.children && !collapsed.has(node.path)) {
        walk(node.children, depth + 1);
      }
    }
  };
  walk(tree, 0);

  const focus = (node: TreeNode) => {
    setFocused(node.path);
    props.onFocus({ path: node.path, folder: Boolean(node.children) });
  };
  const startCreate = (type: "file" | "folder", folder: string) => {
    if (folder && collapsed.has(folder)) props.onToggle(folder);
    props.onEdit({ kind: "create", type, folder });
  };

  const createRow = (folder: string, depth: number) => {
    if (edit?.kind !== "create" || edit.folder !== folder) return null;
    const { type } = edit;
    return (
      <div
        key={`create:${folder}`}
        className="wb-tree-row"
        style={{ paddingLeft: 8 + depth * 8 }}
      >
        <span className="wb-twistie">
          {type === "folder" ? <Icon name="chevron-right" /> : null}
        </span>
        <span className="wb-file-icon">
          <Icon name={type === "folder" ? "folder" : "file"} />
        </span>
        <NameInput
          initial=""
          onCancel={() => props.onEdit(null)}
          onSubmit={(name) =>
            props.onSubmitEdit(edit, folder ? `${folder}/${name}` : name)
          }
        />
      </div>
    );
  };

  const current = focused ?? props.activePath;
  const onKeyDown = (event: React.KeyboardEvent) => {
    const index = rows.findIndex(({ node }) => node.path === current);
    const row = rows[index];
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = rows[index + (event.key === "ArrowDown" ? 1 : -1)] ?? rows[0];
      if (next) focus(next.node);
    } else if (event.key === "ArrowRight" && row?.node.children) {
      event.preventDefault();
      if (collapsed.has(row.node.path)) props.onToggle(row.node.path);
    } else if (event.key === "ArrowLeft" && row) {
      event.preventDefault();
      if (row.node.children && !collapsed.has(row.node.path)) {
        props.onToggle(row.node.path);
      } else {
        const parent = rows.find(({ node }) => node.path === dirName(row.node.path));
        if (parent) focus(parent.node);
      }
    } else if (event.key === "Enter" && row) {
      event.preventDefault();
      if (row.node.file) props.onOpen(row.node.file);
      else props.onToggle(row.node.path);
    } else if (event.key === "F2" && row) {
      props.onShortcut("rename", row.node);
    } else if (
      (event.key === "Delete" || (event.key === "Backspace" && event.metaKey)) &&
      row
    ) {
      props.onShortcut("delete", row.node);
    } else if ((event.metaKey || event.ctrlKey) && row) {
      const action = { c: "copy", x: "cut", v: "paste" }[event.key.toLowerCase()] as
        | "copy"
        | "cut"
        | "paste"
        | undefined;
      if (action) {
        event.preventDefault();
        props.onShortcut(action, row.node);
      }
    }
  };

  const rootMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setFocused(null);
    props.onFocus(null);
    if (props.menuFor(null).length) {
      setMenu({ x: event.clientX, y: event.clientY, node: null });
    }
  };

  return (
    <div
      className="wb-tree"
      role="tree"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onContextMenu={rootMenu}
      data-drop={dropTarget === ROOT}
      onDragOver={(event) => dragOver(event, "")}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          endDrag();
        }
      }}
      onDrop={(event) => drop(event, "")}
      onClick={(event) => {
        // A click on the empty space below the rows targets the root.
        if (event.target === event.currentTarget) {
          setFocused(null);
          props.onFocus(null);
        }
      }}
    >
      {createRow("", 0)}
      {!rows.length && !edit ? <div className="wb-empty">No files yet.</div> : null}
      {rows.map(({ node, depth }) => {
        const folder = Boolean(node.children);
        const open = folder && !collapsed.has(node.path);
        const renaming = edit?.kind === "rename" && edit.path === node.path;
        const dirty = !folder && props.dirtyPaths.has(node.path);
        const problem = folder ? undefined : props.problemOf(node.path);
        return (
          <div key={`${folder ? "d" : "f"}:${node.path}`}>
            <div
              role="treeitem"
              aria-selected={node.path === current}
              aria-expanded={folder ? open : undefined}
              className="wb-tree-row"
              data-dirty={dirty}
              data-problem={problem}
              data-cut={node.path === props.cutPath}
              data-drop={
                dropTarget !== null &&
                dropTarget !== ROOT &&
                (node.path === dropTarget ||
                  node.path.startsWith(`${dropTarget}/`))
              }
              title={node.path}
              style={{ paddingLeft: 8 + depth * 8 }}
              draggable={Boolean(node.file) && props.canMove && !renaming}
              onDragStart={(event) => {
                event.dataTransfer.setData(DRAG_TYPE, node.path);
                event.dataTransfer.setData("text/plain", node.path);
                event.dataTransfer.effectAllowed = "move";
              }}
              onDragEnd={endDrag}
              // Over a file, the drop goes to the folder it's in.
              onDragOver={(event) =>
                dragOver(event, folder ? node.path : dirName(node.path))
              }
              onDrop={(event) =>
                drop(event, folder ? node.path : dirName(node.path))
              }
              onClick={() => {
                focus(node);
                if (node.file) props.onOpen(node.file);
                else props.onToggle(node.path);
              }}
              onContextMenu={(event) => {
                event.preventDefault();
                event.stopPropagation();
                focus(node);
                if (props.menuFor(node).length) {
                  setMenu({ x: event.clientX, y: event.clientY, node });
                }
              }}
            >
              <span className="wb-twistie">
                {folder ? (
                  <Icon name={open ? "chevron-down" : "chevron-right"} />
                ) : null}
              </span>
              <span className="wb-file-icon">
                {props.icon(node.path, { folder, open })}
              </span>
              {renaming ? (
                <NameInput
                  initial={node.name}
                  onCancel={() => props.onEdit(null)}
                  onSubmit={(name) => {
                    const parent = dirName(node.path);
                    props.onSubmitEdit(
                      { kind: "rename", path: node.path },
                      parent ? `${parent}/${name}` : name,
                    );
                  }}
                />
              ) : (
                <>
                  <span className="wb-tree-label">{node.name}</span>
                  {dirty ? <span className="wb-tree-badge">M</span> : null}
                  <span className="wb-tree-actions">
                    {folder && props.canCreateFile ? (
                      <button
                        type="button"
                        className="wb-icon-button"
                        title="New File…"
                        aria-label={`New file in ${node.path}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          startCreate("file", node.path);
                        }}
                      >
                        <Icon name="new-file" />
                      </button>
                    ) : null}
                    {folder && props.canCreateFolder ? (
                      <button
                        type="button"
                        className="wb-icon-button"
                        title="New Folder…"
                        aria-label={`New folder in ${node.path}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          startCreate("folder", node.path);
                        }}
                      >
                        <Icon name="new-folder" />
                      </button>
                    ) : null}
                    {node.file && props.canRename ? (
                      <button
                        type="button"
                        className="wb-icon-button"
                        title="Rename… (F2)"
                        aria-label={`Rename ${baseName(node.path)}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          props.onEdit({ kind: "rename", path: node.path });
                        }}
                      >
                        <Icon name="edit" />
                      </button>
                    ) : null}
                    {node.file && props.canDelete ? (
                      <button
                        type="button"
                        className="wb-icon-button"
                        title="Delete"
                        aria-label={`Delete ${baseName(node.path)}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          props.onDelete(node.file!);
                        }}
                      >
                        <Icon name="trash" />
                      </button>
                    ) : null}
                  </span>
                </>
              )}
            </div>
            {open ? createRow(node.path, depth + 1) : null}
          </div>
        );
      })}
      {menu ? (
        <Menu
          x={menu.x}
          y={menu.y}
          items={props.menuFor(menu.node)}
          onClose={() => setMenu(null)}
        />
      ) : null}
    </div>
  );
}
