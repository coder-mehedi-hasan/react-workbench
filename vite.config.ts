import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// `vite` serves the demo (index.html); `vite build` builds the library.
export default defineConfig({
  plugins: [react()],
  server: { port: 5199 },
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index",
      cssFileName: "react-workbench",
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "monaco-editor",
        "@monaco-editor/react",
      ],
    },
  },
});
