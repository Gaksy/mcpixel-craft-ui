import type { DefineComponent } from "vue";
import type { Variant, State, Appearance } from "./CommonStyleEnum";

export interface McPixelInnerTipsInputProps {
    placeholder?: string;
    modelValue?: string | number;
    disabled?: boolean;
    password?: boolean;
    variant?: Variant;
    state?: State;
    appearance?: Appearance;
    wait?: boolean;
}

export interface McPixelInnerTipsInputEmits {
    (e: "update:modelValue", value: string | number): void;
    (e: "focus", event: FocusEvent): void;
    (e: "blur", event: FocusEvent): void;
}

declare const McPixelInnerTipsInput: DefineComponent<
    McPixelInnerTipsInputProps,
    {},
    {},
    {},
    {},
    {},
    {},
    McPixelInnerTipsInputEmits
>;

export default McPixelInnerTipsInput;