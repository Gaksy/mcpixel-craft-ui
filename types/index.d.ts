import type { App } from "vue";
import McPixelButton from "./components/McPixelButton";

export { McPixelButton };

export type { McPixelButtonProps } from "./components/McPixelButton";

declare const _default: {
    install(app: App): void;
};

export default _default;

declare module "vue" {
    export interface GlobalComponents {
        McPixelButton: typeof McPixelButton;
    }
}