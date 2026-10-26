import type { DefineComponent } from "vue";
import type { Appearance, Size } from "./CommonStyleEnum";

export interface McPixelSearchInputProps {
    modelValue?: string;
    placeholder?: string;
    /** 尺寸：small 24px / medium 32px（默认）/ large 48px，与 McPixelButton 同档 */
    size?: Size;
    appearance?: Appearance;
    disabled?: boolean;
    /** 搜索请求在飞：输入框只读 + 整框闪烁 */
    wait?: boolean;
    /** 有内容时右侧显示清空按钮（默认 true） */
    clearable?: boolean;
}

declare const McPixelSearchInput: DefineComponent<
    McPixelSearchInputProps,
    {},
    {},
    {},
    {},
    {},
    {},
    {}
>;

export default McPixelSearchInput;
