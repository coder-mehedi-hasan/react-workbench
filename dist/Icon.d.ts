import type { ReactNode } from "react";
/** A codicon by name, e.g. `files`, `close`, `chevron-right`. */
export declare function Icon({ name, className }: {
    name: string;
    className?: string;
}): import("react").JSX.Element;
/** The stock icon for a path; hosts override it with the `fileIcon` prop. */
export declare function defaultFileIcon(path: string, state: {
    folder: boolean;
    open: boolean;
}): ReactNode;
