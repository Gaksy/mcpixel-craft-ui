declare module 'vue' {
    export interface GlobalComponents {
        McPixelButton: typeof import("mcpixel-craft-ui")["McPixelButton"];
    }
}

export {};