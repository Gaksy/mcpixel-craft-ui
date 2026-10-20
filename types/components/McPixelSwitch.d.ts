import type { DefineComponent } from "vue";
import type { Appearance, Size } from "./CommonStyleEnum";

export interface McPixelSwitchProps {
    modelValue?: boolean;
    /** 文案（也可用默认插槽） */
    label?: string;
    disabled?: boolean;
    appearance?: Appearance;
    /** 尺寸：medium（默认）/ small（设置项里更紧凑） */
    size?: Size;
    /** 关闭时滑块上的符号，默认「–」 */
    offText?: string;
    /** 打开时滑块上的符号，默认「O」 */
    onText?: string;
    /** 保存中：开关闪烁且不可再点（点一下立刻提交的设置项用） */
    wait?: boolean;
}

declare const McPixelSwitch: DefineComponent<
    McPixelSwitchProps,
    {},
    {},
    {},
    {},
    {},
    {},
    {}
>;

export default McPixelSwitch;
