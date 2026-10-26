import type { DefineComponent } from "vue";
import type { Appearance, Size } from "./CommonStyleEnum";

/** 启用时的发光色调：绿=启用/成功，蓝=信息，橙=提醒，红=停用/危险 */
export type StateTone = "green" | "blue" | "orange" | "red";

export interface McPixelStateButtonProps {
    modelValue?: boolean;
    /** 文案（也可用默认插槽） */
    label?: string;
    /** 尺寸：small 24 / medium 32 / large 48，与 McPixelButton 同档 */
    size?: Size;
    appearance?: Appearance;
    /** 启用时的发光色调，默认 green */
    tone?: StateTone;
    /** 是否显示外围发光（默认 true） */
    glow?: boolean;
    disabled?: boolean;
    /** 提交中：闪烁且不可再点 */
    wait?: boolean;
    /** 通栏（独占一行） */
    block?: boolean;
}

declare const McPixelStateButton: DefineComponent<
    McPixelStateButtonProps,
    {},
    {},
    {},
    {},
    {},
    {},
    {}
>;

export default McPixelStateButton;
