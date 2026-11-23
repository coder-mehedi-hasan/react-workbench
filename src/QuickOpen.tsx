import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import type { WorkbenchFile } from "./types";
import { baseName, dirName, fuzzyScore } from "./util";

/** Go to File: type part of a name, arrows to choose, Enter to open. */
export function QuickOpen({
  files,
  recent,
  icon,
  onOpen,
  onClose,
}: {
  files: WorkbenchFile[];
  /** Open tabs, most useful first; shown before anything is typed. */
  recent: string[];
  icon: (path: string) => ReactNode;
  onOpen: (file: WorkbenchFile) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) {
      const order = new Map(recent.map((path, at) => [path, at]));
      return [...files]
        .sort(
          (a, b) =>
            (order.get(a.path) ?? 1e9) - (order.get(b.path) ?? 1e9) ||
            a.path.localeCompare(b.path),
        )
        .slice(0, 50);
    }
    return files
      .map((file) => ({ file, score: fuzzyScore(query.trim(), file.path) }))
      .filter((entry) => entry.score !== null)
      .sort((a, b) => b.score! - a.score!)
      .slice(0, 50)
      .map((entry) => entry.file);
  }, [files, query, recent]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const choose = (file: WorkbenchFile | undefined) => {
    if (file) onOpen(file);
    onClose();
  };

  return (
    <div className="wb-quickopen-backdrop" onMouseDown={onClose}>
      <div
        className="wb-quickopen"
        role="dialog"
        aria-label="Go to file"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          placeholder="Search files by name"
          spellCheck={false}
          onChange={(event) => {
            setQuery(event.target.value);
            setIndex(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              onClose();
            }
            if (event.key === "Enter") {
              // Without this the same keypress lands in the editor as a newline.
              event.preventDefault();
              choose(results[index]);
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setIndex((at) => Math.min(at + 1, results.length - 1));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setIndex((at) => Math.max(at - 1, 0));
            }
          }}
        />
        <div className="wb-quickopen-list" ref={listRef} role="listbox">
          {results.map((file, at) => (
            <button
              type="button"
              key={file.path}
              role="option"
              aria-selected={at === index}
              className="wb-quickopen-item"
              onMouseEnter={() => setIndex(at)}
              onClick={() => choose(file)}
            >
              <span className="wb-file-icon">{icon(file.path)}</span>
              <span>{baseName(file.path)}</span>
              <span className="wb-quickopen-dir">{dirName(file.path)}</span>
            </button>
          ))}
          {!results.length ? (
            <div className="wb-empty">No matching files</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
