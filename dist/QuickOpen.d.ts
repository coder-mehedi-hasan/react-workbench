import { type ReactNode } from "react";
import type { WorkbenchFile } from "./types";
/** Go to File: type part of a name, arrows to choose, Enter to open. */
export declare function QuickOpen({ files, recent, icon, onOpen, onClose, }: {
    files: WorkbenchFile[];
    /** Open tabs, most useful first; shown before anything is typed. */
    recent: string[];
    icon: (path: string) => ReactNode;
    onOpen: (file: WorkbenchFile) => void;
    onClose: () => void;
}): import("react").JSX.Element;
