import { jsx as a, jsxs as f, Fragment as ye } from "react/jsx-runtime";
import Xt from "@monaco-editor/react";
import { useRef as R, useState as P, useEffect as W, useMemo as V, forwardRef as Ht, useCallback as Q, useImperativeHandle as _t } from "react";
const O = (r) => r.split("/").pop() ?? r, ee = (r) => r.includes("/") ? r.slice(0, r.lastIndexOf("/")) : "", Qt = {
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  json: "json",
  css: "css",
  scss: "scss",
  less: "less",
  html: "html",
  htm: "html",
  xml: "xml",
  svg: "xml",
  md: "markdown",
  yml: "yaml",
  yaml: "yaml",
  liquid: "liquid",
  py: "python",
  sh: "shell",
  sql: "sql"
};
function Jt(r) {
  var m;
  const o = ((m = O(r).split(".").pop()) == null ? void 0 : m.toLowerCase()) ?? "";
  return Qt[o] ?? "plaintext";
}
function Zt(r, o = []) {
  const m = { path: "", name: "", children: [] }, h = /* @__PURE__ */ new Map([["", m]]), y = (i) => {
    let b = m;
    return i.forEach((d, w) => {
      const N = i.slice(0, w + 1).join("/");
      let C = h.get(N);
      C || (C = { path: N, name: d, children: [] }, h.set(N, C), b.children.push(C)), b = C;
    }), b;
  };
  for (const i of o)
    y(i.split("/").filter(Boolean));
  for (const i of r) {
    const b = i.path.split("/").filter(Boolean), d = b.pop();
    d && y(b).children.push({ path: i.path, name: d, file: i });
  }
  const D = (i) => {
    var b, d;
    (b = i.children) == null || b.sort(
      (w, N) => +!w.children - +!N.children || w.name.localeCompare(N.name)
    ), (d = i.children) == null || d.forEach(D);
  };
  return D(m), m.children;
}
function St(r, o) {
  if (!r) return 0;
  const m = r.toLowerCase(), h = o.toLowerCase();
  let y = 0, D = 0, i = -1;
  for (const b of m) {
    const d = h.indexOf(b, D);
    if (d === -1) return null;
    y += d === i + 1 ? 3 : 1, d >= h.lastIndexOf("/") + 1 && (y += 2), i = d, D = d + 1;
  }
  return y - h.length / 100;
}
function $t(r) {
  const o = /* @__PURE__ */ new Set();
  for (const m of r) {
    const h = m.split("/").filter(Boolean).slice(0, -1);
    h.forEach((y, D) => o.add(h.slice(0, D + 1).join("/")));
  }
  return o;
}
function x({ name: r, className: o }) {
  return /* @__PURE__ */ a(
    "span",
    {
      "aria-hidden": !0,
      className: `codicon codicon-${r}${o ? ` ${o}` : ""}`
    }
  );
}
const en = {
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
  pdf: "file-pdf"
};
function tn(r, o) {
  var h;
  if (o.folder)
    return /* @__PURE__ */ a(x, { name: o.open ? "folder-opened" : "folder" });
  const m = ((h = O(r).split(".").pop()) == null ? void 0 : h.toLowerCase()) ?? "";
  return /* @__PURE__ */ a(x, { name: en[m] ?? "file-code" });
}
function je(r) {
  const o = [];
  for (const m of r)
    m && (m === "separator" && (!o.length || o[o.length - 1] === "separator") || o.push(m));
  for (; o[o.length - 1] === "separator"; ) o.pop();
  return o;
}
function Ot({
  x: r,
  y: o,
  items: m,
  onClose: h
}) {
  const y = R(null), [D, i] = P({ left: r, top: o });
  W(() => {
    var N;
    const d = y.current;
    if (d) {
      const C = d.getBoundingClientRect();
      i({
        left: Math.max(4, Math.min(r, window.innerWidth - C.width - 4)),
        top: Math.max(4, Math.min(o, window.innerHeight - C.height - 4))
      }), (N = d.querySelector("button:not(:disabled)")) == null || N.focus();
    }
    const w = () => h();
    return window.addEventListener("pointerdown", w), window.addEventListener("blur", w), window.addEventListener("resize", w), () => {
      window.removeEventListener("pointerdown", w), window.removeEventListener("blur", w), window.removeEventListener("resize", w);
    };
  }, [r, o, h]);
  const b = (d) => {
    var C, A;
    const w = [
      ...((C = y.current) == null ? void 0 : C.querySelectorAll("button:not(:disabled)")) ?? []
    ], N = w.indexOf(document.activeElement);
    (A = w[(N + d + w.length) % w.length]) == null || A.focus();
  };
  return /* @__PURE__ */ a(
    "div",
    {
      ref: y,
      className: "wb-menu",
      role: "menu",
      style: D,
      onPointerDown: (d) => d.stopPropagation(),
      onContextMenu: (d) => d.preventDefault(),
      onKeyDown: (d) => {
        d.stopPropagation(), d.key === "Escape" && h(), d.key === "ArrowDown" && (d.preventDefault(), b(1)), d.key === "ArrowUp" && (d.preventDefault(), b(-1));
      },
      children: m.map(
        (d, w) => d === "separator" ? /* @__PURE__ */ a("div", { className: "wb-menu-separator", role: "separator" }, w) : /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            role: "menuitem",
            className: "wb-menu-item",
            disabled: d.disabled,
            onClick: () => {
              h(), d.run();
            },
            children: [
              /* @__PURE__ */ a("span", { children: d.label }),
              d.keys ? /* @__PURE__ */ a("span", { className: "wb-menu-keys", children: d.keys }) : null
            ]
          },
          d.label
        )
      )
    }
  );
}
const Ie = "application/x-workbench-path", nt = "\0root";
function Ft({
  initial: r,
  onSubmit: o,
  onCancel: m
}) {
  const h = R(null), y = R(!1);
  W(() => {
    const i = h.current;
    if (!i) return;
    i.focus();
    const b = r.lastIndexOf(".");
    i.setSelectionRange(0, b > 0 ? b : r.length);
  }, [r]);
  const D = (i) => {
    if (y.current) return;
    y.current = !0;
    const b = i == null ? void 0 : i.trim().replace(/^\/+|\/+$/g, "");
    b && b !== r ? o(b) : m();
  };
  return /* @__PURE__ */ a(
    "input",
    {
      ref: h,
      className: "wb-tree-input",
      defaultValue: r,
      spellCheck: !1,
      onClick: (i) => i.stopPropagation(),
      onContextMenu: (i) => i.stopPropagation(),
      onBlur: (i) => D(i.target.value),
      onKeyDown: (i) => {
        i.stopPropagation(), i.key === "Enter" && D(i.currentTarget.value), i.key === "Escape" && D(null);
      }
    }
  );
}
function nn(r) {
  const { files: o, edit: m, collapsed: h } = r, y = V(
    () => Zt(o, r.emptyFolders),
    [o, r.emptyFolders]
  ), [D, i] = P(null), [b, d] = P(null);
  W(() => i(null), [r.activePath]);
  const [w, N] = P(null), C = R(void 0), A = (l) => {
    const k = [...l.dataTransfer.types];
    return k.includes(Ie) ? r.canMove : k.includes("Files") && r.canUpload;
  }, Y = (l, k) => {
    if (!A(l)) return;
    l.preventDefault(), l.stopPropagation(), l.dataTransfer.dropEffect = l.dataTransfer.types.includes(Ie) ? "move" : "copy";
    const u = k || nt;
    u !== w && (N(u), clearTimeout(C.current), k && h.has(k) && (C.current = setTimeout(() => r.onToggle(k), 600)));
  }, U = () => {
    clearTimeout(C.current), N(null);
  }, F = (l, k) => {
    if (!A(l)) return;
    l.preventDefault(), l.stopPropagation(), U();
    const u = l.dataTransfer.getData(Ie);
    if (u) {
      const I = k ? `${k}/${O(u)}` : O(u);
      I !== u && r.onMove(u, I);
      return;
    }
    const M = [...l.dataTransfer.files];
    M.length && r.onDropFiles(M, k);
  }, j = [], G = (l, k) => {
    for (const u of l)
      j.push({ node: u, depth: k }), u.children && !h.has(u.path) && G(u.children, k + 1);
  };
  G(y, 0);
  const c = (l) => {
    i(l.path), r.onFocus({ path: l.path, folder: !!l.children });
  }, p = (l, k) => {
    k && h.has(k) && r.onToggle(k), r.onEdit({ kind: "create", type: l, folder: k });
  }, L = (l, k) => {
    if ((m == null ? void 0 : m.kind) !== "create" || m.folder !== l) return null;
    const { type: u } = m;
    return /* @__PURE__ */ f(
      "div",
      {
        className: "wb-tree-row",
        style: { paddingLeft: 8 + k * 8 },
        children: [
          /* @__PURE__ */ a("span", { className: "wb-twistie", children: u === "folder" ? /* @__PURE__ */ a(x, { name: "chevron-right" }) : null }),
          /* @__PURE__ */ a("span", { className: "wb-file-icon", children: /* @__PURE__ */ a(x, { name: u === "folder" ? "folder" : "file" }) }),
          /* @__PURE__ */ a(
            Ft,
            {
              initial: "",
              onCancel: () => r.onEdit(null),
              onSubmit: (M) => r.onSubmitEdit(m, l ? `${l}/${M}` : M)
            }
          )
        ]
      },
      `create:${l}`
    );
  }, T = D ?? r.activePath;
  return /* @__PURE__ */ f(
    "div",
    {
      className: "wb-tree",
      role: "tree",
      tabIndex: 0,
      onKeyDown: (l) => {
        const k = j.findIndex(({ node: M }) => M.path === T), u = j[k];
        if (l.key === "ArrowDown" || l.key === "ArrowUp") {
          l.preventDefault();
          const M = j[k + (l.key === "ArrowDown" ? 1 : -1)] ?? j[0];
          M && c(M.node);
        } else if (l.key === "ArrowRight" && (u != null && u.node.children))
          l.preventDefault(), h.has(u.node.path) && r.onToggle(u.node.path);
        else if (l.key === "ArrowLeft" && u)
          if (l.preventDefault(), u.node.children && !h.has(u.node.path))
            r.onToggle(u.node.path);
          else {
            const M = j.find(({ node: I }) => I.path === ee(u.node.path));
            M && c(M.node);
          }
        else if (l.key === "Enter" && u)
          l.preventDefault(), u.node.file ? r.onOpen(u.node.file) : r.onToggle(u.node.path);
        else if (l.key === "F2" && u)
          r.onShortcut("rename", u.node);
        else if ((l.key === "Delete" || l.key === "Backspace" && l.metaKey) && u)
          r.onShortcut("delete", u.node);
        else if ((l.metaKey || l.ctrlKey) && u) {
          const M = { c: "copy", x: "cut", v: "paste" }[l.key.toLowerCase()];
          M && (l.preventDefault(), r.onShortcut(M, u.node));
        }
      },
      onContextMenu: (l) => {
        l.preventDefault(), i(null), r.onFocus(null), r.menuFor(null).length && d({ x: l.clientX, y: l.clientY, node: null });
      },
      "data-drop": w === nt,
      onDragOver: (l) => Y(l, ""),
      onDragLeave: (l) => {
        l.currentTarget.contains(l.relatedTarget) || U();
      },
      onDrop: (l) => F(l, ""),
      onClick: (l) => {
        l.target === l.currentTarget && (i(null), r.onFocus(null));
      },
      children: [
        L("", 0),
        !j.length && !m ? /* @__PURE__ */ a("div", { className: "wb-empty", children: "No files yet." }) : null,
        j.map(({ node: l, depth: k }) => {
          const u = !!l.children, M = u && !h.has(l.path), I = (m == null ? void 0 : m.kind) === "rename" && m.path === l.path, ke = !u && r.dirtyPaths.has(l.path), Ae = u ? void 0 : r.problemOf(l.path);
          return /* @__PURE__ */ f("div", { children: [
            /* @__PURE__ */ f(
              "div",
              {
                role: "treeitem",
                "aria-selected": l.path === T,
                "aria-expanded": u ? M : void 0,
                className: "wb-tree-row",
                "data-dirty": ke,
                "data-problem": Ae,
                "data-cut": l.path === r.cutPath,
                "data-drop": w !== null && w !== nt && (l.path === w || l.path.startsWith(`${w}/`)),
                title: l.path,
                style: { paddingLeft: 8 + k * 8 },
                draggable: !!l.file && r.canMove && !I,
                onDragStart: (v) => {
                  v.dataTransfer.setData(Ie, l.path), v.dataTransfer.setData("text/plain", l.path), v.dataTransfer.effectAllowed = "move";
                },
                onDragEnd: U,
                onDragOver: (v) => Y(v, u ? l.path : ee(l.path)),
                onDrop: (v) => F(v, u ? l.path : ee(l.path)),
                onClick: () => {
                  c(l), l.file ? r.onOpen(l.file) : r.onToggle(l.path);
                },
                onContextMenu: (v) => {
                  v.preventDefault(), v.stopPropagation(), c(l), r.menuFor(l).length && d({ x: v.clientX, y: v.clientY, node: l });
                },
                children: [
                  /* @__PURE__ */ a("span", { className: "wb-twistie", children: u ? /* @__PURE__ */ a(x, { name: M ? "chevron-down" : "chevron-right" }) : null }),
                  /* @__PURE__ */ a("span", { className: "wb-file-icon", children: r.icon(l.path, { folder: u, open: M }) }),
                  I ? /* @__PURE__ */ a(
                    Ft,
                    {
                      initial: l.name,
                      onCancel: () => r.onEdit(null),
                      onSubmit: (v) => {
                        const ne = ee(l.path);
                        r.onSubmitEdit(
                          { kind: "rename", path: l.path },
                          ne ? `${ne}/${v}` : v
                        );
                      }
                    }
                  ) : /* @__PURE__ */ f(ye, { children: [
                    /* @__PURE__ */ a("span", { className: "wb-tree-label", children: l.name }),
                    ke ? /* @__PURE__ */ a("span", { className: "wb-tree-badge", children: "M" }) : null,
                    /* @__PURE__ */ f("span", { className: "wb-tree-actions", children: [
                      u && r.canCreateFile ? /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "New File…",
                          "aria-label": `New file in ${l.path}`,
                          onClick: (v) => {
                            v.stopPropagation(), p("file", l.path);
                          },
                          children: /* @__PURE__ */ a(x, { name: "new-file" })
                        }
                      ) : null,
                      u && r.canCreateFolder ? /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "New Folder…",
                          "aria-label": `New folder in ${l.path}`,
                          onClick: (v) => {
                            v.stopPropagation(), p("folder", l.path);
                          },
                          children: /* @__PURE__ */ a(x, { name: "new-folder" })
                        }
                      ) : null,
                      l.file && r.canRename ? /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "Rename… (F2)",
                          "aria-label": `Rename ${O(l.path)}`,
                          onClick: (v) => {
                            v.stopPropagation(), r.onEdit({ kind: "rename", path: l.path });
                          },
                          children: /* @__PURE__ */ a(x, { name: "edit" })
                        }
                      ) : null,
                      l.file && r.canDelete ? /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "Delete",
                          "aria-label": `Delete ${O(l.path)}`,
                          onClick: (v) => {
                            v.stopPropagation(), r.onDelete(l.file);
                          },
                          children: /* @__PURE__ */ a(x, { name: "trash" })
                        }
                      ) : null
                    ] })
                  ] })
                ]
              }
            ),
            M ? L(l.path, k + 1) : null
          ] }, `${u ? "d" : "f"}:${l.path}`);
        }),
        b ? /* @__PURE__ */ a(
          Ot,
          {
            x: b.x,
            y: b.y,
            items: r.menuFor(b.node),
            onClose: () => d(null)
          }
        ) : null
      ]
    }
  );
}
function ln({
  start: r = "",
  commands: o,
  files: m,
  recent: h,
  icon: y,
  onOpen: D,
  onClose: i
}) {
  const [b, d] = P(r), w = b.startsWith(">"), [N, C] = P(0), A = R(null), Y = V(() => {
    if (!b.trim()) {
      const c = new Map(h.map((p, L) => [p, L]));
      return [...m].sort(
        (p, L) => (c.get(p.path) ?? 1e9) - (c.get(L.path) ?? 1e9) || p.path.localeCompare(L.path)
      ).slice(0, 50);
    }
    return m.map((c) => ({ file: c, score: St(b.trim(), c.path) })).filter((c) => c.score !== null).sort((c, p) => p.score - c.score).slice(0, 50).map((c) => c.file);
  }, [m, b, h]), U = V(() => {
    if (!w) return [];
    const c = b.slice(1).trim();
    return o.map((p) => ({ command: p, score: St(c, p.label) })).filter((p) => p.score !== null).sort(
      (p, L) => L.score - p.score || p.command.label.localeCompare(L.command.label)
    ).map((p) => p.command);
  }, [w, o, b]), F = w ? U.length : Y.length;
  W(() => {
    var c, p;
    (p = (c = A.current) == null ? void 0 : c.querySelector('[aria-selected="true"]')) == null || p.scrollIntoView({ block: "nearest" });
  }, [N]);
  const j = (c) => {
    c && D(c), i();
  }, G = (c) => {
    i(), c && setTimeout(c.run, 0);
  };
  return /* @__PURE__ */ a("div", { className: "wb-quickopen-backdrop", onMouseDown: i, children: /* @__PURE__ */ f(
    "div",
    {
      className: "wb-quickopen",
      role: "dialog",
      "aria-label": "Go to file",
      onMouseDown: (c) => c.stopPropagation(),
      children: [
        /* @__PURE__ */ a(
          "input",
          {
            autoFocus: !0,
            value: b,
            placeholder: "Search files by name (type > for commands)",
            spellCheck: !1,
            onChange: (c) => {
              d(c.target.value), C(0);
            },
            onKeyDown: (c) => {
              c.key === "Escape" && (c.preventDefault(), i()), c.key === "Enter" && (c.preventDefault(), w ? G(U[N]) : j(Y[N])), c.key === "ArrowDown" && (c.preventDefault(), C((p) => Math.min(p + 1, F - 1))), c.key === "ArrowUp" && (c.preventDefault(), C((p) => Math.max(p - 1, 0)));
            }
          }
        ),
        /* @__PURE__ */ f("div", { className: "wb-quickopen-list", ref: A, role: "listbox", children: [
          U.map((c, p) => /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              role: "option",
              "aria-selected": p === N,
              className: "wb-quickopen-item",
              onMouseEnter: () => C(p),
              onClick: () => G(c),
              children: c.label
            },
            c.id
          )),
          (w ? [] : Y).map((c, p) => /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              role: "option",
              "aria-selected": p === N,
              className: "wb-quickopen-item",
              onMouseEnter: () => C(p),
              onClick: () => j(c),
              children: [
                /* @__PURE__ */ a("span", { className: "wb-file-icon", children: y(c.path) }),
                /* @__PURE__ */ a("span", { children: O(c.path) }),
                /* @__PURE__ */ a("span", { className: "wb-quickopen-dir", children: ee(c.path) })
              ]
            },
            c.path
          )),
          F ? null : /* @__PURE__ */ f("div", { className: "wb-empty", children: [
            "No matching ",
            w ? "commands" : "files"
          ] })
        ] })
      ]
    }
  ) });
}
const ge = "explorer", an = {
  error: "error",
  warning: "warning",
  info: "info"
}, rn = typeof navigator < "u" && /Mac|iPhone|iPad/.test(navigator.platform), Z = rn ? "⌘" : "Ctrl+";
function Et({
  axis: r,
  onDrag: o
}) {
  const [m, h] = P(!1);
  return /* @__PURE__ */ a(
    "div",
    {
      className: `wb-sash wb-sash-${r}`,
      "data-dragging": m,
      role: "separator",
      "aria-orientation": r === "x" ? "vertical" : "horizontal",
      onPointerDown: (y) => {
        y.preventDefault(), y.currentTarget.setPointerCapture(y.pointerId), h(!0);
      },
      onPointerMove: (y) => {
        m && o(r === "x" ? y.clientX : y.clientY);
      },
      onPointerUp: (y) => {
        y.currentTarget.releasePointerCapture(y.pointerId), h(!1);
      }
    }
  );
}
const ae = (r) => r instanceof Error ? r.message : String(r), un = Ht(
  function(o, m) {
    var Pt, Mt;
    const {
      files: h,
      readFile: y,
      onSave: D,
      onCreate: i,
      onCreateFolder: b,
      onRefresh: d,
      onUpload: w,
      onRename: N,
      onDelete: C,
      onCopy: A,
      onRenameFolder: Y,
      onDeleteFolder: U,
      problems: F = [],
      theme: j = "dark",
      readOnly: G = !1,
      modelScope: c = "workbench"
    } = o, p = R(null), L = R(null), [T, lt] = P(null), [Ne, l] = P(ge), [k, u] = P(260), [M, I] = P(!1), [ke, Ae] = P(200), [v, ne] = P(null), [X, qe] = P([]), [$, Ke] = P(null), [ce, re] = P({}), [Tt, se] = P(/* @__PURE__ */ new Set()), [Lt, le] = P(null), [ze, ve] = P(/* @__PURE__ */ new Set()), [at, rt] = P(!1), We = R(null), [st, ot] = P({ line: 1, column: 1 }), [it, B] = P(null), [Bt, Ce] = P(!1), q = R({ buffers: ce, activePath: $, openPaths: X, files: h });
    q.current = { buffers: ce, activePath: $, openPaths: X, files: h };
    const Ue = R(/* @__PURE__ */ new Set()), ue = R(/* @__PURE__ */ new Set()), Ve = R(null), Ye = R(null), Ge = R(/* @__PURE__ */ new Set()), [H, xe] = P(null), [De, ct] = P(null), _ = V(
      () => new Map(h.map((e) => [e.path, e])),
      [h]
    ), K = $ ? _.get($) ?? null : null, de = V(
      () => $t(h.map((e) => e.path)),
      [h]
    ), Xe = V(
      () => [.../* @__PURE__ */ new Set([...o.folders ?? [], ...ze])],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [o.folders, ze]
    );
    W(() => {
      ve((e) => {
        const t = [...e].filter((n) => !de.has(n));
        return t.length === e.size ? e : new Set(t);
      });
    }, [de]);
    const oe = $ ? ce[$] : void 0, fe = V(
      () => Object.entries(ce).filter(([, e]) => e.text !== e.saved).map(([e]) => e),
      [ce]
    ), he = V(() => new Set(fe), [fe]), { onActiveFileChange: Pe, onDirtyChange: Me } = o;
    W(() => {
      Pe == null || Pe($), ot({ line: 1, column: 1 });
    }, [$, Pe]);
    const He = fe.join(`
`);
    W(
      () => Me == null ? void 0 : Me(He ? He.split(`
`) : []),
      [He, Me]
    );
    const ut = Q(
      (e) => {
        var t;
        return ((t = o.language) == null ? void 0 : t.call(o, e)) ?? Jt(e);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [o.language]
    ), Se = Q(
      (e, t = { folder: !1, open: !1 }) => {
        var n;
        return ((n = o.fileIcon) == null ? void 0 : n.call(o, e, t)) ?? tn(e, t);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [o.fileIcon]
    ), me = Q(
      (e) => `file:///${c}/${e}`,
      [c]
    ), $e = Q(
      (e) => {
        Ue.current.has(e) || (Ue.current.add(e), y(e).then(
          (t) => re((n) => ({
            ...n,
            [e]: { text: t, saved: t }
          }))
        ).catch((t) => {
          q.current.files.some((n) => n.path === e) && B(`Couldn't open ${e}: ${ae(t)}`);
        }).finally(() => Ue.current.delete(e)));
      },
      [y]
    ), z = Q(
      (e, t) => {
        const n = q.current.files.find((s) => s.path === e);
        if (!n) {
          Ye.current = e;
          return;
        }
        B(null), qe(
          (s) => s.includes(e) ? s : [...s, e]
        ), Ke(e), t && (Ve.current = {
          path: e,
          line: t.line,
          column: t.column ?? 1
        }), !n.binary && !q.current.buffers[e] && $e(e);
      },
      [$e]
    ), be = Q(
      (e) => {
        var t;
        (t = T == null ? void 0 : T.editor.getModel(T.Uri.parse(me(e)))) == null || t.dispose();
      },
      [T, me]
    ), we = Q(
      (e) => {
        if (!e.length) return;
        const t = new Set(e);
        qe((n) => {
          const s = n.filter((g) => !t.has(g));
          return Ke((g) => {
            if (!g || !t.has(g)) return g;
            const S = n.indexOf(g);
            return s[Math.min(S, s.length - 1)] ?? null;
          }), s;
        }), re((n) => {
          const s = { ...n };
          for (const g of e) delete s[g];
          return s;
        }), e.forEach(be);
      },
      [be]
    ), dt = (e) => {
      he.has(e) && !window.confirm(
        `Close ${O(e)} without saving? Your changes will be lost.`
      ) || we([e]);
    };
    W(() => {
      we(
        q.current.openPaths.filter(
          (t) => !_.has(t) && !Ge.current.has(t)
        )
      );
      const e = Ye.current;
      e && _.has(e) && (Ye.current = null, z(e));
    }, [_, we, z]);
    const ie = Q(
      async (e = q.current.activePath) => {
        const t = e ? q.current.buffers[e] : void 0;
        if (!e || !t || !D || G || t.text === t.saved || ue.current.has(e))
          return !1;
        const n = t.text;
        ue.current.add(e), Ce(!0), B(null);
        try {
          return await D(e, n), re(
            (s) => s[e] ? { ...s, [e]: { ...s[e], saved: n } } : s
          ), !0;
        } catch (s) {
          return B(`Couldn't save ${O(e)}: ${ae(s)}`), !1;
        } finally {
          ue.current.delete(e), Ce(ue.current.size > 0);
        }
      },
      [D, G]
    ), Fe = Q(async () => (await Promise.all(
      Object.keys(q.current.buffers).map((t) => {
        const n = q.current.buffers[t];
        return n.text === n.saved ? !0 : ie(t);
      })
    )).every(Boolean), [ie]), ft = Q(
      (e) => {
        var n;
        const t = (e ? [e] : q.current.openPaths).filter(
          (s) => _.has(s)
        );
        re((s) => {
          const g = { ...s };
          for (const S of t) delete g[S];
          return g;
        });
        for (const s of t)
          be(s), (n = _.get(s)) != null && n.binary || $e(s);
      },
      [be, _, $e]
    );
    _t(
      m,
      () => ({
        open: z,
        save: () => ie(),
        saveAll: Fe,
        reload: ft,
        dirtyPaths: () => Object.entries(q.current.buffers).filter(([, e]) => e.text !== e.saved).map(([e]) => e)
      }),
      [z, ft, ie, Fe]
    );
    const Ee = (e) => de.has(e) || Xe.includes(e), Oe = (e) => _.has(e) || Ee(e), Rt = (e) => {
      qe((t) => t.map((n) => e.get(n) ?? n)), Ke((t) => t && (e.get(t) ?? t)), re((t) => {
        const n = {};
        for (const [s, g] of Object.entries(t))
          n[e.get(s) ?? s] = g;
        return n;
      });
      for (const t of e.keys()) be(t);
    }, ht = async (e, t) => {
      const n = /* @__PURE__ */ new Map();
      if (Ee(e))
        for (const s of h)
          s.path.startsWith(`${e}/`) && n.set(s.path, `${t}${s.path.slice(e.length)}`);
      else
        n.set(e, t);
      for (const s of n.keys()) Ge.current.add(s);
      try {
        if (!Ee(e)) await (N == null ? void 0 : N(e, t));
        else if (Y) await Y(e, t);
        else
          for (const [s, g] of n) await (N == null ? void 0 : N(s, g));
        Rt(n), ve((s) => {
          const g = /* @__PURE__ */ new Set();
          for (const S of s)
            g.add(
              S === e || S.startsWith(`${e}/`) ? `${t}${S.slice(e.length)}` : S
            );
          return g;
        });
      } finally {
        for (const s of n.keys()) Ge.current.delete(s);
      }
    }, mt = async (e, t) => {
      if (le(null), B(null), Oe(t)) {
        B(`${t} already exists`);
        return;
      }
      try {
        e.kind === "create" && e.type === "folder" ? (b ? await b(t) : ve((n) => new Set(n).add(t)), se((n) => {
          const s = new Set(n);
          return s.delete(t), s;
        }), We.current = { path: t, folder: !0 }) : e.kind === "create" ? (await (i == null ? void 0 : i(t)), z(t)) : await ht(e.path, t);
      } catch (n) {
        B(ae(n));
      }
    }, jt = (e, t) => {
      const n = (E) => e ? `${e}/${E}` : E;
      if (!Oe(n(t))) return n(t);
      const s = t.lastIndexOf("."), g = s > 0 ? t.slice(0, s) : t, S = s > 0 ? t.slice(s) : "";
      for (let E = 1; ; E++) {
        const Re = `${g} copy${E > 1 ? ` ${E}` : ""}${S}`;
        if (!Oe(n(Re))) return n(Re);
      }
    }, bt = async (e) => {
      var s, g;
      if (!H) return;
      const { path: t, mode: n } = H;
      B(null);
      try {
        if (n === "cut") {
          xe(null);
          const E = e ? `${e}/${O(t)}` : O(t);
          if (E === t) return;
          if (Oe(E)) throw new Error(`${E} already exists`);
          await ht(t, E);
          return;
        }
        const S = jt(e, O(t));
        if (A)
          await A(t, S);
        else {
          if ((s = _.get(t)) != null && s.binary || !i)
            throw new Error(`${O(t)} can't be copied here`);
          {
            const E = ((g = q.current.buffers[t]) == null ? void 0 : g.saved) ?? await y(t);
            await i(S), E && await (D == null ? void 0 : D(S, E));
          }
        }
        z(S);
      } catch (S) {
        B(ae(S));
      }
    }, It = () => {
      const e = We.current;
      return e ? e.folder ? e.path : ee(e.path) : $ ? ee($) : "";
    }, wt = (e) => {
      const t = It();
      se((n) => {
        if (!t || !n.has(t)) return n;
        const s = new Set(n);
        return s.delete(t), s;
      }), le({ kind: "create", type: e, folder: t });
    }, At = async (e, t) => {
      B(null), Ce(!0);
      try {
        for (const n of e)
          await (w == null ? void 0 : w(n, t ? `${t}/${n.name}` : n.name));
      } catch (n) {
        B(ae(n));
      } finally {
        Ce(ue.current.size > 0);
      }
    }, pt = async () => {
      if (!(!d || at)) {
        rt(!0), B(null);
        try {
          await d();
        } catch (e) {
          B(ae(e));
        } finally {
          rt(!1);
        }
      }
    }, Te = async (e) => {
      B(null);
      try {
        Ee(e) ? U && await U(e) : await (C == null ? void 0 : C(e)), ve((t) => {
          const n = [...t].filter(
            (s) => s !== e && !s.startsWith(`${e}/`)
          );
          return n.length === t.size ? t : new Set(n);
        });
      } catch (t) {
        B(ae(t));
      }
    }, gt = V(() => {
      const e = /* @__PURE__ */ new Map();
      for (const t of F) {
        if (!t.path || t.severity === "info") continue;
        const n = t.severity === "warning" ? "warning" : "error";
        e.get(t.path) !== "error" && e.set(t.path, n);
      }
      return e;
    }, [F]), yt = V(() => {
      const e = { error: 0, warning: 0, info: 0 };
      for (const t of F) e[t.severity ?? "error"]++;
      return e;
    }, [F]), qt = V(() => {
      const e = /* @__PURE__ */ new Map();
      for (const t of F) {
        const n = t.path ?? "";
        e.set(n, [...e.get(n) ?? [], t]);
      }
      return [...e];
    }, [F]);
    W(() => {
      if (!T || !$ || !oe) return;
      const e = T.editor.getModel(T.Uri.parse(me($)));
      e && T.editor.setModelMarkers(
        e,
        "workbench",
        F.filter((t) => t.path === $).map((t) => {
          const n = Math.min(
            Math.max(t.line ?? 1, 1),
            e.getLineCount()
          ), s = Math.max(t.column ?? 1, 1);
          return {
            severity: t.severity === "warning" ? T.MarkerSeverity.Warning : t.severity === "info" ? T.MarkerSeverity.Info : T.MarkerSeverity.Error,
            message: t.message,
            startLineNumber: n,
            startColumn: s,
            endLineNumber: n,
            endColumn: e.getLineMaxColumn(n)
          };
        })
      );
    }, [T, $, oe, F, me]), W(() => {
      const e = Ve.current, t = L.current;
      if (!e || !t || e.path !== $ || !oe)
        return;
      const n = setTimeout(() => {
        Ve.current = null, t.revealLineInCenter(e.line), t.setPosition({ lineNumber: e.line, column: e.column }), t.focus();
      }, 0);
      return () => clearTimeout(n);
    }, [$, oe]);
    const _e = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
      const t = e.key.toLowerCase();
      t === "s" ? (e.preventDefault(), e.stopPropagation(), e.shiftKey ? Fe() : ie()) : t === "p" && !e.shiftKey ? (e.preventDefault(), e.stopPropagation(), ne("")) : t === "p" ? (e.preventDefault(), e.stopPropagation(), ne(">")) : t === "b" ? (e.preventDefault(), l((n) => n ? null : ge)) : t === "j" && (e.preventDefault(), I((n) => !n));
    }, Nt = R(_e);
    Nt.current = _e, W(() => {
      const e = (t) => {
        t.target === document.body && Nt.current(t);
      };
      return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
    }, []);
    const Kt = () => {
      const e = L.current;
      return [
        { id: "wb.save", label: "File: Save", run: () => void ie() },
        { id: "wb.saveAll", label: "File: Save All", run: () => void Fe() },
        {
          id: "wb.sideBar",
          label: "View: Toggle Side Bar",
          run: () => l((t) => t ? null : ge)
        },
        {
          id: "wb.problems",
          label: "View: Toggle Problems",
          run: () => I((t) => !t)
        },
        ...((e == null ? void 0 : e.getSupportedActions()) ?? []).filter((t) => t.label).map((t) => ({
          id: t.id,
          // Monaco's own palette, which shows each command's shortcut.
          label: t.id === "editor.action.quickCommand" ? "Editor: Command Palette (F1)" : t.label,
          run: () => {
            e == null || e.focus(), t.run();
          }
        }))
      ];
    }, Qe = fe.length > 0;
    W(() => {
      if (!Qe) return;
      const e = (t) => t.preventDefault();
      return window.addEventListener("beforeunload", e), () => window.removeEventListener("beforeunload", e);
    }, [Qe]);
    const J = !G, Je = !!i && J, Ze = !!(b || i) && J, te = !!N && J, kt = !!(Y || N) && J, et = !!C && J, Le = !!(A || i) && J, vt = J && !!H && ((H == null ? void 0 : H.mode) === "cut" ? te : Le), Ct = (e) => J && (!!U || ze.has(e) && !de.has(e)), xt = (e, t) => {
      se((n) => {
        if (!t || !n.has(t)) return n;
        const s = new Set(n);
        return s.delete(t), s;
      }), le({ kind: "create", type: e, folder: t });
    }, tt = (e) => {
      var t;
      return void ((t = navigator.clipboard) == null ? void 0 : t.writeText(e));
    }, Dt = () => se(/* @__PURE__ */ new Set([...de, ...Xe])), zt = (e) => {
      const t = !!(e != null && e.children), n = e ? t ? e.path : ee(e.path) : "", s = [];
      Je && s.push({ label: "New File…", run: () => xt("file", n) }), Ze && s.push({
        label: "New Folder…",
        run: () => xt("folder", n)
      });
      const g = te || Le ? {
        label: "Paste",
        keys: `${Z}V`,
        disabled: !vt,
        run: () => void bt(n)
      } : null;
      return je(e ? t ? [
        ...s,
        "separator",
        g,
        "separator",
        { label: "Copy Path", run: () => tt(e.path) },
        "separator",
        kt ? {
          label: "Rename…",
          keys: "F2",
          run: () => le({ kind: "rename", path: e.path })
        } : null,
        Ct(e.path) ? { label: "Delete", keys: "Del", run: () => void Te(e.path) } : null
      ] : [
        { label: "Open", run: () => z(e.path) },
        "separator",
        te ? {
          label: "Cut",
          keys: `${Z}X`,
          run: () => xe({ path: e.path, mode: "cut" })
        } : null,
        Le ? {
          label: "Copy",
          keys: `${Z}C`,
          run: () => xe({ path: e.path, mode: "copy" })
        } : null,
        g,
        "separator",
        { label: "Copy Path", run: () => tt(e.path) },
        "separator",
        te ? {
          label: "Rename…",
          keys: "F2",
          run: () => le({ kind: "rename", path: e.path })
        } : null,
        et ? { label: "Delete", keys: "Del", run: () => void Te(e.path) } : null
      ] : [
        ...s,
        "separator",
        g,
        "separator",
        d ? { label: "Refresh Explorer", run: () => void pt() } : null,
        { label: "Collapse Folders", run: Dt }
      ]);
    }, Wt = (e, t) => {
      const n = !!t.children;
      e === "paste" ? vt && bt(n ? t.path : ee(t.path)) : e === "rename" ? (n ? kt : te) && le({ kind: "rename", path: t.path }) : e === "delete" ? (n ? Ct(t.path) : et) && Te(t.path) : !n && (e === "cut" ? te : Le) && xe({ path: t.path, mode: e });
    }, Be = (e) => {
      const t = e.filter((n) => he.has(n));
      t.length && !window.confirm(
        t.length === 1 ? `Close ${O(t[0])} without saving? Your changes will be lost.` : `Close ${t.length} files without saving? Your changes will be lost.`
      ) || we(e);
    }, Ut = (e) => {
      const t = X.indexOf(e), n = X.filter((S) => S !== e), s = X.slice(t + 1), g = X.filter((S) => !he.has(S));
      return je([
        { label: "Close", run: () => Be([e]) },
        {
          label: "Close Others",
          disabled: !n.length,
          run: () => Be(n)
        },
        {
          label: "Close to the Right",
          disabled: !s.length,
          run: () => Be(s)
        },
        { label: "Close Saved", disabled: !g.length, run: () => we(g) },
        { label: "Close All", run: () => Be(X) },
        "separator",
        { label: "Copy Path", run: () => tt(e) },
        {
          label: "Reveal in Explorer",
          run: () => {
            l(ge), se((S) => {
              const E = new Set(S);
              for (const Re of $t([e])) E.delete(Re);
              return E;
            }), z(e);
          }
        }
      ]);
    }, Vt = [
      { id: ge, icon: "files", title: "Explorer", badge: void 0 },
      ...o.activities ?? []
    ], pe = (Pt = o.activities) == null ? void 0 : Pt.find(
      (e) => e.id === Ne
    ), Yt = (e) => se((t) => {
      const n = new Set(t);
      return n.delete(e) || n.add(e), n;
    }), Gt = G || !D || !!(K != null && K.readOnly);
    return /* @__PURE__ */ f(
      "div",
      {
        ref: p,
        className: `wb${o.className ? ` ${o.className}` : ""}`,
        "data-theme": j,
        style: o.style,
        onKeyDownCapture: _e,
        children: [
          /* @__PURE__ */ f("header", { className: "wb-titlebar", children: [
            /* @__PURE__ */ a("div", { className: "wb-titlebar-title", children: /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                className: "wb-command-center",
                title: `Go to File (${Z}P)`,
                onClick: () => ne(""),
                children: [
                  /* @__PURE__ */ a(x, { name: "search" }),
                  /* @__PURE__ */ a("span", { children: o.title ?? "Search files" })
                ]
              }
            ) }),
            /* @__PURE__ */ a("div", { className: "wb-titlebar-actions", children: o.actions })
          ] }),
          /* @__PURE__ */ f("div", { className: "wb-body", children: [
            /* @__PURE__ */ f("nav", { className: "wb-activitybar", "aria-label": "Views", children: [
              Vt.map((e) => /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: "wb-activity",
                  title: e.title,
                  "aria-label": e.title,
                  "aria-pressed": Ne === e.id,
                  onClick: () => l((t) => t === e.id ? null : e.id),
                  children: [
                    /* @__PURE__ */ a(x, { name: e.icon }),
                    e.badge !== void 0 && e.badge !== null ? /* @__PURE__ */ a("span", { className: "wb-activity-badge", children: e.badge }) : null
                  ]
                },
                e.id
              )),
              /* @__PURE__ */ a("div", { className: "wb-activity-spacer" }),
              /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: "wb-activity",
                  title: `Problems (${Z}J)`,
                  "aria-label": "Problems",
                  "aria-pressed": M,
                  onClick: () => I((e) => !e),
                  children: [
                    /* @__PURE__ */ a(x, { name: "warning" }),
                    F.length ? /* @__PURE__ */ a("span", { className: "wb-activity-badge", children: F.length }) : null
                  ]
                }
              )
            ] }),
            Ne ? /* @__PURE__ */ f(ye, { children: [
              /* @__PURE__ */ f("aside", { className: "wb-sidebar", style: { width: k }, children: [
                /* @__PURE__ */ a("div", { className: "wb-sidebar-title", children: /* @__PURE__ */ a("span", { children: (pe == null ? void 0 : pe.title) ?? "Explorer" }) }),
                pe ? /* @__PURE__ */ a("div", { className: "wb-sidebar-body", children: pe.render() }) : /* @__PURE__ */ f(ye, { children: [
                  /* @__PURE__ */ f("div", { className: "wb-section-header", children: [
                    /* @__PURE__ */ a(x, { name: "chevron-down" }),
                    /* @__PURE__ */ a("span", { className: "wb-grow", children: o.explorerTitle ?? (typeof o.title == "string" ? o.title : "Files") }),
                    /* @__PURE__ */ f("span", { className: "wb-section-actions", children: [
                      Je ? /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "New File…",
                          "aria-label": "New file",
                          onClick: () => wt("file"),
                          children: /* @__PURE__ */ a(x, { name: "new-file" })
                        }
                      ) : null,
                      Ze ? /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "New Folder…",
                          "aria-label": "New folder",
                          onClick: () => wt("folder"),
                          children: /* @__PURE__ */ a(x, { name: "new-folder" })
                        }
                      ) : null,
                      d ? /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "Refresh Explorer",
                          "aria-label": "Refresh explorer",
                          disabled: at,
                          onClick: () => void pt(),
                          children: /* @__PURE__ */ a(x, { name: "refresh" })
                        }
                      ) : null,
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "Collapse Folders",
                          "aria-label": "Collapse folders",
                          onClick: Dt,
                          children: /* @__PURE__ */ a(x, { name: "collapse-all" })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "wb-sidebar-body", children: /* @__PURE__ */ a(
                    nn,
                    {
                      files: h,
                      emptyFolders: Xe,
                      menuFor: zt,
                      cutPath: (H == null ? void 0 : H.mode) === "cut" ? H.path : null,
                      onShortcut: Wt,
                      onFocus: (e) => {
                        We.current = e;
                      },
                      activePath: $,
                      dirtyPaths: he,
                      problemOf: (e) => gt.get(e),
                      icon: Se,
                      collapsed: Tt,
                      onToggle: Yt,
                      onOpen: (e) => z(e.path),
                      edit: Lt,
                      onEdit: le,
                      onSubmitEdit: (e, t) => void mt(e, t),
                      canMove: te,
                      onMove: (e, t) => void mt({ kind: "rename", path: e }, t),
                      canUpload: !!w && J,
                      onDropFiles: (e, t) => void At(e, t),
                      canCreateFile: Je,
                      canCreateFolder: Ze,
                      canRename: te,
                      canDelete: et,
                      onDelete: (e) => void Te(e.path)
                    }
                  ) })
                ] })
              ] }),
              /* @__PURE__ */ a(
                Et,
                {
                  axis: "x",
                  onDrag: (e) => {
                    var n;
                    const t = (((n = p.current) == null ? void 0 : n.getBoundingClientRect().left) ?? 0) + 44;
                    u(Math.min(Math.max(e - t, 160), 640));
                  }
                }
              )
            ] }) : null,
            /* @__PURE__ */ f("main", { className: "wb-main", children: [
              X.length ? /* @__PURE__ */ a("div", { className: "wb-tabs", role: "tablist", children: X.map((e) => /* @__PURE__ */ f(
                "div",
                {
                  role: "tab",
                  "aria-selected": e === $,
                  className: "wb-tab",
                  "data-dirty": he.has(e),
                  "data-problem": gt.get(e),
                  title: e,
                  onClick: () => z(e),
                  onAuxClick: (t) => {
                    t.button === 1 && dt(e);
                  },
                  onContextMenu: (t) => {
                    t.preventDefault(), ct({ x: t.clientX, y: t.clientY, path: e });
                  },
                  children: [
                    /* @__PURE__ */ a("span", { className: "wb-file-icon", children: Se(e) }),
                    /* @__PURE__ */ a("span", { className: "wb-tab-label", children: O(e) }),
                    /* @__PURE__ */ f(
                      "button",
                      {
                        type: "button",
                        className: "wb-tab-close",
                        "aria-label": `Close ${O(e)}`,
                        onClick: (t) => {
                          t.stopPropagation(), dt(e);
                        },
                        children: [
                          /* @__PURE__ */ a("span", { className: "wb-dirty-dot" }),
                          /* @__PURE__ */ a(x, { name: "close", className: "wb-close-icon" })
                        ]
                      }
                    )
                  ]
                },
                e
              )) }) : null,
              $ ? /* @__PURE__ */ a("div", { className: "wb-breadcrumbs", children: $.split("/").map((e, t) => /* @__PURE__ */ f(
                "span",
                {
                  style: { display: "contents" },
                  children: [
                    t ? /* @__PURE__ */ a(x, { name: "chevron-right" }) : null,
                    /* @__PURE__ */ a("span", { children: e })
                  ]
                },
                `${t}:${e}`
              )) }) : null,
              /* @__PURE__ */ a("div", { className: "wb-editor", children: K ? K.binary ? /* @__PURE__ */ a("div", { className: "wb-binary", children: ((Mt = o.renderBinary) == null ? void 0 : Mt.call(o, K)) ?? "This file isn't text and can't be shown in the editor." }) : oe ? /* @__PURE__ */ a("div", { className: "wb-editor-fill", children: /* @__PURE__ */ a(
                Xt,
                {
                  path: me(K.path),
                  language: ut(K.path),
                  value: oe.text,
                  theme: j === "dark" ? "vs-dark" : "vs",
                  beforeMount: o.beforeMount,
                  onMount: (e, t) => {
                    var n;
                    L.current = e, lt(t), e.onDidChangeCursorPosition(
                      (s) => ot({
                        line: s.position.lineNumber,
                        column: s.position.column
                      })
                    ), (n = o.onMount) == null || n.call(o, e, t);
                  },
                  onChange: (e) => {
                    const t = K.path;
                    re(
                      (n) => n[t] ? {
                        ...n,
                        [t]: { ...n[t], text: e ?? "" }
                      } : n
                    );
                  },
                  options: {
                    readOnly: Gt,
                    automaticLayout: !0,
                    fontSize: 13,
                    tabSize: 2,
                    minimap: { enabled: !0 },
                    scrollBeyondLastLine: !1,
                    smoothScrolling: !0,
                    renderWhitespace: "selection",
                    bracketPairColorization: { enabled: !0 },
                    guides: { bracketPairs: !0, indentation: !0 },
                    stickyScroll: { enabled: !0 },
                    quickSuggestions: {
                      other: !0,
                      comments: !1,
                      strings: !0
                    },
                    padding: { top: 6 },
                    ...o.editorOptions
                  }
                }
              ) }) : /* @__PURE__ */ a("div", { className: "wb-welcome", children: "Loading…" }) : /* @__PURE__ */ f("div", { className: "wb-welcome", children: [
                /* @__PURE__ */ a(x, { name: "code" }),
                /* @__PURE__ */ f("dl", { children: [
                  /* @__PURE__ */ a("dt", { children: "Go to File" }),
                  /* @__PURE__ */ a("dd", { children: /* @__PURE__ */ f("span", { className: "wb-kbd", children: [
                    Z,
                    "P"
                  ] }) }),
                  /* @__PURE__ */ a("dt", { children: "Save" }),
                  /* @__PURE__ */ a("dd", { children: /* @__PURE__ */ f("span", { className: "wb-kbd", children: [
                    Z,
                    "S"
                  ] }) }),
                  /* @__PURE__ */ a("dt", { children: "Toggle Side Bar" }),
                  /* @__PURE__ */ a("dd", { children: /* @__PURE__ */ f("span", { className: "wb-kbd", children: [
                    Z,
                    "B"
                  ] }) }),
                  /* @__PURE__ */ a("dt", { children: "Toggle Problems" }),
                  /* @__PURE__ */ a("dd", { children: /* @__PURE__ */ f("span", { className: "wb-kbd", children: [
                    Z,
                    "J"
                  ] }) })
                ] })
              ] }) }),
              M ? /* @__PURE__ */ f(ye, { children: [
                /* @__PURE__ */ a(
                  Et,
                  {
                    axis: "y",
                    onDrag: (e) => {
                      var n;
                      const t = (n = p.current) == null ? void 0 : n.getBoundingClientRect();
                      t && Ae(
                        Math.min(
                          Math.max(t.bottom - 22 - e, 80),
                          t.height - 160
                        )
                      );
                    }
                  }
                ),
                /* @__PURE__ */ f("section", { className: "wb-panel", style: { height: ke }, children: [
                  /* @__PURE__ */ f("div", { className: "wb-panel-header", children: [
                    /* @__PURE__ */ f("span", { className: "wb-panel-tab", children: [
                      "Problems",
                      F.length ? /* @__PURE__ */ a("span", { className: "wb-count", children: F.length }) : null
                    ] }),
                    /* @__PURE__ */ a("span", { style: { flex: 1 } }),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        className: "wb-icon-button",
                        title: "Close Panel",
                        "aria-label": "Close panel",
                        onClick: () => I(!1),
                        children: /* @__PURE__ */ a(x, { name: "close" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ a("div", { className: "wb-panel-body", children: F.length ? qt.map(([e, t]) => /* @__PURE__ */ f("div", { children: [
                    /* @__PURE__ */ f("div", { className: "wb-problem-file", children: [
                      /* @__PURE__ */ a("span", { className: "wb-file-icon", children: e ? Se(e) : /* @__PURE__ */ a(x, { name: "project" }) }),
                      /* @__PURE__ */ a("span", { children: e ? O(e) : "Project" }),
                      /* @__PURE__ */ a("span", { className: "wb-quickopen-dir", children: e }),
                      /* @__PURE__ */ a("span", { className: "wb-count", children: t.length })
                    ] }),
                    t.map((n, s) => {
                      const g = n.severity ?? "error";
                      return /* @__PURE__ */ f(
                        "button",
                        {
                          type: "button",
                          className: "wb-problem",
                          disabled: !e || !_.has(e),
                          onClick: () => z(e, {
                            line: n.line ?? 1,
                            column: n.column
                          }),
                          children: [
                            /* @__PURE__ */ a(
                              x,
                              {
                                name: an[g],
                                className: `wb-severity-${g}`
                              }
                            ),
                            /* @__PURE__ */ a("span", { className: "wb-problem-message", children: n.message }),
                            n.line ? /* @__PURE__ */ f("span", { className: "wb-problem-position", children: [
                              "[Ln ",
                              n.line,
                              n.column ? `, Col ${n.column}` : "",
                              "]"
                            ] }) : null
                          ]
                        },
                        s
                      );
                    })
                  ] }, e || "(project)")) : /* @__PURE__ */ a("div", { className: "wb-empty", children: "No problems have been detected." }) })
                ] })
              ] }) : null
            ] })
          ] }),
          /* @__PURE__ */ f("footer", { className: "wb-statusbar", children: [
            /* @__PURE__ */ f("div", { className: "wb-status-group", children: [
              /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: "wb-status-item",
                  title: "Problems",
                  onClick: () => I((e) => !e),
                  children: [
                    /* @__PURE__ */ a(x, { name: "error" }),
                    yt.error,
                    /* @__PURE__ */ a(x, { name: "warning" }),
                    yt.warning
                  ]
                }
              ),
              it ? /* @__PURE__ */ a("span", { className: "wb-status-item", "data-kind": "error", role: "alert", children: it }) : Bt ? /* @__PURE__ */ f("span", { className: "wb-status-item", children: [
                /* @__PURE__ */ a(x, { name: "sync" }),
                " Saving…"
              ] }) : Qe ? /* @__PURE__ */ f("span", { className: "wb-status-item", children: [
                fe.length,
                " unsaved"
              ] }) : null,
              o.statusLeft
            ] }),
            /* @__PURE__ */ f("div", { className: "wb-status-group", "data-side": "right", children: [
              o.statusRight,
              K && !K.binary ? /* @__PURE__ */ f(ye, { children: [
                /* @__PURE__ */ f("span", { className: "wb-status-item", children: [
                  "Ln ",
                  st.line,
                  ", Col ",
                  st.column
                ] }),
                /* @__PURE__ */ a("span", { className: "wb-status-item", children: "Spaces: 2" }),
                /* @__PURE__ */ a("span", { className: "wb-status-item", children: "UTF-8" }),
                /* @__PURE__ */ a("span", { className: "wb-status-item", children: ut(K.path) })
              ] }) : null
            ] })
          ] }),
          De ? /* @__PURE__ */ a(
            Ot,
            {
              x: De.x,
              y: De.y,
              items: Ut(De.path),
              onClose: () => ct(null)
            }
          ) : null,
          v !== null ? /* @__PURE__ */ a(
            ln,
            {
              start: v,
              commands: Kt(),
              files: h,
              recent: X,
              icon: (e) => Se(e),
              onOpen: (e) => z(e.path),
              onClose: () => {
                ne(null), setTimeout(() => {
                  var e;
                  return (e = L.current) == null ? void 0 : e.focus();
                }, 0);
              }
            },
            v
          ) : null
        ]
      }
    );
  }
);
export {
  x as Icon,
  un as Workbench,
  tn as defaultFileIcon,
  Jt as guessLanguage
};
