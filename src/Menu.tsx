import { useEffect, useRef, useState } from "react";

export type MenuItem =
  | { label: string; keys?: string; disabled?: boolean; run: () => void }
  | "separator";

/** Drop separators that would sit first, last, or next to each other. */
export function tidyMenu(items: (MenuItem | null | false | undefined)[]): MenuItem[] {
  const tidy: MenuItem[] = [];
  for (const item of items) {
    if (!item) continue;
    if (item === "separator" && (!tidy.length || tidy[tidy.length - 1] === "separator")) {
      continue;
    }
    tidy.push(item);
  }
  while (tidy[tidy.length - 1] === "separator") tidy.pop();
  return tidy;
}

/** A context menu at a screen position. Closes on a click elsewhere, Escape, or a choice. */
export function Menu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: x, top: y });
  useEffect(() => {
    const menu = ref.current;
    if (menu) {
      // Keep it on screen when opened near an edge.
      const rect = menu.getBoundingClientRect();
      setPosition({
        left: Math.max(4, Math.min(x, window.innerWidth - rect.width - 4)),
        top: Math.max(4, Math.min(y, window.innerHeight - rect.height - 4)),
      });
      menu.querySelector<HTMLElement>("button:not(:disabled)")?.focus();
    }
    const close = () => onClose();
    window.addEventListener("pointerdown", close);
    window.addEventListener("blur", close);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("blur", close);
      window.removeEventListener("resize", close);
    };
  }, [x, y, onClose]);

  const move = (step: number) => {
    const buttons = [
      ...(ref.current?.querySelectorAll<HTMLElement>("button:not(:disabled)") ?? []),
    ];
    const at = buttons.indexOf(document.activeElement as HTMLElement);
    buttons[(at + step + buttons.length) % buttons.length]?.focus();
  };

  return (
    <div
      ref={ref}
      className="wb-menu"
      role="menu"
      style={position}
      onPointerDown={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "Escape") onClose();
        if (event.key === "ArrowDown") {
          event.preventDefault();
          move(1);
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          move(-1);
        }
      }}
    >
      {items.map((item, index) =>
        item === "separator" ? (
          <div key={index} className="wb-menu-separator" role="separator" />
        ) : (
          <button
            type="button"
            key={item.label}
            role="menuitem"
            className="wb-menu-item"
            disabled={item.disabled}
            onClick={() => {
              onClose();
              item.run();
            }}
          >
            <span>{item.label}</span>
            {item.keys ? <span className="wb-menu-keys">{item.keys}</span> : null}
          </button>
        ),
      )}
    </div>
  );
}
