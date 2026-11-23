import "@vscode/codicons/dist/codicon.css";
import type { WorkbenchHandle, WorkbenchProps } from "./types";
import "./workbench.css";
/**
 * A VS Code style workbench: activity bar, explorer, tabs, a Monaco editor,
 * a problems panel and a status bar. It keeps the open tabs and unsaved text
 * itself; the host supplies the file list and how to read and store a file.
 */
export declare const Workbench: import("react").ForwardRefExoticComponent<WorkbenchProps & import("react").RefAttributes<WorkbenchHandle>>;
