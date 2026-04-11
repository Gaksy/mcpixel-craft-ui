import type { DefineComponent } from "vue";
import type { Variant, Size, State, Appearance } from "./CommonStyleEnum";

// button 原生 type
export type McPixelButtonType = "button" | "submit" | "reset";

// props（完全对应你的 defineProps）
export interface McPixelButtonProps {
    appearance?: Appearance;
    block?: boolean;
    disabled?: boolean;
    size?: Size;
    state?: State;
    type?: McPixelButtonType;
    variant?: Variant;
    wait?: boolean;
}

// emits（对应 defineEmits）
export interface McPixelButtonEmits {
    (e: "click", event: MouseEvent): void;
}

// ⭐ 组件声明
declare const McPixelButton: DefineComponent<
    McPixelButtonProps,
    {},
    {},
    {},
    {},
    {},
    {},
    McPixelButtonEmits
>;

export default McPixelButton;