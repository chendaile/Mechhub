import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
    plugins: [tailwindcss(), react()],
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        alias: {
            "@hook": path.resolve(__dirname, "src/hook"),
            "@view": path.resolve(__dirname, "src/view"),
            "@features": path.resolve(__dirname, "src/features"),
            "@components": path.resolve(__dirname, "src/components"),
        },
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
