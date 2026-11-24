import { jsx as a, jsxs as d, Fragment as ge } from "react/jsx-runtime";
import Yt from "@monaco-editor/react";
import { useRef as R, useState as x, useEffect as z, useMemo as V, forwardRef as Vt, useCallback as Y, useImperativeHandle as Gt } from "react";
const E = (r) => r.split("/").pop() ?? r, _ = (r) => r.includes("/") ? r.slice(0, r.lastIndexOf("/")) : "", Xt = {
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
function Ht(r) {
  var m;
  const o = ((m = E(r).split(".").pop()) == null ? void 0 : m.toLowerCase()) ?? "";
  return Xt[o] ?? "plaintext";
}
function _t(r, o = []) {
  const m = { path: "", name: "", children: [] }, h = /* @__PURE__ */ new Map([["", m]]), b = (c) => {
    let w = m;
    return c.forEach((i, p) => {
      const k = c.slice(0, p + 1).join("/");
      let P = h.get(k);
      P || (P = { path: k, name: i, children: [] }, h.set(k, P), w.children.push(P)), w = P;
    }), w;
  };
  for (const c of o)
    b(c.split("/").filter(Boolean));
  for (const c of r) {
    const w = c.path.split("/").filter(Boolean), i = w.pop();
    i && b(w).children.push({ path: c.path, name: i, file: c });
  }
  const N = (c) => {
    var w, i;
    (w = c.children) == null || w.sort(
      (p, k) => +!p.children - +!k.children || p.name.localeCompare(k.name)
    ), (i = c.children) == null || i.forEach(N);
  };
  return N(m), m.children;
}
function Qt(r, o) {
  if (!r) return 0;
  const m = r.toLowerCase(), h = o.toLowerCase();
  let b = 0, N = 0, c = -1;
  for (const w of m) {
    const i = h.indexOf(w, N);
    if (i === -1) return null;
    b += i === c + 1 ? 3 : 1, i >= h.lastIndexOf("/") + 1 && (b += 2), c = i, N = i + 1;
  }
  return b - h.length / 100;
}
function Pt(r) {
  const o = /* @__PURE__ */ new Set();
  for (const m of r) {
    const h = m.split("/").filter(Boolean).slice(0, -1);
    h.forEach((b, N) => o.add(h.slice(0, N + 1).join("/")));
  }
  return o;
}
function v({ name: r, className: o }) {
  return /* @__PURE__ */ a(
    "span",
    {
      "aria-hidden": !0,
      className: `codicon codicon-${r}${o ? ` ${o}` : ""}`
    }
  );
}
const Jt = {
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
function Zt(r, o) {
  var h;
  if (o.folder)
    return /* @__PURE__ */ a(v, { name: o.open ? "folder-opened" : "folder" });
  const m = ((h = E(r).split(".").pop()) == null ? void 0 : h.toLowerCase()) ?? "";
  return /* @__PURE__ */ a(v, { name: Jt[m] ?? "file-code" });
}
function Re(r) {
  const o = [];
  for (const m of r)
    m && (m === "separator" && (!o.length || o[o.length - 1] === "separator") || o.push(m));
  for (; o[o.length - 1] === "separator"; ) o.pop();
  return o;
}
function $t({
  x: r,
  y: o,
  items: m,
  onClose: h
}) {
  const b = R(null), [N, c] = x({ left: r, top: o });
  z(() => {
    var k;
    const i = b.current;
    if (i) {
      const P = i.getBoundingClientRect();
      c({
        left: Math.max(4, Math.min(r, window.innerWidth - P.width - 4)),
        top: Math.max(4, Math.min(o, window.innerHeight - P.height - 4))
      }), (k = i.querySelector("button:not(:disabled)")) == null || k.focus();
    }
    const p = () => h();
    return window.addEventListener("pointerdown", p), window.addEventListener("blur", p), window.addEventListener("resize", p), () => {
      window.removeEventListener("pointerdown", p), window.removeEventListener("blur", p), window.removeEventListener("resize", p);
    };
  }, [r, o, h]);
  const w = (i) => {
    var P, f;
    const p = [
      ...((P = b.current) == null ? void 0 : P.querySelectorAll("button:not(:disabled)")) ?? []
    ], k = p.indexOf(document.activeElement);
    (f = p[(k + i + p.length) % p.length]) == null || f.focus();
  };
  return /* @__PURE__ */ a(
    "div",
    {
      ref: b,
      className: "wb-menu",
      role: "menu",
      style: N,
      onPointerDown: (i) => i.stopPropagation(),
      onContextMenu: (i) => i.preventDefault(),
      onKeyDown: (i) => {
        i.stopPropagation(), i.key === "Escape" && h(), i.key === "ArrowDown" && (i.preventDefault(), w(1)), i.key === "ArrowUp" && (i.preventDefault(), w(-1));
      },
      children: m.map(
        (i, p) => i === "separator" ? /* @__PURE__ */ a("div", { className: "wb-menu-separator", role: "separator" }, p) : /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            role: "menuitem",
            className: "wb-menu-item",
            disabled: i.disabled,
            onClick: () => {
              h(), i.run();
            },
            children: [
              /* @__PURE__ */ a("span", { children: i.label }),
              i.keys ? /* @__PURE__ */ a("span", { className: "wb-menu-keys", children: i.keys }) : null
            ]
          },
          i.label
        )
      )
    }
  );
}
const Be = "application/x-workbench-path", tt = "\0root";
function Mt({
  initial: r,
  onSubmit: o,
  onCancel: m
}) {
  const h = R(null), b = R(!1);
  z(() => {
    const c = h.current;
    if (!c) return;
    c.focus();
    const w = r.lastIndexOf(".");
    c.setSelectionRange(0, w > 0 ? w : r.length);
  }, [r]);
  const N = (c) => {
    if (b.current) return;
    b.current = !0;
    const w = c == null ? void 0 : c.trim().replace(/^\/+|\/+$/g, "");
    w && w !== r ? o(w) : m();
  };
  return /* @__PURE__ */ a(
    "input",
    {
      ref: h,
      className: "wb-tree-input",
      defaultValue: r,
      spellCheck: !1,
      onClick: (c) => c.stopPropagation(),
      onContextMenu: (c) => c.stopPropagation(),
      onBlur: (c) => N(c.target.value),
      onKeyDown: (c) => {
        c.stopPropagation(), c.key === "Enter" && N(c.currentTarget.value), c.key === "Escape" && N(null);
      }
    }
  );
}
function en(r) {
  const { files: o, edit: m, collapsed: h } = r, b = V(
    () => _t(o, r.emptyFolders),
    [o, r.emptyFolders]
  ), [N, c] = x(null), [w, i] = x(null);
  z(() => c(null), [r.activePath]);
  const [p, k] = x(null), P = R(void 0), f = (l) => {
    const y = [...l.dataTransfer.types];
    return y.includes(Be) ? r.canMove : y.includes("Files") && r.canUpload;
  }, M = (l, y) => {
    if (!f(l)) return;
    l.preventDefault(), l.stopPropagation(), l.dataTransfer.dropEffect = l.dataTransfer.types.includes(Be) ? "move" : "copy";
    const u = y || tt;
    u !== p && (k(u), clearTimeout(P.current), y && h.has(y) && (P.current = setTimeout(() => r.onToggle(y), 600)));
  }, B = () => {
    clearTimeout(P.current), k(null);
  }, O = (l, y) => {
    if (!f(l)) return;
    l.preventDefault(), l.stopPropagation(), B();
    const u = l.dataTransfer.getData(Be);
    if (u) {
      const j = y ? `${y}/${E(u)}` : E(u);
      j !== u && r.onMove(u, j);
      return;
    }
    const D = [...l.dataTransfer.files];
    D.length && r.onDropFiles(D, y);
  }, K = [], J = (l, y) => {
    for (const u of l)
      K.push({ node: u, depth: y }), u.children && !h.has(u.path) && J(u.children, y + 1);
  };
  J(b, 0);
  const Z = (l) => {
    c(l.path), r.onFocus({ path: l.path, folder: !!l.children });
  }, ne = (l, y) => {
    y && h.has(y) && r.onToggle(y), r.onEdit({ kind: "create", type: l, folder: y });
  }, ae = (l, y) => {
    if ((m == null ? void 0 : m.kind) !== "create" || m.folder !== l) return null;
    const { type: u } = m;
    return /* @__PURE__ */ d(
      "div",
      {
        className: "wb-tree-row",
        style: { paddingLeft: 8 + y * 8 },
        children: [
          /* @__PURE__ */ a("span", { className: "wb-twistie", children: u === "folder" ? /* @__PURE__ */ a(v, { name: "chevron-right" }) : null }),
          /* @__PURE__ */ a("span", { className: "wb-file-icon", children: /* @__PURE__ */ a(v, { name: u === "folder" ? "folder" : "file" }) }),
          /* @__PURE__ */ a(
            Mt,
            {
              initial: "",
              onCancel: () => r.onEdit(null),
              onSubmit: (D) => r.onSubmitEdit(m, l ? `${l}/${D}` : D)
            }
          )
        ]
      },
      `create:${l}`
    );
  }, T = N ?? r.activePath;
  return /* @__PURE__ */ d(
    "div",
    {
      className: "wb-tree",
      role: "tree",
      tabIndex: 0,
      onKeyDown: (l) => {
        const y = K.findIndex(({ node: D }) => D.path === T), u = K[y];
        if (l.key === "ArrowDown" || l.key === "ArrowUp") {
          l.preventDefault();
          const D = K[y + (l.key === "ArrowDown" ? 1 : -1)] ?? K[0];
          D && Z(D.node);
        } else if (l.key === "ArrowRight" && (u != null && u.node.children))
          l.preventDefault(), h.has(u.node.path) && r.onToggle(u.node.path);
        else if (l.key === "ArrowLeft" && u)
          if (l.preventDefault(), u.node.children && !h.has(u.node.path))
            r.onToggle(u.node.path);
          else {
            const D = K.find(({ node: j }) => j.path === _(u.node.path));
            D && Z(D.node);
          }
        else if (l.key === "Enter" && u)
          l.preventDefault(), u.node.file ? r.onOpen(u.node.file) : r.onToggle(u.node.path);
        else if (l.key === "F2" && u)
          r.onShortcut("rename", u.node);
        else if ((l.key === "Delete" || l.key === "Backspace" && l.metaKey) && u)
          r.onShortcut("delete", u.node);
        else if ((l.metaKey || l.ctrlKey) && u) {
          const D = { c: "copy", x: "cut", v: "paste" }[l.key.toLowerCase()];
          D && (l.preventDefault(), r.onShortcut(D, u.node));
        }
      },
      onContextMenu: (l) => {
        l.preventDefault(), c(null), r.onFocus(null), r.menuFor(null).length && i({ x: l.clientX, y: l.clientY, node: null });
      },
      "data-drop": p === tt,
      onDragOver: (l) => M(l, ""),
      onDragLeave: (l) => {
        l.currentTarget.contains(l.relatedTarget) || B();
      },
      onDrop: (l) => O(l, ""),
      onClick: (l) => {
        l.target === l.currentTarget && (c(null), r.onFocus(null));
      },
      children: [
        ae("", 0),
        !K.length && !m ? /* @__PURE__ */ a("div", { className: "wb-empty", children: "No files yet." }) : null,
        K.map(({ node: l, depth: y }) => {
          const u = !!l.children, D = u && !h.has(l.path), j = (m == null ? void 0 : m.kind) === "rename" && m.path === l.path, Ne = !u && r.dirtyPaths.has(l.path), Ie = u ? void 0 : r.problemOf(l.path);
          return /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ d(
              "div",
              {
                role: "treeitem",
                "aria-selected": l.path === T,
                "aria-expanded": u ? D : void 0,
                className: "wb-tree-row",
                "data-dirty": Ne,
                "data-problem": Ie,
                "data-cut": l.path === r.cutPath,
                "data-drop": p !== null && p !== tt && (l.path === p || l.path.startsWith(`${p}/`)),
                title: l.path,
                style: { paddingLeft: 8 + y * 8 },
                draggable: !!l.file && r.canMove && !j,
                onDragStart: (C) => {
                  C.dataTransfer.setData(Be, l.path), C.dataTransfer.setData("text/plain", l.path), C.dataTransfer.effectAllowed = "move";
                },
                onDragEnd: B,
                onDragOver: (C) => M(C, u ? l.path : _(l.path)),
                onDrop: (C) => O(C, u ? l.path : _(l.path)),
                onClick: () => {
                  Z(l), l.file ? r.onOpen(l.file) : r.onToggle(l.path);
                },
                onContextMenu: (C) => {
                  C.preventDefault(), C.stopPropagation(), Z(l), r.menuFor(l).length && i({ x: C.clientX, y: C.clientY, node: l });
                },
                children: [
                  /* @__PURE__ */ a("span", { className: "wb-twistie", children: u ? /* @__PURE__ */ a(v, { name: D ? "chevron-down" : "chevron-right" }) : null }),
                  /* @__PURE__ */ a("span", { className: "wb-file-icon", children: r.icon(l.path, { folder: u, open: D }) }),
                  j ? /* @__PURE__ */ a(
                    Mt,
                    {
                      initial: l.name,
                      onCancel: () => r.onEdit(null),
                      onSubmit: (C) => {
                        const le = _(l.path);
                        r.onSubmitEdit(
                          { kind: "rename", path: l.path },
                          le ? `${le}/${C}` : C
                        );
                      }
                    }
                  ) : /* @__PURE__ */ d(ge, { children: [
                    /* @__PURE__ */ a("span", { className: "wb-tree-label", children: l.name }),
                    Ne ? /* @__PURE__ */ a("span", { className: "wb-tree-badge", children: "M" }) : null,
                    /* @__PURE__ */ d("span", { className: "wb-tree-actions", children: [
                      u && r.canCreateFile ? /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "New File…",
                          "aria-label": `New file in ${l.path}`,
                          onClick: (C) => {
                            C.stopPropagation(), ne("file", l.path);
                          },
                          children: /* @__PURE__ */ a(v, { name: "new-file" })
                        }
                      ) : null,
                      u && r.canCreateFolder ? /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "New Folder…",
                          "aria-label": `New folder in ${l.path}`,
                          onClick: (C) => {
                            C.stopPropagation(), ne("folder", l.path);
                          },
                          children: /* @__PURE__ */ a(v, { name: "new-folder" })
                        }
                      ) : null,
                      l.file && r.canRename ? /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "Rename… (F2)",
                          "aria-label": `Rename ${E(l.path)}`,
                          onClick: (C) => {
                            C.stopPropagation(), r.onEdit({ kind: "rename", path: l.path });
                          },
                          children: /* @__PURE__ */ a(v, { name: "edit" })
                        }
                      ) : null,
                      l.file && r.canDelete ? /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "Delete",
                          "aria-label": `Delete ${E(l.path)}`,
                          onClick: (C) => {
                            C.stopPropagation(), r.onDelete(l.file);
                          },
                          children: /* @__PURE__ */ a(v, { name: "trash" })
                        }
                      ) : null
                    ] })
                  ] })
                ]
              }
            ),
            D ? ae(l.path, y + 1) : null
          ] }, `${u ? "d" : "f"}:${l.path}`);
        }),
        w ? /* @__PURE__ */ a(
          $t,
          {
            x: w.x,
            y: w.y,
            items: r.menuFor(w.node),
            onClose: () => i(null)
          }
        ) : null
      ]
    }
  );
}
function tn({
  files: r,
  recent: o,
  icon: m,
  onOpen: h,
  onClose: b
}) {
  const [N, c] = x(""), [w, i] = x(0), p = R(null), k = V(() => {
    if (!N.trim()) {
      const f = new Map(o.map((M, B) => [M, B]));
      return [...r].sort(
        (M, B) => (f.get(M.path) ?? 1e9) - (f.get(B.path) ?? 1e9) || M.path.localeCompare(B.path)
      ).slice(0, 50);
    }
    return r.map((f) => ({ file: f, score: Qt(N.trim(), f.path) })).filter((f) => f.score !== null).sort((f, M) => M.score - f.score).slice(0, 50).map((f) => f.file);
  }, [r, N, o]);
  z(() => {
    var f, M;
    (M = (f = p.current) == null ? void 0 : f.querySelector('[aria-selected="true"]')) == null || M.scrollIntoView({ block: "nearest" });
  }, [w]);
  const P = (f) => {
    f && h(f), b();
  };
  return /* @__PURE__ */ a("div", { className: "wb-quickopen-backdrop", onMouseDown: b, children: /* @__PURE__ */ d(
    "div",
    {
      className: "wb-quickopen",
      role: "dialog",
      "aria-label": "Go to file",
      onMouseDown: (f) => f.stopPropagation(),
      children: [
        /* @__PURE__ */ a(
          "input",
          {
            autoFocus: !0,
            value: N,
            placeholder: "Search files by name",
            spellCheck: !1,
            onChange: (f) => {
              c(f.target.value), i(0);
            },
            onKeyDown: (f) => {
              f.key === "Escape" && (f.preventDefault(), b()), f.key === "Enter" && (f.preventDefault(), P(k[w])), f.key === "ArrowDown" && (f.preventDefault(), i((M) => Math.min(M + 1, k.length - 1))), f.key === "ArrowUp" && (f.preventDefault(), i((M) => Math.max(M - 1, 0)));
            }
          }
        ),
        /* @__PURE__ */ d("div", { className: "wb-quickopen-list", ref: p, role: "listbox", children: [
          k.map((f, M) => /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              role: "option",
              "aria-selected": M === w,
              className: "wb-quickopen-item",
              onMouseEnter: () => i(M),
              onClick: () => P(f),
              children: [
                /* @__PURE__ */ a("span", { className: "wb-file-icon", children: m(f.path) }),
                /* @__PURE__ */ a("span", { children: E(f.path) }),
                /* @__PURE__ */ a("span", { className: "wb-quickopen-dir", children: _(f.path) })
              ]
            },
            f.path
          )),
          k.length ? null : /* @__PURE__ */ a("div", { className: "wb-empty", children: "No matching files" })
        ] })
      ]
    }
  ) });
}
const je = "explorer", nn = {
  error: "error",
  warning: "warning",
  info: "info"
}, an = typeof navigator < "u" && /Mac|iPhone|iPad/.test(navigator.platform), H = an ? "⌘" : "Ctrl+";
function St({
  axis: r,
  onDrag: o
}) {
  const [m, h] = x(!1);
  return /* @__PURE__ */ a(
    "div",
    {
      className: `wb-sash wb-sash-${r}`,
      "data-dragging": m,
      role: "separator",
      "aria-orientation": r === "x" ? "vertical" : "horizontal",
      onPointerDown: (b) => {
        b.preventDefault(), b.currentTarget.setPointerCapture(b.pointerId), h(!0);
      },
      onPointerMove: (b) => {
        m && o(r === "x" ? b.clientX : b.clientY);
      },
      onPointerUp: (b) => {
        b.currentTarget.releasePointerCapture(b.pointerId), h(!1);
      }
    }
  );
}
const te = (r) => r instanceof Error ? r.message : String(r), on = Vt(
  function(o, m) {
    var xt, Dt;
    const {
      files: h,
      readFile: b,
      onSave: N,
      onCreate: c,
      onCreateFolder: w,
      onRefresh: i,
      onUpload: p,
      onRename: k,
      onDelete: P,
      onCopy: f,
      onRenameFolder: M,
      onDeleteFolder: B,
      problems: O = [],
      theme: K = "dark",
      readOnly: J = !1,
      modelScope: Z = "workbench"
    } = o, ne = R(null), ae = R(null), [T, nt] = x(null), [ye, l] = x(je), [y, u] = x(260), [D, j] = x(!1), [Ne, Ie] = x(200), [C, le] = x(!1), [W, Ae] = x([]), [$, qe] = x(null), [ie, re] = x({}), [Ft, se] = x(/* @__PURE__ */ new Set()), [Et, ee] = x(null), [Ke, ke] = x(/* @__PURE__ */ new Set()), [at, lt] = x(!1), ze = R(null), [rt, st] = x({ line: 1, column: 1 }), [ot, L] = x(null), [Ot, ve] = x(!1), I = R({ buffers: ie, activePath: $, openPaths: W, files: h });
    I.current = { buffers: ie, activePath: $, openPaths: W, files: h };
    const We = R(/* @__PURE__ */ new Set()), ce = R(/* @__PURE__ */ new Set()), Ue = R(null), Ye = R(null), Ve = R(/* @__PURE__ */ new Set()), [U, Ce] = x(null), [xe, it] = x(null), G = V(
      () => new Map(h.map((e) => [e.path, e])),
      [h]
    ), A = $ ? G.get($) ?? null : null, ue = V(
      () => Pt(h.map((e) => e.path)),
      [h]
    ), Ge = V(
      () => [.../* @__PURE__ */ new Set([...o.folders ?? [], ...Ke])],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [o.folders, Ke]
    );
    z(() => {
      ke((e) => {
        const t = [...e].filter((n) => !ue.has(n));
        return t.length === e.size ? e : new Set(t);
      });
    }, [ue]);
    const oe = $ ? ie[$] : void 0, de = V(
      () => Object.entries(ie).filter(([, e]) => e.text !== e.saved).map(([e]) => e),
      [ie]
    ), fe = V(() => new Set(de), [de]), { onActiveFileChange: De, onDirtyChange: Pe } = o;
    z(() => {
      De == null || De($), st({ line: 1, column: 1 });
    }, [$, De]);
    const Xe = de.join(`
`);
    z(
      () => Pe == null ? void 0 : Pe(Xe ? Xe.split(`
`) : []),
      [Xe, Pe]
    );
    const ct = Y(
      (e) => {
        var t;
        return ((t = o.language) == null ? void 0 : t.call(o, e)) ?? Ht(e);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [o.language]
    ), Me = Y(
      (e, t = { folder: !1, open: !1 }) => {
        var n;
        return ((n = o.fileIcon) == null ? void 0 : n.call(o, e, t)) ?? Zt(e, t);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [o.fileIcon]
    ), he = Y(
      (e) => `file:///${Z}/${e}`,
      [Z]
    ), Se = Y(
      (e) => {
        We.current.has(e) || (We.current.add(e), b(e).then(
          (t) => re((n) => ({
            ...n,
            [e]: { text: t, saved: t }
          }))
        ).catch((t) => {
          I.current.files.some((n) => n.path === e) && L(`Couldn't open ${e}: ${te(t)}`);
        }).finally(() => We.current.delete(e)));
      },
      [b]
    ), q = Y(
      (e, t) => {
        const n = I.current.files.find((s) => s.path === e);
        if (!n) {
          Ye.current = e;
          return;
        }
        L(null), Ae(
          (s) => s.includes(e) ? s : [...s, e]
        ), qe(e), t && (Ue.current = {
          path: e,
          line: t.line,
          column: t.column ?? 1
        }), !n.binary && !I.current.buffers[e] && Se(e);
      },
      [Se]
    ), me = Y(
      (e) => {
        var t;
        (t = T == null ? void 0 : T.editor.getModel(T.Uri.parse(he(e)))) == null || t.dispose();
      },
      [T, he]
    ), be = Y(
      (e) => {
        if (!e.length) return;
        const t = new Set(e);
        Ae((n) => {
          const s = n.filter((g) => !t.has(g));
          return qe((g) => {
            if (!g || !t.has(g)) return g;
            const S = n.indexOf(g);
            return s[Math.min(S, s.length - 1)] ?? null;
          }), s;
        }), re((n) => {
          const s = { ...n };
          for (const g of e) delete s[g];
          return s;
        }), e.forEach(me);
      },
      [me]
    ), ut = (e) => {
      fe.has(e) && !window.confirm(
        `Close ${E(e)} without saving? Your changes will be lost.`
      ) || be([e]);
    };
    z(() => {
      be(
        I.current.openPaths.filter(
          (t) => !G.has(t) && !Ve.current.has(t)
        )
      );
      const e = Ye.current;
      e && G.has(e) && (Ye.current = null, q(e));
    }, [G, be, q]);
    const we = Y(
      async (e = I.current.activePath) => {
        const t = e ? I.current.buffers[e] : void 0;
        if (!e || !t || !N || J || t.text === t.saved || ce.current.has(e))
          return !1;
        const n = t.text;
        ce.current.add(e), ve(!0), L(null);
        try {
          return await N(e, n), re(
            (s) => s[e] ? { ...s, [e]: { ...s[e], saved: n } } : s
          ), !0;
        } catch (s) {
          return L(`Couldn't save ${E(e)}: ${te(s)}`), !1;
        } finally {
          ce.current.delete(e), ve(ce.current.size > 0);
        }
      },
      [N, J]
    ), He = Y(async () => (await Promise.all(
      Object.keys(I.current.buffers).map((t) => {
        const n = I.current.buffers[t];
        return n.text === n.saved ? !0 : we(t);
      })
    )).every(Boolean), [we]), dt = Y(
      (e) => {
        var n;
        const t = e ? [e] : I.current.openPaths;
        re((s) => {
          const g = { ...s };
          for (const S of t) delete g[S];
          return g;
        });
        for (const s of t)
          me(s), (n = G.get(s)) != null && n.binary || Se(s);
      },
      [me, G, Se]
    );
    Gt(
      m,
      () => ({
        open: q,
        save: () => we(),
        saveAll: He,
        reload: dt,
        dirtyPaths: () => Object.entries(I.current.buffers).filter(([, e]) => e.text !== e.saved).map(([e]) => e)
      }),
      [q, dt, we, He]
    );
    const $e = (e) => ue.has(e) || Ge.includes(e), Fe = (e) => G.has(e) || $e(e), Tt = (e) => {
      Ae((t) => t.map((n) => e.get(n) ?? n)), qe((t) => t && (e.get(t) ?? t)), re((t) => {
        const n = {};
        for (const [s, g] of Object.entries(t))
          n[e.get(s) ?? s] = g;
        return n;
      });
      for (const t of e.keys()) me(t);
    }, ft = async (e, t) => {
      const n = /* @__PURE__ */ new Map();
      if ($e(e))
        for (const s of h)
          s.path.startsWith(`${e}/`) && n.set(s.path, `${t}${s.path.slice(e.length)}`);
      else
        n.set(e, t);
      for (const s of n.keys()) Ve.current.add(s);
      try {
        if (!$e(e)) await (k == null ? void 0 : k(e, t));
        else if (M) await M(e, t);
        else
          for (const [s, g] of n) await (k == null ? void 0 : k(s, g));
        Tt(n), ke((s) => {
          const g = /* @__PURE__ */ new Set();
          for (const S of s)
            g.add(
              S === e || S.startsWith(`${e}/`) ? `${t}${S.slice(e.length)}` : S
            );
          return g;
        });
      } finally {
        for (const s of n.keys()) Ve.current.delete(s);
      }
    }, ht = async (e, t) => {
      if (ee(null), L(null), Fe(t)) {
        L(`${t} already exists`);
        return;
      }
      try {
        e.kind === "create" && e.type === "folder" ? (w ? await w(t) : ke((n) => new Set(n).add(t)), se((n) => {
          const s = new Set(n);
          return s.delete(t), s;
        }), ze.current = { path: t, folder: !0 }) : e.kind === "create" ? (await (c == null ? void 0 : c(t)), q(t)) : await ft(e.path, t);
      } catch (n) {
        L(te(n));
      }
    }, Lt = (e, t) => {
      const n = (F) => e ? `${e}/${F}` : F;
      if (!Fe(n(t))) return n(t);
      const s = t.lastIndexOf("."), g = s > 0 ? t.slice(0, s) : t, S = s > 0 ? t.slice(s) : "";
      for (let F = 1; ; F++) {
        const Le = `${g} copy${F > 1 ? ` ${F}` : ""}${S}`;
        if (!Fe(n(Le))) return n(Le);
      }
    }, mt = async (e) => {
      var s, g;
      if (!U) return;
      const { path: t, mode: n } = U;
      L(null);
      try {
        if (n === "cut") {
          Ce(null);
          const F = e ? `${e}/${E(t)}` : E(t);
          if (F === t) return;
          if (Fe(F)) throw new Error(`${F} already exists`);
          await ft(t, F);
          return;
        }
        const S = Lt(e, E(t));
        if (f)
          await f(t, S);
        else {
          if ((s = G.get(t)) != null && s.binary || !c)
            throw new Error(`${E(t)} can't be copied here`);
          {
            const F = ((g = I.current.buffers[t]) == null ? void 0 : g.saved) ?? await b(t);
            await c(S), F && await (N == null ? void 0 : N(S, F));
          }
        }
        q(S);
      } catch (S) {
        L(te(S));
      }
    }, Rt = () => {
      const e = ze.current;
      return e ? e.folder ? e.path : _(e.path) : $ ? _($) : "";
    }, bt = (e) => {
      const t = Rt();
      se((n) => {
        if (!t || !n.has(t)) return n;
        const s = new Set(n);
        return s.delete(t), s;
      }), ee({ kind: "create", type: e, folder: t });
    }, Bt = async (e, t) => {
      L(null), ve(!0);
      try {
        for (const n of e)
          await (p == null ? void 0 : p(n, t ? `${t}/${n.name}` : n.name));
      } catch (n) {
        L(te(n));
      } finally {
        ve(ce.current.size > 0);
      }
    }, wt = async () => {
      if (!(!i || at)) {
        lt(!0), L(null);
        try {
          await i();
        } catch (e) {
          L(te(e));
        } finally {
          lt(!1);
        }
      }
    }, Ee = async (e) => {
      L(null);
      try {
        $e(e) ? B && await B(e) : await (P == null ? void 0 : P(e)), ke((t) => {
          const n = [...t].filter(
            (s) => s !== e && !s.startsWith(`${e}/`)
          );
          return n.length === t.size ? t : new Set(n);
        });
      } catch (t) {
        L(te(t));
      }
    }, pt = V(() => {
      const e = /* @__PURE__ */ new Map();
      for (const t of O) {
        if (!t.path || t.severity === "info") continue;
        const n = t.severity === "warning" ? "warning" : "error";
        e.get(t.path) !== "error" && e.set(t.path, n);
      }
      return e;
    }, [O]), gt = V(() => {
      const e = { error: 0, warning: 0, info: 0 };
      for (const t of O) e[t.severity ?? "error"]++;
      return e;
    }, [O]), jt = V(() => {
      const e = /* @__PURE__ */ new Map();
      for (const t of O) {
        const n = t.path ?? "";
        e.set(n, [...e.get(n) ?? [], t]);
      }
      return [...e];
    }, [O]);
    z(() => {
      if (!T || !$ || !oe) return;
      const e = T.editor.getModel(T.Uri.parse(he($)));
      e && T.editor.setModelMarkers(
        e,
        "workbench",
        O.filter((t) => t.path === $).map((t) => {
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
    }, [T, $, oe, O, he]), z(() => {
      const e = Ue.current, t = ae.current;
      if (!e || !t || e.path !== $ || !oe)
        return;
      const n = setTimeout(() => {
        Ue.current = null, t.revealLineInCenter(e.line), t.setPosition({ lineNumber: e.line, column: e.column }), t.focus();
      }, 0);
      return () => clearTimeout(n);
    }, [$, oe]);
    const It = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
      const t = e.key.toLowerCase();
      t === "s" ? (e.preventDefault(), e.stopPropagation(), e.shiftKey ? He() : we()) : t === "p" && !e.shiftKey ? (e.preventDefault(), e.stopPropagation(), le(!0)) : t === "b" ? (e.preventDefault(), l((n) => n ? null : je)) : t === "j" && (e.preventDefault(), j((n) => !n));
    }, _e = de.length > 0;
    z(() => {
      if (!_e) return;
      const e = (t) => t.preventDefault();
      return window.addEventListener("beforeunload", e), () => window.removeEventListener("beforeunload", e);
    }, [_e]);
    const X = !J, Qe = !!c && X, Je = !!(w || c) && X, Q = !!k && X, yt = !!(M || k) && X, Ze = !!P && X, Oe = !!(f || c) && X, Nt = X && !!U && ((U == null ? void 0 : U.mode) === "cut" ? Q : Oe), kt = (e) => X && (!!B || Ke.has(e) && !ue.has(e)), vt = (e, t) => {
      se((n) => {
        if (!t || !n.has(t)) return n;
        const s = new Set(n);
        return s.delete(t), s;
      }), ee({ kind: "create", type: e, folder: t });
    }, et = (e) => {
      var t;
      return void ((t = navigator.clipboard) == null ? void 0 : t.writeText(e));
    }, Ct = () => se(/* @__PURE__ */ new Set([...ue, ...Ge])), At = (e) => {
      const t = !!(e != null && e.children), n = e ? t ? e.path : _(e.path) : "", s = [];
      Qe && s.push({ label: "New File…", run: () => vt("file", n) }), Je && s.push({
        label: "New Folder…",
        run: () => vt("folder", n)
      });
      const g = Q || Oe ? {
        label: "Paste",
        keys: `${H}V`,
        disabled: !Nt,
        run: () => void mt(n)
      } : null;
      return Re(e ? t ? [
        ...s,
        "separator",
        g,
        "separator",
        { label: "Copy Path", run: () => et(e.path) },
        "separator",
        yt ? {
          label: "Rename…",
          keys: "F2",
          run: () => ee({ kind: "rename", path: e.path })
        } : null,
        kt(e.path) ? { label: "Delete", keys: "Del", run: () => void Ee(e.path) } : null
      ] : [
        { label: "Open", run: () => q(e.path) },
        "separator",
        Q ? {
          label: "Cut",
          keys: `${H}X`,
          run: () => Ce({ path: e.path, mode: "cut" })
        } : null,
        Oe ? {
          label: "Copy",
          keys: `${H}C`,
          run: () => Ce({ path: e.path, mode: "copy" })
        } : null,
        g,
        "separator",
        { label: "Copy Path", run: () => et(e.path) },
        "separator",
        Q ? {
          label: "Rename…",
          keys: "F2",
          run: () => ee({ kind: "rename", path: e.path })
        } : null,
        Ze ? { label: "Delete", keys: "Del", run: () => void Ee(e.path) } : null
      ] : [
        ...s,
        "separator",
        g,
        "separator",
        i ? { label: "Refresh Explorer", run: () => void wt() } : null,
        { label: "Collapse Folders", run: Ct }
      ]);
    }, qt = (e, t) => {
      const n = !!t.children;
      e === "paste" ? Nt && mt(n ? t.path : _(t.path)) : e === "rename" ? (n ? yt : Q) && ee({ kind: "rename", path: t.path }) : e === "delete" ? (n ? kt(t.path) : Ze) && Ee(t.path) : !n && (e === "cut" ? Q : Oe) && Ce({ path: t.path, mode: e });
    }, Te = (e) => {
      const t = e.filter((n) => fe.has(n));
      t.length && !window.confirm(
        t.length === 1 ? `Close ${E(t[0])} without saving? Your changes will be lost.` : `Close ${t.length} files without saving? Your changes will be lost.`
      ) || be(e);
    }, Kt = (e) => {
      const t = W.indexOf(e), n = W.filter((S) => S !== e), s = W.slice(t + 1), g = W.filter((S) => !fe.has(S));
      return Re([
        { label: "Close", run: () => Te([e]) },
        {
          label: "Close Others",
          disabled: !n.length,
          run: () => Te(n)
        },
        {
          label: "Close to the Right",
          disabled: !s.length,
          run: () => Te(s)
        },
        { label: "Close Saved", disabled: !g.length, run: () => be(g) },
        { label: "Close All", run: () => Te(W) },
        "separator",
        { label: "Copy Path", run: () => et(e) },
        {
          label: "Reveal in Explorer",
          run: () => {
            l(je), se((S) => {
              const F = new Set(S);
              for (const Le of Pt([e])) F.delete(Le);
              return F;
            }), q(e);
          }
        }
      ]);
    }, zt = [
      { id: je, icon: "files", title: "Explorer", badge: void 0 },
      ...o.activities ?? []
    ], pe = (xt = o.activities) == null ? void 0 : xt.find(
      (e) => e.id === ye
    ), Wt = (e) => se((t) => {
      const n = new Set(t);
      return n.delete(e) || n.add(e), n;
    }), Ut = J || !N || !!(A != null && A.readOnly);
    return /* @__PURE__ */ d(
      "div",
      {
        ref: ne,
        className: `wb${o.className ? ` ${o.className}` : ""}`,
        "data-theme": K,
        style: o.style,
        onKeyDownCapture: It,
        children: [
          /* @__PURE__ */ d("header", { className: "wb-titlebar", children: [
            /* @__PURE__ */ a("div", { className: "wb-titlebar-title", children: /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                className: "wb-command-center",
                title: `Go to File (${H}P)`,
                onClick: () => le(!0),
                children: [
                  /* @__PURE__ */ a(v, { name: "search" }),
                  /* @__PURE__ */ a("span", { children: o.title ?? "Search files" })
                ]
              }
            ) }),
            /* @__PURE__ */ a("div", { className: "wb-titlebar-actions", children: o.actions })
          ] }),
          /* @__PURE__ */ d("div", { className: "wb-body", children: [
            /* @__PURE__ */ d("nav", { className: "wb-activitybar", "aria-label": "Views", children: [
              zt.map((e) => /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  className: "wb-activity",
                  title: e.title,
                  "aria-label": e.title,
                  "aria-pressed": ye === e.id,
                  onClick: () => l((t) => t === e.id ? null : e.id),
                  children: [
                    /* @__PURE__ */ a(v, { name: e.icon }),
                    e.badge !== void 0 && e.badge !== null ? /* @__PURE__ */ a("span", { className: "wb-activity-badge", children: e.badge }) : null
                  ]
                },
                e.id
              )),
              /* @__PURE__ */ a("div", { className: "wb-activity-spacer" }),
              /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  className: "wb-activity",
                  title: `Problems (${H}J)`,
                  "aria-label": "Problems",
                  "aria-pressed": D,
                  onClick: () => j((e) => !e),
                  children: [
                    /* @__PURE__ */ a(v, { name: "warning" }),
                    O.length ? /* @__PURE__ */ a("span", { className: "wb-activity-badge", children: O.length }) : null
                  ]
                }
              )
            ] }),
            ye ? /* @__PURE__ */ d(ge, { children: [
              /* @__PURE__ */ d("aside", { className: "wb-sidebar", style: { width: y }, children: [
                /* @__PURE__ */ a("div", { className: "wb-sidebar-title", children: /* @__PURE__ */ a("span", { children: (pe == null ? void 0 : pe.title) ?? "Explorer" }) }),
                pe ? /* @__PURE__ */ a("div", { className: "wb-sidebar-body", children: pe.render() }) : /* @__PURE__ */ d(ge, { children: [
                  /* @__PURE__ */ d("div", { className: "wb-section-header", children: [
                    /* @__PURE__ */ a(v, { name: "chevron-down" }),
                    /* @__PURE__ */ a("span", { className: "wb-grow", children: o.explorerTitle ?? (typeof o.title == "string" ? o.title : "Files") }),
                    /* @__PURE__ */ d("span", { className: "wb-section-actions", children: [
                      Qe ? /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "New File…",
                          "aria-label": "New file",
                          onClick: () => bt("file"),
                          children: /* @__PURE__ */ a(v, { name: "new-file" })
                        }
                      ) : null,
                      Je ? /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "New Folder…",
                          "aria-label": "New folder",
                          onClick: () => bt("folder"),
                          children: /* @__PURE__ */ a(v, { name: "new-folder" })
                        }
                      ) : null,
                      i ? /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "Refresh Explorer",
                          "aria-label": "Refresh explorer",
                          disabled: at,
                          onClick: () => void wt(),
                          children: /* @__PURE__ */ a(v, { name: "refresh" })
                        }
                      ) : null,
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "wb-icon-button",
                          title: "Collapse Folders",
                          "aria-label": "Collapse folders",
                          onClick: Ct,
                          children: /* @__PURE__ */ a(v, { name: "collapse-all" })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "wb-sidebar-body", children: /* @__PURE__ */ a(
                    en,
                    {
                      files: h,
                      emptyFolders: Ge,
                      menuFor: At,
                      cutPath: (U == null ? void 0 : U.mode) === "cut" ? U.path : null,
                      onShortcut: qt,
                      onFocus: (e) => {
                        ze.current = e;
                      },
                      activePath: $,
                      dirtyPaths: fe,
                      problemOf: (e) => pt.get(e),
                      icon: Me,
                      collapsed: Ft,
                      onToggle: Wt,
                      onOpen: (e) => q(e.path),
                      edit: Et,
                      onEdit: ee,
                      onSubmitEdit: (e, t) => void ht(e, t),
                      canMove: Q,
                      onMove: (e, t) => void ht({ kind: "rename", path: e }, t),
                      canUpload: !!p && X,
                      onDropFiles: (e, t) => void Bt(e, t),
                      canCreateFile: Qe,
                      canCreateFolder: Je,
                      canRename: Q,
                      canDelete: Ze,
                      onDelete: (e) => void Ee(e.path)
                    }
                  ) })
                ] })
              ] }),
              /* @__PURE__ */ a(
                St,
                {
                  axis: "x",
                  onDrag: (e) => {
                    var n;
                    const t = (((n = ne.current) == null ? void 0 : n.getBoundingClientRect().left) ?? 0) + 44;
                    u(Math.min(Math.max(e - t, 160), 640));
                  }
                }
              )
            ] }) : null,
            /* @__PURE__ */ d("main", { className: "wb-main", children: [
              W.length ? /* @__PURE__ */ a("div", { className: "wb-tabs", role: "tablist", children: W.map((e) => /* @__PURE__ */ d(
                "div",
                {
                  role: "tab",
                  "aria-selected": e === $,
                  className: "wb-tab",
                  "data-dirty": fe.has(e),
                  "data-problem": pt.get(e),
                  title: e,
                  onClick: () => q(e),
                  onAuxClick: (t) => {
                    t.button === 1 && ut(e);
                  },
                  onContextMenu: (t) => {
                    t.preventDefault(), it({ x: t.clientX, y: t.clientY, path: e });
                  },
                  children: [
                    /* @__PURE__ */ a("span", { className: "wb-file-icon", children: Me(e) }),
                    /* @__PURE__ */ a("span", { className: "wb-tab-label", children: E(e) }),
                    /* @__PURE__ */ d(
                      "button",
                      {
                        type: "button",
                        className: "wb-tab-close",
                        "aria-label": `Close ${E(e)}`,
                        onClick: (t) => {
                          t.stopPropagation(), ut(e);
                        },
                        children: [
                          /* @__PURE__ */ a("span", { className: "wb-dirty-dot" }),
                          /* @__PURE__ */ a(v, { name: "close", className: "wb-close-icon" })
                        ]
                      }
                    )
                  ]
                },
                e
              )) }) : null,
              $ ? /* @__PURE__ */ a("div", { className: "wb-breadcrumbs", children: $.split("/").map((e, t) => /* @__PURE__ */ d(
                "span",
                {
                  style: { display: "contents" },
                  children: [
                    t ? /* @__PURE__ */ a(v, { name: "chevron-right" }) : null,
                    /* @__PURE__ */ a("span", { children: e })
                  ]
                },
                `${t}:${e}`
              )) }) : null,
              /* @__PURE__ */ a("div", { className: "wb-editor", children: A ? A.binary ? /* @__PURE__ */ a("div", { className: "wb-binary", children: ((Dt = o.renderBinary) == null ? void 0 : Dt.call(o, A)) ?? "This file isn't text and can't be shown in the editor." }) : oe ? /* @__PURE__ */ a("div", { className: "wb-editor-fill", children: /* @__PURE__ */ a(
                Yt,
                {
                  path: he(A.path),
                  language: ct(A.path),
                  value: oe.text,
                  theme: K === "dark" ? "vs-dark" : "vs",
                  beforeMount: o.beforeMount,
                  onMount: (e, t) => {
                    var n;
                    ae.current = e, nt(t), e.onDidChangeCursorPosition(
                      (s) => st({
                        line: s.position.lineNumber,
                        column: s.position.column
                      })
                    ), (n = o.onMount) == null || n.call(o, e, t);
                  },
                  onChange: (e) => {
                    const t = A.path;
                    re(
                      (n) => n[t] ? {
                        ...n,
                        [t]: { ...n[t], text: e ?? "" }
                      } : n
                    );
                  },
                  options: {
                    readOnly: Ut,
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
              ) }) : /* @__PURE__ */ a("div", { className: "wb-welcome", children: "Loading…" }) : /* @__PURE__ */ d("div", { className: "wb-welcome", children: [
                /* @__PURE__ */ a(v, { name: "code" }),
                /* @__PURE__ */ d("dl", { children: [
                  /* @__PURE__ */ a("dt", { children: "Go to File" }),
                  /* @__PURE__ */ a("dd", { children: /* @__PURE__ */ d("span", { className: "wb-kbd", children: [
                    H,
                    "P"
                  ] }) }),
                  /* @__PURE__ */ a("dt", { children: "Save" }),
                  /* @__PURE__ */ a("dd", { children: /* @__PURE__ */ d("span", { className: "wb-kbd", children: [
                    H,
                    "S"
                  ] }) }),
                  /* @__PURE__ */ a("dt", { children: "Toggle Side Bar" }),
                  /* @__PURE__ */ a("dd", { children: /* @__PURE__ */ d("span", { className: "wb-kbd", children: [
                    H,
                    "B"
                  ] }) }),
                  /* @__PURE__ */ a("dt", { children: "Toggle Problems" }),
                  /* @__PURE__ */ a("dd", { children: /* @__PURE__ */ d("span", { className: "wb-kbd", children: [
                    H,
                    "J"
                  ] }) })
                ] })
              ] }) }),
              D ? /* @__PURE__ */ d(ge, { children: [
                /* @__PURE__ */ a(
                  St,
                  {
                    axis: "y",
                    onDrag: (e) => {
                      var n;
                      const t = (n = ne.current) == null ? void 0 : n.getBoundingClientRect();
                      t && Ie(
                        Math.min(
                          Math.max(t.bottom - 22 - e, 80),
                          t.height - 160
                        )
                      );
                    }
                  }
                ),
                /* @__PURE__ */ d("section", { className: "wb-panel", style: { height: Ne }, children: [
                  /* @__PURE__ */ d("div", { className: "wb-panel-header", children: [
                    /* @__PURE__ */ d("span", { className: "wb-panel-tab", children: [
                      "Problems",
                      O.length ? /* @__PURE__ */ a("span", { className: "wb-count", children: O.length }) : null
                    ] }),
                    /* @__PURE__ */ a("span", { style: { flex: 1 } }),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        className: "wb-icon-button",
                        title: "Close Panel",
                        "aria-label": "Close panel",
                        onClick: () => j(!1),
                        children: /* @__PURE__ */ a(v, { name: "close" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ a("div", { className: "wb-panel-body", children: O.length ? jt.map(([e, t]) => /* @__PURE__ */ d("div", { children: [
                    /* @__PURE__ */ d("div", { className: "wb-problem-file", children: [
                      /* @__PURE__ */ a("span", { className: "wb-file-icon", children: e ? Me(e) : /* @__PURE__ */ a(v, { name: "project" }) }),
                      /* @__PURE__ */ a("span", { children: e ? E(e) : "Project" }),
                      /* @__PURE__ */ a("span", { className: "wb-quickopen-dir", children: e }),
                      /* @__PURE__ */ a("span", { className: "wb-count", children: t.length })
                    ] }),
                    t.map((n, s) => {
                      const g = n.severity ?? "error";
                      return /* @__PURE__ */ d(
                        "button",
                        {
                          type: "button",
                          className: "wb-problem",
                          disabled: !e || !G.has(e),
                          onClick: () => q(e, {
                            line: n.line ?? 1,
                            column: n.column
                          }),
                          children: [
                            /* @__PURE__ */ a(
                              v,
                              {
                                name: nn[g],
                                className: `wb-severity-${g}`
                              }
                            ),
                            /* @__PURE__ */ a("span", { className: "wb-problem-message", children: n.message }),
                            n.line ? /* @__PURE__ */ d("span", { className: "wb-problem-position", children: [
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
          /* @__PURE__ */ d("footer", { className: "wb-statusbar", children: [
            /* @__PURE__ */ d("div", { className: "wb-status-group", children: [
              /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  className: "wb-status-item",
                  title: "Problems",
                  onClick: () => j((e) => !e),
                  children: [
                    /* @__PURE__ */ a(v, { name: "error" }),
                    gt.error,
                    /* @__PURE__ */ a(v, { name: "warning" }),
                    gt.warning
                  ]
                }
              ),
              ot ? /* @__PURE__ */ a("span", { className: "wb-status-item", "data-kind": "error", role: "alert", children: ot }) : Ot ? /* @__PURE__ */ d("span", { className: "wb-status-item", children: [
                /* @__PURE__ */ a(v, { name: "sync" }),
                " Saving…"
              ] }) : _e ? /* @__PURE__ */ d("span", { className: "wb-status-item", children: [
                de.length,
                " unsaved"
              ] }) : null,
              o.statusLeft
            ] }),
            /* @__PURE__ */ d("div", { className: "wb-status-group", "data-side": "right", children: [
              o.statusRight,
              A && !A.binary ? /* @__PURE__ */ d(ge, { children: [
                /* @__PURE__ */ d("span", { className: "wb-status-item", children: [
                  "Ln ",
                  rt.line,
                  ", Col ",
                  rt.column
                ] }),
                /* @__PURE__ */ a("span", { className: "wb-status-item", children: "Spaces: 2" }),
                /* @__PURE__ */ a("span", { className: "wb-status-item", children: "UTF-8" }),
                /* @__PURE__ */ a("span", { className: "wb-status-item", children: ct(A.path) })
              ] }) : null
            ] })
          ] }),
          xe ? /* @__PURE__ */ a(
            $t,
            {
              x: xe.x,
              y: xe.y,
              items: Kt(xe.path),
              onClose: () => it(null)
            }
          ) : null,
          C ? /* @__PURE__ */ a(
            tn,
            {
              files: h,
              recent: W,
              icon: (e) => Me(e),
              onOpen: (e) => q(e.path),
              onClose: () => {
                le(!1), setTimeout(() => {
                  var e;
                  return (e = ae.current) == null ? void 0 : e.focus();
                }, 0);
              }
            }
          ) : null
        ]
      }
    );
  }
);
export {
  v as Icon,
  on as Workbench,
  Zt as defaultFileIcon,
  Ht as guessLanguage
};
