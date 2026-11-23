import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  Workbench,
  type WorkbenchHandle,
  type WorkbenchProblem,
} from "../src";

// The host app owns Monaco's setup: workers, and which copy of Monaco to use.
self.MonacoEnvironment = {
  getWorker(_id, label) {
    if (label === "json") return new JsonWorker();
    if (label === "css" || label === "scss" || label === "less") return new CssWorker();
    if (label === "html") return new HtmlWorker();
    if (label === "typescript" || label === "javascript") return new TsWorker();
    return new EditorWorker();
  },
};
loader.config({ monaco });

const INITIAL: Record<string, string> = {
  "layout/theme.fluid": `<!doctype html>\n<html>\n  <head>\n    {{ 'theme.css' | asset_url | stylesheet_tag }}\n    {{ content_for_header }}\n  </head>\n  <body>\n    {{ content_for_top }}\n    <main>{{ content_for_layout }}</main>\n    {{ content_for_bottom }}\n  </body>\n</html>\n`,
  "widgets/hero.fluid": `<section class="hero">\n  <h1>{{ props.heading }}</h1>\n  {% if props.text != blank %}\n    <p>{{ props.text }}</p>\n  {% endif %}\n</section>\n\n{% schema %}\n{\n  "settings": {\n    "heading": { "kind": "text", "default": "Hello" },\n    "text": "textarea"\n  }\n}\n{% endschema %}\n`,
  "widgets/product-grid.fluid": `<div class="grid">\n  {% for product in products %}\n    {% render 'product-card', product: product %}\n  {% endfor %}\n</div>\n`,
  "snippets/product-card.fluid": `<a class="card" href="{{ product.url }}">\n  <img src="{{ product.featured_image | image_url }}" alt="{{ product.title }}">\n  <h3>{{ product.title }}</h3>\n  <span>{{ product.price | money }}</span>\n</a>\n`,
  "assets/theme.css": `:root {\n  --accent: #0f766e;\n}\n\nbody {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n}\n\n.hero {\n  padding: 4rem 1rem;\n  text-align: center;\n}\n`,
  "assets/theme.js": `document.addEventListener("DOMContentLoaded", () => {\n  console.log("theme ready");\n});\n`,
  "assets/logo.png": "",
  "config/document.json": `{\n  "schemaVersion": 1,\n  "pages": {\n    "home": ["hero", "product-grid"]\n  }\n}\n`,
  "locales/en.default.json": `{\n  "general": {\n    "menu": "Menu"\n  }\n}\n`,
};

const wait = (ms: number) => new Promise((done) => setTimeout(done, ms));

function Demo() {
  const [store, setStore] = useState(INITIAL);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [log, setLog] = useState<string[]>([]);
  const workbench = useRef<WorkbenchHandle>(null);
  const storeRef = useRef(store);
  storeRef.current = store;

  const files = useMemo(
    () =>
      Object.keys(store)
        .sort()
        .map((path) => ({
          path,
          binary: /\.(png|jpe?g|gif|webp)$/i.test(path),
        })),
    [store],
  );
  // A stand-in for a real check: flag an empty `{% if %}`.
  const problems = useMemo<WorkbenchProblem[]>(() => {
    const found: WorkbenchProblem[] = [];
    for (const [path, text] of Object.entries(store)) {
      text.split("\n").forEach((line, index) => {
        const at = line.indexOf("{% if %}");
        if (at >= 0) {
          found.push({
            path,
            message: "invalid value expression: \"\"",
            line: index + 1,
            column: at + 1,
          });
        }
        if (line.includes("console.log")) {
          found.push({
            path,
            message: "Unexpected console statement",
            severity: "warning",
            line: index + 1,
            column: line.indexOf("console.log") + 1,
          });
        }
      });
    }
    return found;
  }, [store]);

  const button = {
    height: 24,
    padding: "0 10px",
    borderRadius: 4,
    border: "1px solid var(--wb-input-border)",
    background: "var(--wb-input-bg)",
  } as const;

  return (
    <Workbench
      ref={workbench}
      title="my-theme"
      theme={theme}
      files={files}
      problems={problems}
      language={(path) => (path.endsWith(".fluid") ? "liquid" : undefined)}
      readFile={async (path) => {
        await wait(150);
        return storeRef.current[path] ?? "";
      }}
      onSave={async (path, content) => {
        await wait(300);
        setStore((current) => ({ ...current, [path]: content }));
        setLog((current) => [`saved ${path}`, ...current]);
      }}
      onCreate={async (path) => {
        setStore((current) => ({ ...current, [path]: "" }));
      }}
      onUpload={async (file, path) => {
        const text = /\.(png|jpe?g|gif|webp)$/i.test(path) ? "" : await file.text();
        setStore((current) => ({ ...current, [path]: text }));
      }}
      onRefresh={async () => {
        await wait(400);
        setStore((current) => ({ ...current }));
      }}
      onRename={async (path, newPath) => {
        setStore(({ [path]: content, ...rest }) => ({
          ...rest,
          [newPath]: content ?? "",
        }));
      }}
      onDeleteFolder={async (path) => {
        if (!window.confirm(`Delete ${path} and everything in it?`)) return;
        setStore((current) =>
          Object.fromEntries(
            Object.entries(current).filter(([each]) => !each.startsWith(`${path}/`)),
          ),
        );
      }}
      onDelete={async (path) => {
        if (!window.confirm(`Delete ${path}?`)) return;
        setStore(({ [path]: _gone, ...rest }) => rest);
      }}
      renderBinary={(file) => <span>Preview of {file.path} goes here</span>}
      activities={[
        {
          id: "history",
          icon: "history",
          title: "Activity",
          badge: log.length || undefined,
          render: () => (
            <div style={{ padding: "0 20px" }}>
              {log.length ? log.map((line, index) => <div key={index}>{line}</div>) : "Nothing saved yet."}
            </div>
          ),
        },
      ]}
      actions={
        <>
          <button
            type="button"
            style={button}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button
            type="button"
            style={{ ...button, background: "var(--wb-accent)", color: "#fff", borderColor: "transparent" }}
            onClick={() => void workbench.current?.saveAll()}
          >
            Save all
          </button>
        </>
      }
      statusLeft={<span className="wb-status-item">demo</span>}
    />
  );
}

createRoot(document.getElementById("root")!).render(<Demo />);
