import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs-extra";
import path from "path";

export default defineConfig({
    plugins: [
        vue(),

        // ✅ 更稳定：关闭 rollupTypes（避免 api-extractor）
        // dts({
        //     entryRoot: "src",
        //     outDir: "dist/types",
        //     include: ["src/**/*.ts", "src/**/*.vue"],
        //     rollupTypes: true,
        //     copyDtsFiles: false
        // }),
        {
            name: "copy-types-to-dist",
            closeBundle() {
                const src = path.resolve(__dirname, "types");
                const dest = path.resolve(__dirname, "dist/types");

                if (fs.existsSync(src)) {
                    fs.copySync(src, dest, {
                        overwrite: true,
                    });

                    console.log("✅ types copied to dist/types");
                }
            },
        },
        {
            name: "copy-fonts",
            closeBundle() {
                const src = path.resolve(__dirname, "src/assets/fonts");
                const dest = path.resolve(__dirname, "dist/fonts");

                if (fs.existsSync(src)) {
                    fs.copySync(src, dest, { overwrite: true });
                }
            },
        },
    ],

    build: {
        cssCodeSplit: false, // ❗组件库必须关闭

        assetsInlineLimit: 0, // ✔ 字体不转 base64

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