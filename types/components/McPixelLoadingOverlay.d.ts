import type { DefineComponent } from "vue";

export interface McPixelLoadingOverlayProps {
    /** 是否显示 */
    visible?: boolean;
    /** 文案（可留空；也可用默认插槽完全自定义加载内容） */
    text?: string;
    /** 背景模糊强度（px），0 = 不模糊 */
    blur?: number;
    /** 背景压暗强度（0–1） */
    dim?: number;
    /** 层级 */
    zIndex?: number;
}

declare const McPixelLoadingOverlay: DefineComponent<
    McPixelLoadingOverlayProps,
    {},
    {},
    {},
    {},
    {},
    {},
    {}
>;

export default McPixelLoadingOverlay;
