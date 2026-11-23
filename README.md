# @workbenchkit/react

A VS Code style workbench for React: activity bar, explorer, tabs, a Monaco
editor, a problems panel and a status bar. You give it a list of files and how
to read and save one; it keeps the open tabs, unsaved text and layout itself.

## Install

```bash
bun add @workbenchkit/react
bun add monaco-editor @monaco-editor/react   # peer dependencies, with react and react-dom
```

## Develop

```bash
bun run dev      # demo on http://localhost:5199
bun run build    # dist/index.js, dist/react-workbench.css, type declarations
```

## Use it

```tsx
import { Workbench } from "@workbenchkit/react";
import "@workbenchkit/react/styles.css";

<div style={{ height: "100vh" }}>
  <Workbench
    title="my-theme"
    files={[{ path: "layout/theme.fluid" }, { path: "assets/logo.png", binary: true }]}
    readFile={(path) => api.read(path)}
    onSave={(path, content) => api.save(path, content)}
    problems={[{ path: "layout/theme.fluid", message: "Unclosed tag", line: 3, column: 5 }]}
  />
</div>
```

The workbench fills its parent, so the parent needs a height.

### Monaco is yours to set up

`react`, `react-dom`, `monaco-editor` and `@monaco-editor/react` are peer
dependencies. Your app decides how Monaco loads and which workers it has; see
`demo/main.tsx` for the Vite setup. Register languages, completion providers
and JSON schemas in `beforeMount`.

## Props

| Prop | What it does |
| --- | --- |
| `files` | `{ path, binary?, readOnly? }[]`. Folders come from the paths. |
| `readFile(path)` | Returns a text file's content. Called on first open and on reload. |
| `onSave(path, content)` | Store a file. Throw to keep it marked unsaved; the message shows in the status bar. |
| `onCreate`, `onRename`, `onDelete` | When given, the explorer offers New File, Rename (F2) and Delete. Update `files` yourself. Ask for confirmation inside `onDelete` if you want one. `onRename` also receives a file dragged to another folder, and Cut then Paste. |
| `onCreateFolder(path)` | Make a real empty folder. Without it, New Folder makes one that lives in the explorer until a file is created inside, which suits object storage. |
| `folders` | Folders to show even when empty. |
| `onRenameFolder`, `onDeleteFolder` | Whole-folder rename and delete. Without `onRenameFolder`, a folder is renamed by calling `onRename` for each file in it. Without `onDeleteFolder`, only empty explorer-made folders can be removed. |
| `onCopy(path, newPath)` | Copy then Paste. Without it, text files are copied through `readFile`, `onCreate` and `onSave`. |
| `onUpload(file, path)` | Files dropped onto the explorer from the desktop, once per file. |
| `onRefresh()` | Adds a Refresh button to the explorer. |
| `problems` | `{ path?, message, severity?, line?, column? }[]`. Listed in the panel, counted in the status bar, coloured in the tree and tabs, underlined in the editor when they have a line. |
| `theme` | `"dark"` (default) or `"light"`. |
| `readOnly` | Nothing can be changed. |
| `language(path)` | Monaco language id. Defaults to a guess from the extension. |
| `fileIcon(path, { folder, open })` | Your own icon for a file or folder. |
| `renderBinary(file)` | What to show for a `binary` file, such as an image preview. |
| `title`, `actions` | Title bar text and the buttons at its right. |
| `activities` | Extra side bar views: `{ id, icon, title, badge?, render }`. `icon` is a codicon name. |
| `statusLeft`, `statusRight` | Extra status bar items. Give them `className="wb-status-item"`. |
| `beforeMount(monaco)`, `onMount(editor, monaco)`, `editorOptions` | Passed to Monaco. |
| `modelScope` | Prefix of Monaco model URIs. Make it unique per workbench on a page. |
| `onActiveFileChange`, `onDirtyChange` | Told when the open file or the unsaved set changes. |

## Ref

```tsx
const workbench = useRef<WorkbenchHandle>(null);
workbench.current?.open("widgets/hero.fluid", { line: 12 });
await workbench.current?.saveAll();   // false when a save failed
workbench.current?.reload();          // re-read every open file
workbench.current?.dirtyPaths();
```

## Explorer

- **Header buttons:** New File, New Folder, Refresh, Collapse Folders. New items go into the focused folder, as in VS Code.
- **Right-click a file:** Open, Cut, Copy, Paste, Copy Path, Rename, Delete.
- **Right-click a folder:** New File, New Folder, Paste, Copy Path, Rename, Delete.
- **Right-click empty space:** New File, New Folder, Paste, Refresh, Collapse Folders.
- **Right-click a tab:** Close, Close Others, Close to the Right, Close Saved, Close All, Copy Path, Reveal in Explorer.
- **Drag** a file onto a folder to move it. **Drop** files from your desktop to upload them.
- Typing `a/b/c.txt` as a new file name creates the folders on the way.

Every item appears only when the matching prop is given, and nothing that changes files appears when `readOnly` is set.

## Shortcuts

| Keys | Action |
| --- | --- |
| ⌘/Ctrl+S | Save the open file |
| ⌘/Ctrl+Shift+S | Save all |
| ⌘/Ctrl+P | Go to file |
| ⌘/Ctrl+B | Toggle the side bar |
| ⌘/Ctrl+J | Toggle the problems panel |
| F2 / Delete | Rename / delete the focused row in the explorer |
| ⌘/Ctrl+C, X, V | Copy, cut, paste in the explorer |

## Theming

Colours are CSS variables on `.wb` (`--wb-bg`, `--wb-bg-side`, `--wb-fg`,
`--wb-accent`, `--wb-border`, …). Override them on a wrapper or with your own
class through `className`.

Icons are [codicons](https://github.com/microsoft/vscode-codicons) (CC BY 4.0).
