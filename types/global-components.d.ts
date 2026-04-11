declare module 'vue' {
    export interface GlobalComponents {
        McPixelButton: typeof import("mcpixel-craft-ui")["McPixelButton"];
        McPixelInput: typeof import("mcpixel-craft-ui")["McPixelInput"];
        McPixelInnerTipsInput: typeof import("mcpixel-craft-ui")["McPixelInnerTipsInput"];
        McPixelCard: typeof import("mcpixel-craft-ui")["McPixelCard"];
    }
}

export {};