import type { Variant, State, Appearance } from "../CommonStyleEnum";
interface Props {
    label?: string;
    modelValue?: string | number;
    disabled?: boolean;
    password?: boolean;
    variant?: Variant;
    state?: State;
    appearance?: Appearance;
    wait?: boolean;
}
declare const __VLS_export: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    blur: (...args: any[]) => void;
    focus: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onBlur?: ((...args: any[]) => any) | undefined;
    onFocus?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}>, {
    label: string;
    disabled: boolean;
    wait: boolean;
    appearance: Appearance;
    password: boolean;
    state: State;
    variant: Variant;
    modelValue: string | number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
