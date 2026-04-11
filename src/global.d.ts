import type { DefineComponent } from "vue";

declare module "vue" {
    export interface GlobalComponents {
        McPixelButton: DefineComponent<{}, {}, any>;
    }
}

export {};