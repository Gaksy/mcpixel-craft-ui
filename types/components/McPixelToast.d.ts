import type { DefineComponent } from "vue";

/** 轻提示的三种语义：成功（绿 √）、失败（红 ✕）、警告（黄 ！） */
export type ToastKind = "success" | "error" | "warning";

export interface McPixelToastProps {
    /** 语义，默认 success */
    kind?: ToastKind;
    /** 文案（必填） */
    message: string;
    /** 淡出中（宿主内部用，业务一般不传） */
    leaving?: boolean;
}

declare const McPixelToast: DefineComponent<
    McPixelToastProps,
    {},
    {},
    {},
    {},
    {},
    {},
    {}
>;

export default McPixelToast;

/**
 * 命令式轻提示 API。宿主（顶部视口）在第一次调用时自动挂到 body，
 * 容器 `pointer-events: none`，不阻塞界面；默认 2.6 秒后自动消失。
 */
export interface McPixelToastApi {
    /** 绿 √ */
    success(message: string, duration?: number): void;
    /** 红 ✕ */
    error(message: string, duration?: number): void;
    /** 黄 ！ */
    warning(message: string, duration?: number): void;
    /** 立刻清空所有提示 */
    clear(): void;
}

export declare function useMcPixelToast(): McPixelToastApi;
