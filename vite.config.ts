import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [tailwindcss(), react()],
    resolve: {
        alias: {
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@views": path.resolve(__dirname, "src/views"),
            "@app": path.resolve(__dirname, "src"),
            react: path.resolve(__dirname, "node_modules/react"),
            "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
        },
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        preserveSymlinks: true,
    },
    build: {
        target: "esnext",
        outDir: "build",
    },
    server: {
        fs: {
            strict: false,
        },
    },
});
