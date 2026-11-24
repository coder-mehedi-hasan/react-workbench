import { jsx as l, jsxs as f, Fragment as Ne } from "react/jsx-runtime";
import Jt from "@monaco-editor/react";
import { useRef as T, useState as S, useEffect as W, useMemo as K, forwardRef as Zt, useCallback as Q, useImperativeHandle as en } from "react";
const O = (r) => r.split("/").pop() ?? r, ee = (r) => r.includes("/") ? r.slice(0, r.lastIndexOf("/")) : "", tn = {
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
function nn(r) {
  var m;
  const o = ((m = O(r).split(".").pop()) == null ? void 0 : m.toLowerCase()) ?? "";
  return tn[o] ?? "plaintext";
}
function ln(r, o = []) {
  const m = { path: "", name: "", children: [] }, h = /* @__PURE__ */ new Map([["", m]]), y = (i) => {
    let w = m;
    return i.forEach((d, p) => {
      const k = i.slice(0, p + 1).join("/");
      let C = h.get(k);
      C || (C = { path: k, name: d, children: [] }, h.set(k, C), w.children.push(C)), w = C;
    }), w;
  };
  for (const i of o)
    y(i.split("/").filter(Boolean));
  for (const i of r) {
    const w = i.path.split("/").filter(Boolean), d = w.pop();
    d && y(w).children.push({ path: i.path, name: d, file: i });
  }
  const D = (i) => {
    var w, d;
    (w = i.children) == null || w.sort(
      (p, k) => +!p.children - +!k.children || p.name.localeCompare(k.name)
    ), (d = i.children) == null || d.forEach(D);
  };
  return D(m), m.children;
}
function Ot(r, o) {
  if (!r) return 0;
  const m = r.toLowerCase(), h = o.toLowerCase();
  let y = 0, D = 0, i = -1;
  for (const w of m) {
    const d = h.indexOf(w, D);
    if (d === -1) return null;
    y += d === i + 1 ? 3 : 1, d >= h.lastIndexOf("/") + 1 && (y += 2), i = d, D = d + 1;
  }
  return y - h.length / 100;
}
function Tt(r) {
  const o = /* @__PURE__ */ new Set();
  for (const m of r) {
    const h = m.split("/").filter(Boolean).slice(0, -1);
    h.forEach((y, D) => o.add(h.slice(0, D + 1).join("/")));
  }
  return o;
}
function x({ name: r, className: o }) {
  return /* @__PURE__ */ l(
    "span",
    {
      "aria-hidden": !0,
      className: `codicon codicon-${r}${o ? ` ${o}` : ""}`
    }
  );
}
const an = {
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
function rn(r, o) {
  var h;
  if (o.folder)
    return /* @__PURE__ */ l(x, { name: o.open ? "folder-opened" : "folder" });
  const m = ((h = O(r).split(".").pop()) == null ? void 0 : h.toLowerCase()) ?? "";
  return /* @__PURE__ */ l(x, { name: an[m] ?? "file-code" });
}
function Ie(r) {
  const o = [];
  for (const m of r)
    m && (m === "separator" && (!o.length || o[o.length - 1] === "separator") || o.push(m));
  for (; o[o.length - 1] === "separator"; ) o.pop();
  return o;
}
function Rt({
  x: r,
  y: o,
  items: m,
  onClose: h
}) {
  const y = T(null), [D, i] = S({ left: r, top: o });
  W(() => {
    var k;
    const d = y.current;
    if (d) {
      const C = d.getBoundingClientRect();
      i({
        left: Math.max(4, Math.min(r, window.innerWidth - C.width - 4)),
        top: Math.max(4, Math.min(o, window.innerHeight - C.height - 4))
      }), (k = d.querySelector("button:not(:disabled)")) == null || k.focus();
    }
    const p = () => h();
    return window.addEventListener("pointerdown", p), window.addEventListener("blur", p), window.addEventListener("resize", p), () => {
      window.removeEventListener("pointerdown", p), window.removeEventListener("blur", p), window.removeEventListener("resize", p);
    };
  }, [r, o, h]);
  const w = (d) => {
    var C, I;
    const p = [
      ...((C = y.current) == null ? void 0 : C.querySelectorAll("button:not(:disabled)")) ?? []
    ], k = p.indexOf(document.activeElement);
    (I = p[(k + d + p.length) % p.length]) == null || I.focus();
  };
  return /* @__PURE__ */ l(
    "div",
    {
      ref: y,
      className: "wb-menu",
      role: "menu",
      style: D,
      onPointerDown: (d) => d.stopPropagation(),
      onContextMenu: (d) => d.preventDefault(),
      onKeyDown: (d) => {
        d.stopPropagation(), d.key === "Escape" && h(), d.key === "ArrowDown" && (d.preventDefault(), w(1)), d.key === "ArrowUp" && (d.preventDefault(), w(-1));
      },
      children: m.map(
        (d, p) => d === "separator" ? /* @__PURE__ */ l("div", { className: "wb-menu-separator", role: "separator" }, p) : /* @__PURE__ */ f(
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
              /* @__PURE__ */ l("span", { children: d.label }),
              d.keys ? /* @__PURE__ */ l("span", { className: "wb-menu-keys", children: d.keys }) : null
            ]
          },
          d.label
        )
      )
    }
  );
}
const Ae = "application/x-workbench-path", lt = "\0root";
function Lt({
  initial: r,
  onSubmit: o,
  onCancel: m
}) {
  const h = T(null), y = T(!1);
  W(() => {
    const i = h.current;
    if (!i) return;
    i.focus();
    const w = r.lastIndexOf(".");
    i.setSelectionRange(0, w > 0 ? w : r.length);
  }, [r]);
  const D = (i) => {
    if (y.current) return;
    y.current = !0;
    const w = i == null ? void 0 : i.trim().replace(/^\/+|\/+$/g, "");
    w && w !== r ? o(w) : m();
  };
  return /* @__PURE__ */ l(
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
function sn(r) {
  const { files: o, edit: m, collapsed: h } = r, y = K(
    () => ln(o, r.emptyFolders),
    [o, r.emptyFolders]
  ), [D, i] = S(null), [w, d] = S(null);
  W(() => i(null), [r.activePath]);
  const [p, k] = S(null), C = T(void 0), I = (a) => {
    const N = [...a.dataTransfer.types];
    return N.includes(Ae) ? r.canMove : N.includes("Files") && r.canUpload;
  }, V = (a, N) => {
    if (!I(a)) return;
    a.preventDefault(), a.stopPropagation(), a.dataTransfer.dropEffect = a.dataTransfer.types.includes(Ae) ? "move" : "copy";
    const u = N || lt;
    u !== p && (k(u), clearTimeout(C.current), N && h.has(N) && (C.current = setTimeout(() => r.onToggle(N), 600)));
  }, U = () => {
    clearTimeout(C.current), k(null);
  }, E = (a, N) => {
    if (!I(a)) return;
    a.preventDefault(), a.stopPropagation(), U();
    const u = a.dataTransfer.getData(Ae);
    if (u) {
      const G = N ? `${N}/${O(u)}` : O(u);
      G !== u && r.onMove(u, G);
      return;
    }
    const M = [...a.dataTransfer.files];
    M.length && r.onDropFiles(M, N);
  }, B = [], Y = (a, N) => {
    for (const u of a)
      B.push({ node: u, depth: N }), u.children && !h.has(u.path) && Y(u.children, N + 1);
  };
  Y(y, 0);
  const c = (a) => {
    i(a.path), r.onFocus({ path: a.path, folder: !!a.children });
  }, g = (a, N) => {
    N && h.has(N) && r.onToggle(N), r.onEdit({ kind: "create", type: a, folder: N });
  }, R = (a, N) => {
    if ((m == null ? void 0 : m.kind) !== "create" || m.folder !== a) return null;
    const { type: u } = m;
    return /* @__PURE__ */ f(
      "div",
      {
        className: "wb-tree-row",
        style: { paddingLeft: 8 + N * 8 },
        children: [
          /* @__PURE__ */ l("span", { className: "wb-twistie", children: u === "folder" ? /* @__PURE__ */ l(x, { name: "chevron-right" }) : null }),
          /* @__PURE__ */ l("span", { className: "wb-file-icon", children: /* @__PURE__ */ l(x, { name: u === "folder" ? "folder" : "file" }) }),
          /* @__PURE__ */ l(
            Lt,
            {
              initial: "",
              onCancel: () => r.onEdit(null),
              onSubmit: (M) => r.onSubmitEdit(m, a ? `${a}/${M}` : M)
            }
          )
        ]
      },
      `create:${a}`
    );
  }, le = D ?? r.activePath;
  return /* @__PURE__ */ f(
    "div",
    {
      className: "wb-tree",
      role: "tree",
      tabIndex: 0,
      onKeyDown: (a) => {
        const N = B.findIndex(({ node: M }) => M.path === le), u = B[N];
        if (a.key === "ArrowDown" || a.key === "ArrowUp") {
          a.preventDefault();
          const M = B[N + (a.key === "ArrowDown" ? 1 : -1)] ?? B[0];
          M && c(M.node);
        } else if (a.key === "ArrowRight" && (u != null && u.node.children))
          a.preventDefault(), h.has(u.node.path) && r.onToggle(u.node.path);
        else if (a.key === "ArrowLeft" && u)
          if (a.preventDefault(), u.node.children && !h.has(u.node.path))
            r.onToggle(u.node.path);
          else {
            const M = B.find(({ node: G }) => G.path === ee(u.node.path));
            M && c(M.node);
          }
        else if (a.key === "Enter" && u)
          a.preventDefault(), u.node.file ? r.onOpen(u.node.file) : r.onToggle(u.node.path);
        else if (a.key === "F2" && u)
          r.onShortcut("rename", u.node);
        else if ((a.key === "Delete" || a.key === "Backspace" && a.metaKey) && u)
          r.onShortcut("delete", u.node);
        else if ((a.metaKey || a.ctrlKey) && u) {
          const M = { c: "copy", x: "cut", v: "paste" }[a.key.toLowerCase()];
          M && (a.preventDefault(), r.onShortcut(M, u.node));
        }
      },
      onContextMenu: (a) => {
        a.preventDefault(), i(null), r.onFocus(null), r.menuFor(null).length && d({ x: a.clientX, y: a.clientY, node: null });
      },
      "data-drop": p === lt,
      onDragOver: (a) => V(a, ""),
      onDragLeave: (a) => {
        a.currentTarget.contains(a.relatedTarget) || U();
      },
      onDrop: (a) => E(a, ""),
      onClick: (a) => {
        a.target === a.currentTarget && (i(null), r.onFocus(null));
      },
      children: [
        R("", 0),
        !B.length && !m ? /* @__PURE__ */ l("div", { className: "wb-empty", children: "No files yet." }) : null,
        B.map(({ node: a, depth: N }) => {
          const u = !!a.children, M = u && !h.has(a.path), G = (m == null ? void 0 : m.kind) === "rename" && m.path === a.path, te = !u && r.dirtyPaths.has(a.path), qe = u ? void 0 : r.problemOf(a.path);
          return /* @__PURE__ */ f("div", { children: [
            /* @__PURE__ */ f(
              "div",
              {
                role: "treeitem",
                "aria-selected": a.path === le,
                "aria-expanded": u ? M : void 0,
                className: "wb-tree-row",
                "data-dirty": te,
                "data-problem": qe,
                "data-cut": a.path === r.cutPath,
                "data-drop": p !== null && p !== lt && (a.path === p || a.path.startsWith(`${p}/`)),
                title: a.path,
                style: { paddingLeft: 8 + N * 8 },
                draggable: !!a.file && r.canMove && !G,
                onDragStart: (P) => {
                  P.dataTransfer.setData(Ae, a.path), P.dataTransfer.setData("text/plain", a.path), P.dataTransfer.effectAllowed = "move";
                },
                onDragEnd: U,
                onDragOver: (P) => V(P, u ? a.path : ee(a.path)),
                onDrop: (P) => E(P, u ? a.path : ee(a.path)),
                onClick: () => {
                  c(a), a.file ? r.onOpen(a.file) : r.onToggle(a.path);
                },
                onContextMenu: (P) => {
                  P.preventDefault(), P.stopPropagation(), c(a), r.menuFor(a).length && d({ x: P.clientX, y: P.clientY, node: a });
                },
                children: [
                  /* @__PURE__ */ l("span", { className: "wb-twistie", children: u ? /* @__PURE__ */ l(x, { name: M ? "chevron-down" : "chevron-right" }) : null }),
                  /* @__PURE__ */ l("span", { className: "wb-file-icon", children: r.icon(a.path, { folder: u, open: M }) }),
                  G ? /* @__PURE__ */ l(
                    Lt,
                    {
                      initial: a.name,
                      onCancel: () => r.onEdit(null),
                      onSubmit: (P) => {
                        const ce = ee(a.path);
                        r.onSubmitEdit(
                          { kind: "rename", path: a.path },
                          ce ? `${ce}/${P}` : P
                        );
                      }
                    }
                  ) : /* @__PURE__ */ f(Ne, { children: [
                    /* @__PURE__ */ l("span", { className: "wb-tree-label", children: a.name }),
                    te ? /* @__PURE__ */ l("span", { className: "wb-tree-badge", children: "M" }) : null,
                    /* @__PURE__ */ f("span", { className: "wb-tree-actions", children: [
                      u && r.canCreateFile ? /* @__PURE__ */ l(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "New File…",
                          "aria-label": `New file in ${a.path}`,
                          onClick: (P) => {
                            P.stopPropagation(), g("file", a.path);
                          },
                          children: /* @__PURE__ */ l(x, { name: "new-file" })
                        }
                      ) : null,
                      u && r.canCreateFolder ? /* @__PURE__ */ l(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "New Folder…",
                          "aria-label": `New folder in ${a.path}`,
                          onClick: (P) => {
                            P.stopPropagation(), g("folder", a.path);
                          },
                          children: /* @__PURE__ */ l(x, { name: "new-folder" })
                        }
                      ) : null,
                      a.file && r.canRename ? /* @__PURE__ */ l(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "Rename… (F2)",
                          "aria-label": `Rename ${O(a.path)}`,
                          onClick: (P) => {
                            P.stopPropagation(), r.onEdit({ kind: "rename", path: a.path });
                          },
                          children: /* @__PURE__ */ l(x, { name: "edit" })
                        }
                      ) : null,
                      a.file && r.canDelete ? /* @__PURE__ */ l(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "Delete",
                          "aria-label": `Delete ${O(a.path)}`,
                          onClick: (P) => {
                            P.stopPropagation(), r.onDelete(a.file);
                          },
                          children: /* @__PURE__ */ l(x, { name: "trash" })
                        }
                      ) : null
                    ] })
                  ] })
                ]
              }
            ),
            M ? R(a.path, N + 1) : null
          ] }, `${u ? "d" : "f"}:${a.path}`);
        }),
        w ? /* @__PURE__ */ l(
          Rt,
          {
            x: w.x,
            y: w.y,
            items: r.menuFor(w.node),
            onClose: () => d(null)
          }
        ) : null
      ]
    }
  );
}
function on({
  start: r = "",
  commands: o,
  files: m,
  recent: h,
  icon: y,
  onOpen: D,
  onClose: i
}) {
  const [w, d] = S(r), p = w.startsWith(">"), [k, C] = S(0), I = T(null), V = K(() => {
    if (!w.trim()) {
      const c = new Map(h.map((g, R) => [g, R]));
      return [...m].sort(
        (g, R) => (c.get(g.path) ?? 1e9) - (c.get(R.path) ?? 1e9) || g.path.localeCompare(R.path)
      ).slice(0, 50);
    }
    return m.map((c) => ({ file: c, score: Ot(w.trim(), c.path) })).filter((c) => c.score !== null).sort((c, g) => g.score - c.score).slice(0, 50).map((c) => c.file);
  }, [m, w, h]), U = K(() => {
    if (!p) return [];
    const c = w.slice(1).trim();
    return o.map((g) => ({ command: g, score: Ot(c, g.label) })).filter((g) => g.score !== null).sort(
      (g, R) => R.score - g.score || g.command.label.localeCompare(R.command.label)
    ).map((g) => g.command);
  }, [p, o, w]), E = p ? U.length : V.length;
  W(() => {
    var c, g;
    (g = (c = I.current) == null ? void 0 : c.querySelector('[aria-selected="true"]')) == null || g.scrollIntoView({ block: "nearest" });
  }, [k]);
  const B = (c) => {
    c && D(c), i();
  }, Y = (c) => {
    i(), c && setTimeout(c.run, 0);
  };
  return /* @__PURE__ */ l("div", { className: "wb-quickopen-backdrop", onMouseDown: i, children: /* @__PURE__ */ f(
    "div",
    {
      className: "wb-quickopen",
      role: "dialog",
      "aria-label": "Go to file",
      onMouseDown: (c) => c.stopPropagation(),
      children: [
        /* @__PURE__ */ l(
          "input",
          {
            autoFocus: !0,
            value: w,
            placeholder: "Search files by name (type > for commands)",
            spellCheck: !1,
            onChange: (c) => {
              d(c.target.value), C(0);
            },
            onKeyDown: (c) => {
              c.key === "Escape" && (c.preventDefault(), i()), c.key === "Enter" && (c.preventDefault(), p ? Y(U[k]) : B(V[k])), c.key === "ArrowDown" && (c.preventDefault(), C((g) => Math.min(g + 1, E - 1))), c.key === "ArrowUp" && (c.preventDefault(), C((g) => Math.max(g - 1, 0)));
            }
          }
        ),
        /* @__PURE__ */ f("div", { className: "wb-quickopen-list", ref: I, role: "listbox", children: [
          U.map((c, g) => /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              role: "option",
              "aria-selected": g === k,
              className: "wb-quickopen-item",
              onMouseEnter: () => C(g),
              onClick: () => Y(c),
              children: c.label
            },
            c.id
          )),
          (p ? [] : V).map((c, g) => /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              role: "option",
              "aria-selected": g === k,
              className: "wb-quickopen-item",
              onMouseEnter: () => C(g),
              onClick: () => B(c),
              children: [
                /* @__PURE__ */ l("span", { className: "wb-file-icon", children: y(c.path) }),
                /* @__PURE__ */ l("span", { children: O(c.path) }),
                /* @__PURE__ */ l("span", { className: "wb-quickopen-dir", children: ee(c.path) })
              ]
            },
            c.path
          )),
          E ? null : /* @__PURE__ */ f("div", { className: "wb-empty", children: [
            "No matching ",
            p ? "commands" : "files"
          ] })
        ] })
      ]
    }
  ) });
}
const ye = "explorer", cn = {
  error: "error",
  warning: "warning",
  info: "info"
}, un = typeof navigator < "u" && /Mac|iPhone|iPad/.test(navigator.platform), Z = un ? "⌘" : "Ctrl+";
function Bt({
  axis: r,
  onDrag: o
}) {
  const [m, h] = S(!1);
  return /* @__PURE__ */ l(
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
const ie = (r) => r instanceof Error ? r.message : String(r), mn = Zt(
  function(o, m) {
    var $t, Ft;
    const {
      files: h,
      readFile: y,
      onSave: D,
      onCreate: i,
      onCreateFolder: w,
      onRefresh: d,
      onUpload: p,
      onRename: k,
      onDelete: C,
      onCopy: I,
      onRenameFolder: V,
      onDeleteFolder: U,
      problems: E = [],
      theme: B = "dark",
      readOnly: Y = !1,
      optimisticSave: c = !1,
      modelScope: g = "workbench"
    } = o, R = T(null), le = T(null), [j, at] = S(null), [a, N] = S(ye), [u, M] = S(260), [G, te] = S(!1), [qe, P] = S(200), [ce, ke] = S(null), [X, ze] = S([]), [$, Ke] = S(null), [ae, re] = S({}), [jt, ue] = S(/* @__PURE__ */ new Set()), [It, se] = S(null), [We, ve] = S(/* @__PURE__ */ new Set()), [rt, st] = S(!1), Ue = T(null), [ot, it] = S({ line: 1, column: 1 }), [ct, L] = S(null), [At, Ce] = S(!1), A = T({ buffers: ae, activePath: $, openPaths: X, files: h });
    A.current = { buffers: ae, activePath: $, openPaths: X, files: h };
    const Ve = T(/* @__PURE__ */ new Set()), fe = T(/* @__PURE__ */ new Set()), ut = T(/* @__PURE__ */ new Set()), Ye = T(null), Ge = T(null), Xe = T(/* @__PURE__ */ new Set()), [_, xe] = S(null), [De, dt] = S(null), H = K(
      () => new Map(h.map((e) => [e.path, e])),
      [h]
    ), q = $ ? H.get($) ?? null : null, he = K(
      () => Tt(h.map((e) => e.path)),
      [h]
    ), _e = K(
      () => [.../* @__PURE__ */ new Set([...o.folders ?? [], ...We])],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [o.folders, We]
    );
    W(() => {
      ve((e) => {
        const t = [...e].filter((n) => !he.has(n));
        return t.length === e.size ? e : new Set(t);
      });
    }, [he]);
    const de = $ ? ae[$] : void 0, Pe = K(
      () => Object.entries(ae).filter(([, e]) => e.text !== e.saved).map(([e]) => e),
      [ae]
    ), He = K(() => new Set(Pe), [Pe]), Se = K(
      () => new Set(
        Object.entries(ae).filter(([, e]) => e.text !== (e.storing ?? e.saved)).map(([e]) => e)
      ),
      [ae]
    ), { onActiveFileChange: Me, onDirtyChange: $e } = o;
    W(() => {
      Me == null || Me($), it({ line: 1, column: 1 });
    }, [$, Me]);
    const Qe = Pe.join(`
`);
    W(
      () => $e == null ? void 0 : $e(Qe ? Qe.split(`
`) : []),
      [Qe, $e]
    );
    const ft = Q(
      (e) => {
        var t;
        return ((t = o.language) == null ? void 0 : t.call(o, e)) ?? nn(e);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [o.language]
    ), Fe = Q(
      (e, t = { folder: !1, open: !1 }) => {
        var n;
        return ((n = o.fileIcon) == null ? void 0 : n.call(o, e, t)) ?? rn(e, t);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [o.fileIcon]
    ), me = Q(
      (e) => `file:///${g}/${e}`,
      [g]
    ), Ee = Q(
      (e) => {
        Ve.current.has(e) || (Ve.current.add(e), y(e).then(
          (t) => re((n) => ({
            ...n,
            [e]: { text: t, saved: t }
          }))
        ).catch((t) => {
          A.current.files.some((n) => n.path === e) && L(`Couldn't open ${e}: ${ie(t)}`);
        }).finally(() => Ve.current.delete(e)));
      },
      [y]
    ), z = Q(
      (e, t) => {
        const n = A.current.files.find((s) => s.path === e);
        if (!n) {
          Ge.current = e;
          return;
        }
        L(null), ze(
          (s) => s.includes(e) ? s : [...s, e]
        ), Ke(e), t && (Ye.current = {
          path: e,
          line: t.line,
          column: t.column ?? 1
        }), !n.binary && !A.current.buffers[e] && Ee(e);
      },
      [Ee]
    ), be = Q(
      (e) => {
        var t;
        (t = j == null ? void 0 : j.editor.getModel(j.Uri.parse(me(e)))) == null || t.dispose();
      },
      [j, me]
    ), we = Q(
      (e) => {
        if (!e.length) return;
        const t = new Set(e);
        ze((n) => {
          const s = n.filter((b) => !t.has(b));
          return Ke((b) => {
            if (!b || !t.has(b)) return b;
            const v = n.indexOf(b);
            return s[Math.min(v, s.length - 1)] ?? null;
          }), s;
        }), re((n) => {
          const s = { ...n };
          for (const b of e) delete s[b];
          return s;
        }), e.forEach(be);
      },
      [be]
    ), ht = (e) => {
      He.has(e) && !window.confirm(
        `Close ${O(e)} without saving? Your changes will be lost.`
      ) || we([e]);
    };
    W(() => {
      we(
        A.current.openPaths.filter(
          (t) => !H.has(t) && !Xe.current.has(t)
        )
      );
      const e = Ge.current;
      e && H.has(e) && (Ge.current = null, z(e));
    }, [H, we, z]);
    const oe = Q(
      async (e = A.current.activePath) => {
        const t = e ? A.current.buffers[e] : void 0;
        if (!e || !t || !D || Y || t.text === t.saved) return !1;
        if (fe.current.has(e))
          return t.text !== t.storing && ut.current.add(e), !1;
        const n = t.text, s = (b) => re((v) => {
          const F = v[e];
          if (!F) return v;
          const { storing: ge, ...Et } = F;
          return { ...v, [e]: b ? { ...Et, saved: n } : Et };
        });
        fe.current.add(e), Ce(!0), L(null), c && re(
          (b) => b[e] ? { ...b, [e]: { ...b[e], storing: n } } : b
        );
        try {
          return await D(e, n), s(!0), !0;
        } catch (b) {
          return s(!1), L(`Couldn't save ${O(e)}: ${ie(b)}`), !1;
        } finally {
          fe.current.delete(e), Ce(fe.current.size > 0), ut.current.delete(e) && setTimeout(() => void oe(e), 0);
        }
      },
      [D, c, Y]
    ), Oe = Q(async () => (await Promise.all(
      Object.keys(A.current.buffers).map((t) => {
        const n = A.current.buffers[t];
        return n.text === n.saved ? !0 : oe(t);
      })
    )).every(Boolean), [oe]), mt = Q(
      (e) => {
        var n;
        const t = (e ? [e] : A.current.openPaths).filter(
          (s) => H.has(s)
        );
        re((s) => {
          const b = { ...s };
          for (const v of t) delete b[v];
          return b;
        });
        for (const s of t)
          be(s), (n = H.get(s)) != null && n.binary || Ee(s);
      },
      [be, H, Ee]
    );
    en(
      m,
      () => ({
        open: z,
        save: () => oe(),
        saveAll: Oe,
        reload: mt,
        dirtyPaths: () => Object.entries(A.current.buffers).filter(([, e]) => e.text !== e.saved).map(([e]) => e)
      }),
      [z, mt, oe, Oe]
    );
    const Te = (e) => he.has(e) || _e.includes(e), Le = (e) => H.has(e) || Te(e), qt = (e) => {
      ze((t) => t.map((n) => e.get(n) ?? n)), Ke((t) => t && (e.get(t) ?? t)), re((t) => {
        const n = {};
        for (const [s, b] of Object.entries(t))
          n[e.get(s) ?? s] = b;
        return n;
      });
      for (const t of e.keys()) be(t);
    }, bt = async (e, t) => {
      const n = /* @__PURE__ */ new Map();
      if (Te(e))
        for (const s of h)
          s.path.startsWith(`${e}/`) && n.set(s.path, `${t}${s.path.slice(e.length)}`);
      else
        n.set(e, t);
      for (const s of n.keys()) Xe.current.add(s);
      try {
        if (!Te(e)) await (k == null ? void 0 : k(e, t));
        else if (V) await V(e, t);
        else
          for (const [s, b] of n) await (k == null ? void 0 : k(s, b));
        qt(n), ve((s) => {
          const b = /* @__PURE__ */ new Set();
          for (const v of s)
            b.add(
              v === e || v.startsWith(`${e}/`) ? `${t}${v.slice(e.length)}` : v
            );
          return b;
        });
      } finally {
        for (const s of n.keys()) Xe.current.delete(s);
      }
    }, wt = async (e, t) => {
      if (se(null), L(null), Le(t)) {
        L(`${t} already exists`);
        return;
      }
      try {
        e.kind === "create" && e.type === "folder" ? (w ? await w(t) : ve((n) => new Set(n).add(t)), ue((n) => {
          const s = new Set(n);
          return s.delete(t), s;
        }), Ue.current = { path: t, folder: !0 }) : e.kind === "create" ? (await (i == null ? void 0 : i(t)), z(t)) : await bt(e.path, t);
      } catch (n) {
        L(ie(n));
      }
    }, zt = (e, t) => {
      const n = (F) => e ? `${e}/${F}` : F;
      if (!Le(n(t))) return n(t);
      const s = t.lastIndexOf("."), b = s > 0 ? t.slice(0, s) : t, v = s > 0 ? t.slice(s) : "";
      for (let F = 1; ; F++) {
        const ge = `${b} copy${F > 1 ? ` ${F}` : ""}${v}`;
        if (!Le(n(ge))) return n(ge);
      }
    }, pt = async (e) => {
      var s, b;
      if (!_) return;
      const { path: t, mode: n } = _;
      L(null);
      try {
        if (n === "cut") {
          xe(null);
          const F = e ? `${e}/${O(t)}` : O(t);
          if (F === t) return;
          if (Le(F)) throw new Error(`${F} already exists`);
          await bt(t, F);
          return;
        }
        const v = zt(e, O(t));
        if (I)
          await I(t, v);
        else {
          if ((s = H.get(t)) != null && s.binary || !i)
            throw new Error(`${O(t)} can't be copied here`);
          {
            const F = ((b = A.current.buffers[t]) == null ? void 0 : b.saved) ?? await y(t);
            await i(v), F && await (D == null ? void 0 : D(v, F));
          }
        }
        z(v);
      } catch (v) {
        L(ie(v));
      }
    }, Kt = () => {
      const e = Ue.current;
      return e ? e.folder ? e.path : ee(e.path) : $ ? ee($) : "";
    }, gt = (e) => {
      const t = Kt();
      ue((n) => {
        if (!t || !n.has(t)) return n;
        const s = new Set(n);
        return s.delete(t), s;
      }), se({ kind: "create", type: e, folder: t });
    }, Wt = async (e, t) => {
      L(null), Ce(!0);
      try {
        for (const n of e)
          await (p == null ? void 0 : p(n, t ? `${t}/${n.name}` : n.name));
      } catch (n) {
        L(ie(n));
      } finally {
        Ce(fe.current.size > 0);
      }
    }, yt = async () => {
      if (!(!d || rt)) {
        st(!0), L(null);
        try {
          await d();
        } catch (e) {
          L(ie(e));
        } finally {
          st(!1);
        }
      }
    }, Be = async (e) => {
      L(null);
      try {
        Te(e) ? U && await U(e) : await (C == null ? void 0 : C(e)), ve((t) => {
          const n = [...t].filter(
            (s) => s !== e && !s.startsWith(`${e}/`)
          );
          return n.length === t.size ? t : new Set(n);
        });
      } catch (t) {
        L(ie(t));
      }
    }, Nt = K(() => {
      const e = /* @__PURE__ */ new Map();
      for (const t of E) {
        if (!t.path || t.severity === "info") continue;
        const n = t.severity === "warning" ? "warning" : "error";
        e.get(t.path) !== "error" && e.set(t.path, n);
      }
      return e;
    }, [E]), kt = K(() => {
      const e = { error: 0, warning: 0, info: 0 };
      for (const t of E) e[t.severity ?? "error"]++;
      return e;
    }, [E]), Ut = K(() => {
      const e = /* @__PURE__ */ new Map();
      for (const t of E) {
        const n = t.path ?? "";
        e.set(n, [...e.get(n) ?? [], t]);
      }
      return [...e];
    }, [E]);
    W(() => {
      if (!j || !$ || !de) return;
      const e = j.editor.getModel(j.Uri.parse(me($)));
      e && j.editor.setModelMarkers(
        e,
        "workbench",
        E.filter((t) => t.path === $).map((t) => {
          const n = Math.min(
            Math.max(t.line ?? 1, 1),
            e.getLineCount()
          ), s = Math.max(t.column ?? 1, 1);
          return {
            severity: t.severity === "warning" ? j.MarkerSeverity.Warning : t.severity === "info" ? j.MarkerSeverity.Info : j.MarkerSeverity.Error,
            message: t.message,
            startLineNumber: n,
            startColumn: s,
            endLineNumber: n,
            endColumn: e.getLineMaxColumn(n)
          };
        })
      );
    }, [j, $, de, E, me]), W(() => {
      const e = Ye.current, t = le.current;
      if (!e || !t || e.path !== $ || !de)
        return;
      const n = setTimeout(() => {
        Ye.current = null, t.revealLineInCenter(e.line), t.setPosition({ lineNumber: e.line, column: e.column }), t.focus();
      }, 0);
      return () => clearTimeout(n);
    }, [$, de]);
    const Je = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
      const t = e.key.toLowerCase();
      t === "s" ? (e.preventDefault(), e.stopPropagation(), e.shiftKey ? Oe() : oe()) : t === "p" && !e.shiftKey ? (e.preventDefault(), e.stopPropagation(), ke("")) : t === "p" ? (e.preventDefault(), e.stopPropagation(), ke(">")) : t === "b" ? (e.preventDefault(), N((n) => n ? null : ye)) : t === "j" && (e.preventDefault(), te((n) => !n));
    }, vt = T(Je);
    vt.current = Je, W(() => {
      const e = (t) => {
        t.target === document.body && vt.current(t);
      };
      return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
    }, []);
    const Vt = () => {
      const e = le.current;
      return [
        { id: "wb.save", label: "File: Save", run: () => void oe() },
        { id: "wb.saveAll", label: "File: Save All", run: () => void Oe() },
        {
          id: "wb.sideBar",
          label: "View: Toggle Side Bar",
          run: () => N((t) => t ? null : ye)
        },
        {
          id: "wb.problems",
          label: "View: Toggle Problems",
          run: () => te((t) => !t)
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
    }, Ct = Pe.length > 0;
    W(() => {
      if (!Ct) return;
      const e = (t) => t.preventDefault();
      return window.addEventListener("beforeunload", e), () => window.removeEventListener("beforeunload", e);
    }, [Ct]);
    const J = !Y, Ze = !!i && J, et = !!(w || i) && J, ne = !!k && J, xt = !!(V || k) && J, tt = !!C && J, Re = !!(I || i) && J, Dt = J && !!_ && ((_ == null ? void 0 : _.mode) === "cut" ? ne : Re), Pt = (e) => J && (!!U || We.has(e) && !he.has(e)), St = (e, t) => {
      ue((n) => {
        if (!t || !n.has(t)) return n;
        const s = new Set(n);
        return s.delete(t), s;
      }), se({ kind: "create", type: e, folder: t });
    }, nt = (e) => {
      var t;
      return void ((t = navigator.clipboard) == null ? void 0 : t.writeText(e));
    }, Mt = () => ue(/* @__PURE__ */ new Set([...he, ..._e])), Yt = (e) => {
      const t = !!(e != null && e.children), n = e ? t ? e.path : ee(e.path) : "", s = [];
      Ze && s.push({ label: "New File…", run: () => St("file", n) }), et && s.push({
        label: "New Folder…",
        run: () => St("folder", n)
      });
      const b = ne || Re ? {
        label: "Paste",
        keys: `${Z}V`,
        disabled: !Dt,
        run: () => void pt(n)
      } : null;
      return Ie(e ? t ? [
        ...s,
        "separator",
        b,
        "separator",
        { label: "Copy Path", run: () => nt(e.path) },
        "separator",
        xt ? {
          label: "Rename…",
          keys: "F2",
          run: () => se({ kind: "rename", path: e.path })
        } : null,
        Pt(e.path) ? { label: "Delete", keys: "Del", run: () => void Be(e.path) } : null
      ] : [
        { label: "Open", run: () => z(e.path) },
        "separator",
        ne ? {
          label: "Cut",
          keys: `${Z}X`,
          run: () => xe({ path: e.path, mode: "cut" })
        } : null,
        Re ? {
          label: "Copy",
          keys: `${Z}C`,
          run: () => xe({ path: e.path, mode: "copy" })
        } : null,
        b,
        "separator",
        { label: "Copy Path", run: () => nt(e.path) },
        "separator",
        ne ? {
          label: "Rename…",
          keys: "F2",
          run: () => se({ kind: "rename", path: e.path })
        } : null,
        tt ? { label: "Delete", keys: "Del", run: () => void Be(e.path) } : null
      ] : [
        ...s,
        "separator",
        b,
        "separator",
        d ? { label: "Refresh Explorer", run: () => void yt() } : null,
        { label: "Collapse Folders", run: Mt }
      ]);
    }, Gt = (e, t) => {
      const n = !!t.children;
      e === "paste" ? Dt && pt(n ? t.path : ee(t.path)) : e === "rename" ? (n ? xt : ne) && se({ kind: "rename", path: t.path }) : e === "delete" ? (n ? Pt(t.path) : tt) && Be(t.path) : !n && (e === "cut" ? ne : Re) && xe({ path: t.path, mode: e });
    }, je = (e) => {
      const t = e.filter((n) => He.has(n));
      t.length && !window.confirm(
        t.length === 1 ? `Close ${O(t[0])} without saving? Your changes will be lost.` : `Close ${t.length} files without saving? Your changes will be lost.`
      ) || we(e);
    }, Xt = (e) => {
      const t = X.indexOf(e), n = X.filter((v) => v !== e), s = X.slice(t + 1), b = X.filter((v) => !He.has(v));
      return Ie([
        { label: "Close", run: () => je([e]) },
        {
          label: "Close Others",
          disabled: !n.length,
          run: () => je(n)
        },
        {
          label: "Close to the Right",
          disabled: !s.length,
          run: () => je(s)
        },
        { label: "Close Saved", disabled: !b.length, run: () => we(b) },
        { label: "Close All", run: () => je(X) },
        "separator",
        { label: "Copy Path", run: () => nt(e) },
        {
          label: "Reveal in Explorer",
          run: () => {
            N(ye), ue((v) => {
              const F = new Set(v);
              for (const ge of Tt([e])) F.delete(ge);
              return F;
            }), z(e);
          }
        }
      ]);
    }, _t = [
      { id: ye, icon: "files", title: "Explorer", badge: void 0 },
      ...o.activities ?? []
    ], pe = ($t = o.activities) == null ? void 0 : $t.find(
      (e) => e.id === a
    ), Ht = (e) => ue((t) => {
      const n = new Set(t);
      return n.delete(e) || n.add(e), n;
    }), Qt = Y || !D || !!(q != null && q.readOnly);
    return /* @__PURE__ */ f(
      "div",
      {
        ref: R,
        className: `wb${o.className ? ` ${o.className}` : ""}`,
        "data-theme": B,
        style: o.style,
        onKeyDownCapture: Je,
        children: [
          /* @__PURE__ */ f("header", { className: "wb-titlebar", children: [
            /* @__PURE__ */ l("div", { className: "wb-titlebar-title", children: /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                className: "wb-command-center",
                title: `Go to File (${Z}P)`,
                onClick: () => ke(""),
                children: [
                  /* @__PURE__ */ l(x, { name: "search" }),
                  /* @__PURE__ */ l("span", { children: o.title ?? "Search files" })
                ]
              }
            ) }),
            /* @__PURE__ */ l("div", { className: "wb-titlebar-actions", children: o.actions })
          ] }),
          /* @__PURE__ */ f("div", { className: "wb-body", children: [
            /* @__PURE__ */ f("nav", { className: "wb-activitybar", "aria-label": "Views", children: [
              _t.map((e) => /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: "wb-activity",
                  title: e.title,
                  "aria-label": e.title,
                  "aria-pressed": a === e.id,
                  onClick: () => N((t) => t === e.id ? null : e.id),
                  children: [
                    /* @__PURE__ */ l(x, { name: e.icon }),
                    e.badge !== void 0 && e.badge !== null ? /* @__PURE__ */ l("span", { className: "wb-activity-badge", children: e.badge }) : null
                  ]
                },
                e.id
              )),
              /* @__PURE__ */ l("div", { className: "wb-activity-spacer" }),
              /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  className: "wb-activity",
                  title: `Problems (${Z}J)`,
                  "aria-label": "Problems",
                  "aria-pressed": G,
                  onClick: () => te((e) => !e),
                  children: [
                    /* @__PURE__ */ l(x, { name: "warning" }),
                    E.length ? /* @__PURE__ */ l("span", { className: "wb-activity-badge", children: E.length }) : null
                  ]
                }
              )
            ] }),
            a ? /* @__PURE__ */ f(Ne, { children: [
              /* @__PURE__ */ f("aside", { className: "wb-sidebar", style: { width: u }, children: [
                /* @__PURE__ */ l("div", { className: "wb-sidebar-title", children: /* @__PURE__ */ l("span", { children: (pe == null ? void 0 : pe.title) ?? "Explorer" }) }),
                pe ? /* @__PURE__ */ l("div", { className: "wb-sidebar-body", children: pe.render() }) : /* @__PURE__ */ f(Ne, { children: [
                  /* @__PURE__ */ f("div", { className: "wb-section-header", children: [
                    /* @__PURE__ */ l(x, { name: "chevron-down" }),
                    /* @__PURE__ */ l("span", { className: "wb-grow", children: o.explorerTitle ?? (typeof o.title == "string" ? o.title : "Files") }),
                    /* @__PURE__ */ f("span", { className: "wb-section-actions", children: [
                      Ze ? /* @__PURE__ */ l(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "New File…",
                          "aria-label": "New file",
                          onClick: () => gt("file"),
                          children: /* @__PURE__ */ l(x, { name: "new-file" })
                        }
                      ) : null,
                      et ? /* @__PURE__ */ l(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "New Folder…",
                          "aria-label": "New folder",
                          onClick: () => gt("folder"),
                          children: /* @__PURE__ */ l(x, { name: "new-folder" })
                        }
                      ) : null,
                      d ? /* @__PURE__ */ l(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "Refresh Explorer",
                          "aria-label": "Refresh explorer",
                          disabled: rt,
                          onClick: () => void yt(),
                          children: /* @__PURE__ */ l(x, { name: "refresh" })
                        }
                      ) : null,
                      /* @__PURE__ */ l(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "Collapse Folders",
                          "aria-label": "Collapse folders",
                          onClick: Mt,
                          children: /* @__PURE__ */ l(x, { name: "collapse-all" })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ l("div", { className: "wb-sidebar-body", children: /* @__PURE__ */ l(
                    sn,
                    {
                      files: h,
                      emptyFolders: _e,
                      menuFor: Yt,
                      cutPath: (_ == null ? void 0 : _.mode) === "cut" ? _.path : null,
                      onShortcut: Gt,
                      onFocus: (e) => {
                        Ue.current = e;
                      },
                      activePath: $,
                      dirtyPaths: Se,
                      problemOf: (e) => Nt.get(e),
                      icon: Fe,
                      collapsed: jt,
                      onToggle: Ht,
                      onOpen: (e) => z(e.path),
                      edit: It,
                      onEdit: se,
                      onSubmitEdit: (e, t) => void wt(e, t),
                      canMove: ne,
                      onMove: (e, t) => void wt({ kind: "rename", path: e }, t),
                      canUpload: !!p && J,
                      onDropFiles: (e, t) => void Wt(e, t),
                      canCreateFile: Ze,
                      canCreateFolder: et,
                      canRename: ne,
                      canDelete: tt,
                      onDelete: (e) => void Be(e.path)
                    }
                  ) })
                ] })
              ] }),
              /* @__PURE__ */ l(
                Bt,
                {
                  axis: "x",
                  onDrag: (e) => {
                    var n;
                    const t = (((n = R.current) == null ? void 0 : n.getBoundingClientRect().left) ?? 0) + 44;
                    M(Math.min(Math.max(e - t, 160), 640));
                  }
                }
              )
            ] }) : null,
            /* @__PURE__ */ f("main", { className: "wb-main", children: [
              X.length ? /* @__PURE__ */ l("div", { className: "wb-tabs", role: "tablist", children: X.map((e) => /* @__PURE__ */ f(
                "div",
                {
                  role: "tab",
                  "aria-selected": e === $,
                  className: "wb-tab",
                  "data-dirty": Se.has(e),
                  "data-problem": Nt.get(e),
                  title: e,
                  onClick: () => z(e),
                  onAuxClick: (t) => {
                    t.button === 1 && ht(e);
                  },
                  onContextMenu: (t) => {
                    t.preventDefault(), dt({ x: t.clientX, y: t.clientY, path: e });
                  },
                  children: [
                    /* @__PURE__ */ l("span", { className: "wb-file-icon", children: Fe(e) }),
                    /* @__PURE__ */ l("span", { className: "wb-tab-label", children: O(e) }),
                    /* @__PURE__ */ f(
                      "button",
                      {
                        type: "button",
                        className: "wb-tab-close",
                        "aria-label": `Close ${O(e)}`,
                        onClick: (t) => {
                          t.stopPropagation(), ht(e);
                        },
                        children: [
                          /* @__PURE__ */ l("span", { className: "wb-dirty-dot" }),
                          /* @__PURE__ */ l(x, { name: "close", className: "wb-close-icon" })
                        ]
                      }
                    )
                  ]
                },
                e
              )) }) : null,
              $ ? /* @__PURE__ */ l("div", { className: "wb-breadcrumbs", children: $.split("/").map((e, t) => /* @__PURE__ */ f(
                "span",
                {
                  style: { display: "contents" },
                  children: [
                    t ? /* @__PURE__ */ l(x, { name: "chevron-right" }) : null,
                    /* @__PURE__ */ l("span", { children: e })
                  ]
                },
                `${t}:${e}`
              )) }) : null,
              /* @__PURE__ */ l("div", { className: "wb-editor", children: q ? q.binary ? /* @__PURE__ */ l("div", { className: "wb-binary", children: ((Ft = o.renderBinary) == null ? void 0 : Ft.call(o, q)) ?? "This file isn't text and can't be shown in the editor." }) : de ? /* @__PURE__ */ l("div", { className: "wb-editor-fill", children: /* @__PURE__ */ l(
                Jt,
                {
                  path: me(q.path),
                  language: ft(q.path),
                  value: de.text,
                  theme: B === "dark" ? "vs-dark" : "vs",
                  beforeMount: o.beforeMount,
                  onMount: (e, t) => {
                    var n;
                    le.current = e, at(t), e.onDidChangeCursorPosition(
                      (s) => it({
                        line: s.position.lineNumber,
                        column: s.position.column
                      })
                    ), (n = o.onMount) == null || n.call(o, e, t);
                  },
                  onChange: (e) => {
                    const t = q.path;
                    re(
                      (n) => n[t] ? {
                        ...n,
                        [t]: { ...n[t], text: e ?? "" }
                      } : n
                    );
                  },
                  options: {
                    readOnly: Qt,
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
              ) }) : /* @__PURE__ */ l("div", { className: "wb-welcome", children: "Loading…" }) : /* @__PURE__ */ f("div", { className: "wb-welcome", children: [
                /* @__PURE__ */ l(x, { name: "code" }),
                /* @__PURE__ */ f("dl", { children: [
                  /* @__PURE__ */ l("dt", { children: "Go to File" }),
                  /* @__PURE__ */ l("dd", { children: /* @__PURE__ */ f("span", { className: "wb-kbd", children: [
                    Z,
                    "P"
                  ] }) }),
                  /* @__PURE__ */ l("dt", { children: "Save" }),
                  /* @__PURE__ */ l("dd", { children: /* @__PURE__ */ f("span", { className: "wb-kbd", children: [
                    Z,
                    "S"
                  ] }) }),
                  /* @__PURE__ */ l("dt", { children: "Toggle Side Bar" }),
                  /* @__PURE__ */ l("dd", { children: /* @__PURE__ */ f("span", { className: "wb-kbd", children: [
                    Z,
                    "B"
                  ] }) }),
                  /* @__PURE__ */ l("dt", { children: "Toggle Problems" }),
                  /* @__PURE__ */ l("dd", { children: /* @__PURE__ */ f("span", { className: "wb-kbd", children: [
                    Z,
                    "J"
                  ] }) })
                ] })
              ] }) }),
              G ? /* @__PURE__ */ f(Ne, { children: [
                /* @__PURE__ */ l(
                  Bt,
                  {
                    axis: "y",
                    onDrag: (e) => {
                      var n;
                      const t = (n = R.current) == null ? void 0 : n.getBoundingClientRect();
                      t && P(
                        Math.min(
                          Math.max(t.bottom - 22 - e, 80),
                          t.height - 160
                        )
                      );
                    }
                  }
                ),
                /* @__PURE__ */ f("section", { className: "wb-panel", style: { height: qe }, children: [
                  /* @__PURE__ */ f("div", { className: "wb-panel-header", children: [
                    /* @__PURE__ */ f("span", { className: "wb-panel-tab", children: [
                      "Problems",
                      E.length ? /* @__PURE__ */ l("span", { className: "wb-count", children: E.length }) : null
                    ] }),
                    /* @__PURE__ */ l("span", { style: { flex: 1 } }),
                    /* @__PURE__ */ l(
                      "button",
                      {
                        type: "button",
                        className: "wb-icon-button",
                        title: "Close Panel",
                        "aria-label": "Close panel",
                        onClick: () => te(!1),
                        children: /* @__PURE__ */ l(x, { name: "close" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ l("div", { className: "wb-panel-body", children: E.length ? Ut.map(([e, t]) => /* @__PURE__ */ f("div", { children: [
                    /* @__PURE__ */ f("div", { className: "wb-problem-file", children: [
                      /* @__PURE__ */ l("span", { className: "wb-file-icon", children: e ? Fe(e) : /* @__PURE__ */ l(x, { name: "project" }) }),
                      /* @__PURE__ */ l("span", { children: e ? O(e) : "Project" }),
                      /* @__PURE__ */ l("span", { className: "wb-quickopen-dir", children: e }),
                      /* @__PURE__ */ l("span", { className: "wb-count", children: t.length })
                    ] }),
                    t.map((n, s) => {
                      const b = n.severity ?? "error";
                      return /* @__PURE__ */ f(
                        "button",
                        {
                          type: "button",
                          className: "wb-problem",
                          disabled: !e || !H.has(e),
                          onClick: () => z(e, {
                            line: n.line ?? 1,
                            column: n.column
                          }),
                          children: [
                            /* @__PURE__ */ l(
                              x,
                              {
                                name: cn[b],
                                className: `wb-severity-${b}`
                              }
                            ),
                            /* @__PURE__ */ l("span", { className: "wb-problem-message", children: n.message }),
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
                  ] }, e || "(project)")) : /* @__PURE__ */ l("div", { className: "wb-empty", children: "No problems have been detected." }) })
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
                  onClick: () => te((e) => !e),
                  children: [
                    /* @__PURE__ */ l(x, { name: "error" }),
                    kt.error,
                    /* @__PURE__ */ l(x, { name: "warning" }),
                    kt.warning
                  ]
                }
              ),
              ct ? /* @__PURE__ */ l("span", { className: "wb-status-item", "data-kind": "error", role: "alert", children: ct }) : At ? /* @__PURE__ */ f("span", { className: "wb-status-item", children: [
                /* @__PURE__ */ l(x, { name: "sync" }),
                " Saving…"
              ] }) : Se.size ? /* @__PURE__ */ f("span", { className: "wb-status-item", children: [
                Se.size,
                " unsaved"
              ] }) : null,
              o.statusLeft
            ] }),
            /* @__PURE__ */ f("div", { className: "wb-status-group", "data-side": "right", children: [
              o.statusRight,
              q && !q.binary ? /* @__PURE__ */ f(Ne, { children: [
                /* @__PURE__ */ f("span", { className: "wb-status-item", children: [
                  "Ln ",
                  ot.line,
                  ", Col ",
                  ot.column
                ] }),
                /* @__PURE__ */ l("span", { className: "wb-status-item", children: "Spaces: 2" }),
                /* @__PURE__ */ l("span", { className: "wb-status-item", children: "UTF-8" }),
                /* @__PURE__ */ l("span", { className: "wb-status-item", children: ft(q.path) })
              ] }) : null
            ] })
          ] }),
          De ? /* @__PURE__ */ l(
            Rt,
            {
              x: De.x,
              y: De.y,
              items: Xt(De.path),
              onClose: () => dt(null)
            }
          ) : null,
          ce !== null ? /* @__PURE__ */ l(
            on,
            {
              start: ce,
              commands: Vt(),
              files: h,
              recent: X,
              icon: (e) => Fe(e),
              onOpen: (e) => z(e.path),
              onClose: () => {
                ke(null), setTimeout(() => {
                  var e;
                  return (e = le.current) == null ? void 0 : e.focus();
                }, 0);
              }
            },
            ce
          ) : null
        ]
      }
    );
  }
);
export {
  x as Icon,
  mn as Workbench,
  rn as defaultFileIcon,
  nn as guessLanguage
};
