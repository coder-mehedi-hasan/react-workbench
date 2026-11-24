import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import type { WorkbenchFile } from "./types";
import { baseName, dirName, fuzzyScore } from "./util";

export type QuickCommand = { id: string; label: string; run: () => void };

/**
 * Go to File: type part of a name, arrows to choose, Enter to open. A leading
 * `>` lists commands instead, as in VS Code.
 */
export function QuickOpen({
  start = "",
  commands,
  files,
  recent,
  icon,
  onOpen,
  onClose,
}: {
  /** The text it opens with: `>` goes straight to commands. */
  start?: string;
  commands: QuickCommand[];
  files: WorkbenchFile[];
  /** Open tabs, most useful first; shown before anything is typed. */
  recent: string[];
  icon: (path: string) => ReactNode;
  onOpen: (file: WorkbenchFile) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState(start);
  const commandMode = query.startsWith(">");
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

  const matches = useMemo(() => {
    if (!commandMode) return [];
    const wanted = query.slice(1).trim();
    return commands
      .map((command) => ({ command, score: fuzzyScore(wanted, command.label) }))
      .filter((entry) => entry.score !== null)
      .sort(
        (a, b) =>
          b.score! - a.score! || a.command.label.localeCompare(b.command.label),
      )
      .map((entry) => entry.command);
  }, [commandMode, commands, query]);
  const count = commandMode ? matches.length : results.length;

  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const choose = (file: WorkbenchFile | undefined) => {
    if (file) onOpen(file);
    onClose();
  };
  const run = (command: QuickCommand | undefined) => {
    onClose();
    // After the editor has its focus back, which closing hands over.
    if (command) setTimeout(command.run, 0);
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
          placeholder="Search files by name (type > for commands)"
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
              if (commandMode) run(matches[index]);
              else choose(results[index]);
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setIndex((at) => Math.min(at + 1, count - 1));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setIndex((at) => Math.max(at - 1, 0));
            }
          }}
        />
        <div className="wb-quickopen-list" ref={listRef} role="listbox">
          {matches.map((command, at) => (
            <button
              type="button"
              key={command.id}
              role="option"
              aria-selected={at === index}
              className="wb-quickopen-item"
              onMouseEnter={() => setIndex(at)}
              onClick={() => run(command)}
            >
              {command.label}
            </button>
          ))}
          {(commandMode ? [] : results).map((file, at) => (
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
          {!count ? (
            <div className="wb-empty">
              No matching {commandMode ? "commands" : "files"}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
