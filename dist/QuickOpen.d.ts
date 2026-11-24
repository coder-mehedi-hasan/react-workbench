import { type ReactNode } from "react";
import type { WorkbenchFile } from "./types";
export type QuickCommand = {
    id: string;
    label: string;
    run: () => void;
};
/**
 * Go to File: type part of a name, arrows to choose, Enter to open. A leading
 * `>` lists commands instead, as in VS Code.
 */
export declare function QuickOpen({ start, commands, files, recent, icon, onOpen, onClose, }: {
    /** The text it opens with: `>` goes straight to commands. */
    start?: string;
    commands: QuickCommand[];
    files: WorkbenchFile[];
    /** Open tabs, most useful first; shown before anything is typed. */
    recent: string[];
    icon: (path: string) => ReactNode;
    onOpen: (file: WorkbenchFile) => void;
    onClose: () => void;
}): import("react").JSX.Element;
