/**
 * useMcPixelToast —— 轻提示的命令式 API
 *
 * 为什么做成"命令式 + 自动挂宿主"：
 * 页面里只想写 `toast.success("已开启 公开页面 维护")`，不想每处都记着去模板里挂一个容器；
 * 宿主在第一次调用时惰性挂到 body，之后全局复用同一个（不会叠多个视口）。
 *
 * 用法：
 * ```ts
 * const toast = useMcPixelToast();
 * toast.success("已开启 公开页面 维护");   // 绿 √
 * toast.error("保存失败，请稍后再试");       // 红 ✕
 * toast.warning("维护中，部分功能暂不可用"); // 黄 ！
 * ```
 * 同一条文案在 1.2 秒内重复出现时只保留一条（连点开关不会刷出一排一模一样的提示）。
 */
import { createApp, h, reactive } from "vue";
import type { ToastKind } from "./McPixelToast.vue";
import McPixelToastHost from "./McPixelToastHost.vue";

export interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
  /** 淡出阶段（动画结束后才真正移除） */
  leaving: boolean;
}

/** 当前队列（宿主直接渲染它） */
export const toastItems = reactive<ToastItem[]>([]);

let seq = 0;
/** 同一条文案上一次出现的时间（去重用） */
const lastShown = new Map<string, number>();
/** 视口是否已挂载 */
let hostMounted = false;

const LEAVE_MS = 180;
const DEFAULT_DURATION = 2600;

function push(kind: ToastKind, message: string, duration = DEFAULT_DURATION): void {
  const text = String(message ?? "").trim();
  if (!text) return;

  const now = Date.now();
  const seen = lastShown.get(`${kind}:${text}`) ?? 0;
  if (now - seen < 1200) return;
  lastShown.set(`${kind}:${text}`, now);

  ensureHost();

  const item: ToastItem = { id: ++seq, kind, message: text, leaving: false };
  toastItems.push(item);

  window.setTimeout(() => {
    const hit = toastItems.find((x) => x.id === item.id);
    if (!hit) return;
    hit.leaving = true;
    window.setTimeout(() => dismissToast(item.id), LEAVE_MS);
  }, Math.max(500, duration));
}

/** 手动关掉某一条（点击提示条时也会走它） */
export function dismissToast(id: number): void {
  const index = toastItems.findIndex((x) => x.id === id);
  if (index >= 0) toastItems.splice(index, 1);
}

/** 惰性挂宿主：只在 body 里挂一次，之后复用 */
function ensureHost(): void {
  if (hostMounted || typeof document === "undefined") return;
  hostMounted = true;
  const container = document.createElement("div");
  container.className = "mc-pixel-toast-root";
  document.body.appendChild(container);
  createApp({ render: () => h(McPixelToastHost) }).mount(container);
}

export function useMcPixelToast() {
  return {
    success: (message: string, duration?: number) => push("success", message, duration),
    error: (message: string, duration?: number) => push("error", message, duration),
    warning: (message: string, duration?: number) => push("warning", message, duration),
    /** 关掉全部 */
    clear: () => {
      toastItems.splice(0, toastItems.length);
    },
  };
}
