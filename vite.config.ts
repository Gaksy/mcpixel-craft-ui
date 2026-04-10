import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import fs from "fs-extra";
import path from "path";

export default defineConfig({
    plugins: [
        vue(),
        dts({ insertTypesEntry: true }),

        {
            name: "copy-fonts",
            closeBundle() {
                const src = path.resolve(__dirname, "src/assets/fonts");
                const dest = path.resolve(__dirname, "dist/fonts");

                console.log("Copy fonts from:", src);

                if (fs.existsSync(src)) {
                    fs.copySync(src, dest, { overwrite: true });
                    console.log("Fonts copied!");
                } else {
                    console.warn("⚠ Font directory not found:", src);
                }
            },
        },
    ],

    build: {
        cssCodeSplit: true,
        assetsInlineLimit: 0,

        lib: {
            entry: "src/index.ts",
            name: "McpixelCraftUI",
            fileName: (format) => `mcpixel-craft-ui.${format}.js`,
        },

        rollupOptions: {
            external: ["vue"],
            output: {
                globals: {
                    vue: "Vue",
                },
            },
        },
    },
});