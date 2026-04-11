import type { App } from "vue";
import McPixelButton from "./components/McPixelButton";
import McPixelInput from "./components/McPixelInput";
import McPixelInnerTipsInput from "./components/McPixelInnerTipsInput";
import McPixelCard from "./components/McPixelCard";

export { McPixelButton, McPixelInput, McPixelInnerTipsInput, McPixelCard };

export type { McPixelButtonProps } from "./components/McPixelButton";
export type { McPixelInputProps } from "./components/McPixelInput";
export type { McPixelInnerTipsInputProps } from "./components/McPixelInnerTipsInput";
export type { McPixelCard } from "./components/McPixelCard";

declare const _default: {
    install(app: App): void;
};

export default _default;

declare module "vue" {
    export interface GlobalComponents {
        McPixelButton: typeof McPixelButton;
        McPixelInput: typeof McPixelInput;
        McPixelInnerTipsInput: typeof McPixelInnerTipsInput;
        McPixelCard: typeof McPixelCard;
    }
}