export type MenuItem = {
    label: string;
    keys?: string;
    disabled?: boolean;
    run: () => void;
} | "separator";
/** Drop separators that would sit first, last, or next to each other. */
export declare function tidyMenu(items: (MenuItem | null | false | undefined)[]): MenuItem[];
/** A context menu at a screen position. Closes on a click elsewhere, Escape, or a choice. */
export declare function Menu({ x, y, items, onClose, }: {
    x: number;
    y: number;
    items: MenuItem[];
    onClose: () => void;
}): import("react").JSX.Element;
