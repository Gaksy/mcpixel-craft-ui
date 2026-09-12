import type { App } from "vue";

declare module "vue" {
    export interface GlobalComponents {
        McPixelButton: typeof import("mcpixel-craft-ui")["McPixelButton"];
        McPixelInput: typeof import("mcpixel-craft-ui")["McPixelInput"];
        McPixelInnerTipsInput: typeof import("mcpixel-craft-ui")["McPixelInnerTipsInput"];
        McPixelCard: typeof import("mcpixel-craft-ui")["McPixelCard"];
        McPixelTable: typeof import("mcpixel-craft-ui")["McPixelTable"];
        McPixelCheckbox: typeof import("mcpixel-craft-ui")["McPixelCheckbox"];
        McPixelSwitch: typeof import("mcpixel-craft-ui")["McPixelSwitch"];
        McPixelPagination: typeof import("mcpixel-craft-ui")["McPixelPagination"];
    }
}

declare const _default: {
    install(app: App, ...options: any[]): any;
};

export default _default;
export {};
