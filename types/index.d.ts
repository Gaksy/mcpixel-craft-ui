import type { App } from "vue";
import McPixelButton from "./components/McPixelButton";
import McPixelInput from "./components/McPixelInput";
import McPixelInnerTipsInput from "./components/McPixelInnerTipsInput";

export { McPixelButton, McPixelInput, McPixelInnerTipsInput };

export type { McPixelButtonProps } from "./components/McPixelButton";
export { McPixelInputProps } from "./components/McPixelInput";
export { McPixelInnerTipsInputProps } from "./components/McPixelInnerTipsInput";

declare const _default: {
    install(app: App): void;
};

export default _default;

declare module "vue" {
    export interface GlobalComponents {
        McPixelButton: typeof McPixelButton;
        McPixelInput: typeof McPixelInput;
        McPixelInnerTipsInput: typeof McPixelInnerTipsInput;
    }
}