import type { DefineComponent } from "vue";
import type { Variant, Size, State, Appearance } from "./CommonStyleEnum";

/** 下拉选项：对象形式或字符串形式都行 */
export interface McPixelSelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

export interface McPixelSelectProps {
    appearance?: Appearance;
    block?: boolean;
    disabled?: boolean;
    size?: Size;
    state?: State;
    variant?: Variant;
    modelValue?: string | number | null;
    options?: McPixelSelectOption[] | string[];
    placeholder?: string;
    id?: string;
    name?: string;
    maxPanelHeight?: number;
}

declare const McPixelSelect: DefineComponent<McPixelSelectProps>;

export default McPixelSelect;