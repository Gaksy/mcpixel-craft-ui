<script setup lang="ts">
/**
 * McPixelToast —— 像素风轻提示（顶部滑入、不阻塞界面、自动消失）
 *
 * 使用方式（推荐）：
 * ```ts
 * import { useMcPixelToast } from "mcpixel-craft-ui";
 * const toast = useMcPixelToast();
 * toast.success("已开启 公开页面 维护");
 * toast.error("保存失败，请稍后再试");
 * toast.warning("创作台维护中，部分功能暂不可用");
 * ```
 * `useMcPixelToast()` 会在第一次调用时把唯一的宿主（视口）挂到 `body` 上，
 * 所以宿主不需要显式写成组件 —— 也就不会出现"忘挂宿主，提示永远不显示"。
 *
 * 视觉约定（站长口径）：
 * - 从**顶部滑落**，浅色/深色主题都跟宿主变量走；
 * - 成功 = 绿色 + √、失败 = 红色 + ✕、警告 = 黄色 + ！；
 * - **不阻塞界面**：容器 `pointer-events: none`，只有提示条本身可点（点一下可立即关闭）；
 * - 过一段时间自动消失（默认 2.6 秒，可传 duration）。
 */
import { computed } from "vue";

export type ToastKind = "success" | "error" | "warning";

const props = withDefaults(
  defineProps<{
    kind?: ToastKind;
    message: string;
    /** 淡出中（真正的移除由宿主在动画结束后做） */
    leaving?: boolean;
  }>(),
  {
    kind: "success",
    leaving: false,
  }
);

const glyph = computed(() => (props.kind === "success" ? "✓" : props.kind === "error" ? "✕" : "!"));
</script>

<template>
  <div
    class="mc-pixel-toast"
    :class="[`mc-pixel-toast--${kind}`, { 'is-leaving': leaving }]"
    role="status"
    aria-live="polite"
  >
    <span class="mc-pixel-toast-icon" aria-hidden="true">{{ glyph }}</span>
    <span class="mc-pixel-toast-text">{{ message }}</span>
  </div>
</template>

<style scoped>
.mc-pixel-toast {
  /* 跟宿主主题走：后台用 --bk-*，独立使用回落到组件库调色板 */
  --toast-bg: var(--bk-bg-modal, var(--mc-core-grey-6, #262423));
  --toast-text: var(--bk-text-1, var(--mc-core-off-white, #fcf5f1));
  --toast-border: var(--bk-border, var(--mc-core-grey-5, #3d3938));

  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  max-width: min(560px, calc(100vw - 32px));
  padding: 10px 16px 10px 10px;
  font-family: var(--font-pixel-12-mono, monospace);
  font-size: 13px;
  line-height: 1.6;
  color: var(--toast-text);
  background: var(--toast-bg);
  border: 2px solid var(--toast-border);
  border-radius: 0;
  /* 像素风：硬阴影，不用模糊 */
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.45);
  pointer-events: auto;
  cursor: pointer;
  animation: mc-pixel-toast-in 0.22s ease-out;
}

/* 图标方块：颜色区分三种语义 */
.mc-pixel-toast-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  font-size: 13px;
  line-height: 1;
  color: #10100f;
}

.mc-pixel-toast-text {
  flex: 1 1 auto;
  word-break: break-word;
}

.mc-pixel-toast--success {
  border-color: var(--mc-core-green-4, #52a535);
}

.mc-pixel-toast--success .mc-pixel-toast-icon {
  background: var(--mc-core-green-3, #6cc349);
}

.mc-pixel-toast--error {
  border-color: #d5533f;
}

.mc-pixel-toast--error .mc-pixel-toast-icon {
  background: #e8614a;
}

.mc-pixel-toast--warning {
  border-color: #d9a441;
}

.mc-pixel-toast--warning .mc-pixel-toast-icon {
  background: #f0c258;
}

/* 进出动画：从顶部滑落 / 向上淡出 */
@keyframes mc-pixel-toast-in {
  from {
    opacity: 0;
    transform: translateY(-14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mc-pixel-toast.is-leaving {
  animation: mc-pixel-toast-out 0.18s ease-in forwards;
}

@keyframes mc-pixel-toast-out {
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mc-pixel-toast,
  .mc-pixel-toast.is-leaving {
    animation-duration: 0.01s;
  }
}
</style>
