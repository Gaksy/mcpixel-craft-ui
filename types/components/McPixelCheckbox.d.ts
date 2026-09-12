import type { DefineComponent } from "vue";
import type { Appearance } from "./CommonStyleEnum";

export interface McPixelCheckboxProps {
    modelValue?: boolean;
    /** 文案（也可用默认插槽） */
    label?: string;
    disabled?: boolean;
    /** 半选状态（如树形结构的父节点） */
    indeterminate?: boolean;
    appearance?: Appearance;
    /** 紧凑模式：更小的方块与间距，适合列表内 */
    compact?: boolean;
}

declare const McPixelCheckbox: DefineComponent<
    McPixelCheckboxProps,
    {},
    {},
    {},
    {},
    {},
    {},
    {}
>;

export default McPixelCheckbox;
