import type { Variant, Size, State, Appearance } from "../CommonStyleEnum";
type ButtonType = "button" | "submit" | "reset";
interface Props {
    appearance?: Appearance;
    block?: boolean;
    disabled?: boolean;
    size?: Size;
    state?: State;
    type?: ButtonType;
    variant?: Variant;
    wait?: boolean;
}
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    click: (event: MouseEvent) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
}>, {
    type: ButtonType;
    block: boolean;
    size: Size;
    disabled: boolean;
    wait: boolean;
    appearance: Appearance;
    state: State;
    variant: Variant;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
