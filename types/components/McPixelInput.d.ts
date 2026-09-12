import type { DefineComponent } from "vue";
import type { Variant, Size, State, Appearance } from "./CommonStyleEnum";

export type InputType =
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week"
    | "color"
    | "file"
    | "range"
    | "checkbox"
    | "radio"
    | "hidden";

export interface McPixelInputProps {
    appearance?: Appearance;
    block?: boolean;
    disabled?: boolean;
    size?: Size;
    state?: State;
    type?: InputType;
    variant?: Variant;
    readonly?: boolean;
    placeholder?: string;
    modelValue?: string | number;
    name?: string;
    id?: string;
    required?: boolean;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    accept?: string;
    multiple?: boolean;
    checked?: boolean;
    wait?: boolean;
}

export interface McPixelInputEmits {
    (e: "update:modelValue", value: string | number | boolean): void;
    (e: "change", event: Event): void;
    (e: "focus", event: FocusEvent): void;
    (e: "blur", event: FocusEvent): void;
    (e: "input", event: Event): void;
}

declare const McPixelInput: DefineComponent<
    McPixelInputProps,
    {},
    {},
    {},
    {},
    {},
    {},
    McPixelInputEmits
>;

export default McPixelInput;
