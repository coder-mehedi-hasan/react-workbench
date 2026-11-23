import type { ReactNode } from "react";

import { baseName } from "./util";

/** A codicon by name, e.g. `files`, `close`, `chevron-right`. */
export function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`codicon codicon-${name}${className ? ` ${className}` : ""}`}
    />
  );
}

const FILE_ICONS: Record<string, string> = {
  json: "json",
  md: "markdown",
  css: "symbol-color",
  scss: "symbol-color",
  less: "symbol-color",
  png: "file-media",
  jpg: "file-media",
  jpeg: "file-media",
  gif: "file-media",
  webp: "file-media",
  avif: "file-media",
  svg: "file-media",
  ico: "file-media",
  zip: "file-zip",
  pdf: "file-pdf",
};

/** The stock icon for a path; hosts override it with the `fileIcon` prop. */
export function defaultFileIcon(
  path: string,
  state: { folder: boolean; open: boolean },
): ReactNode {
  if (state.folder) {
    return <Icon name={state.open ? "folder-opened" : "folder"} />;
  }
  const ext = baseName(path).split(".").pop()?.toLowerCase() ?? "";
  return <Icon name={FILE_ICONS[ext] ?? "file-code"} />;
}
