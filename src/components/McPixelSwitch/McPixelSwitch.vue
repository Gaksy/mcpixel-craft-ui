<script setup lang="ts">
/**
 * McPixelSwitch —— 像素风开关（滑块）
 *
 * 结构：`<label>` 包住「真实 checkbox（视觉隐藏）+ 凹槽 + 滑块 + 文案」，
 * 点滑块、点凹槽、点文字都能切换，键盘（Tab + 空格）与读屏语义都保留。
 *
 * 视觉：
 * - 凹槽是一块内凹的矩形，关闭时中性灰、打开时草方块绿，颜色带过渡
 * - 滑块是直角方块，打开时向右平移过去
 * - 滑块上带状态符号：关闭「–」、打开「O」（像素风格里最直观的开关提示）
 * - 颜色优先继承宿主主题变量（--bk-*），没有时回落到组件库调色板（--mc-core-*），
 *   所以后台深/浅主题与独立使用都能适配
 * - 文案可用 `label` 属性，也可用默认插槽
 */
import { computed } from "vue";
import type { Appearance, Size } from "../CommonStyleEnum";

defineOptions({ name: "McPixelSwitch" });

interface Props {
  modelValue?: boolean;
  /** 文案（也可用默认插槽） */
  label?: string;
  disabled?: boolean;
  appearance?: Appearance;
  /** 尺寸：medium（默认）/ small（列表、设置项里更紧凑） */
  size?: Size;
  /** 关闭时滑块上的符号 */
  offText?: string;
  /** 打开时滑块上的符号 */
  onText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: "",
  disabled: false,
  appearance: "dark",
  size: "medium",
  offText: "–",
  onText: "O",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "change", value: boolean): void;
}>();

const isOn = computed(() => !!props.modelValue);
/** small 之外都按 medium 渲染，避免传了 large 之类的值出不来样式 */
const sizeClass = computed(() => (props.size === "small" ? "is-small" : "is-medium"));

function onChange(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  emit("update:modelValue", checked);
  emit("change", checked);
}
</script>

<template>
  <label
    class="mc-pixel-switch"
    :class="[
      `mc-pixel-switch--appearance-${appearance}`,
      sizeClass,
      {
        'is-on': isOn,
        'is-disabled': disabled,
      },
    ]"
  >
    <input
      class="mc-pixel-switch-input"
      type="checkbox"
      role="switch"
      :checked="isOn"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="mc-pixel-switch-track" aria-hidden="true">
      <span class="mc-pixel-switch-thumb">{{ isOn ? onText : offText }}</span>
    </span>
    <span v-if="label || $slots.default" class="mc-pixel-switch-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.mc-pixel-switch {
  /* 优先用宿主主题变量（后台 --bk-*），没有就回落到组件库调色板 */
  --sw-border: var(--bk-border, var(--mc-core-grey-5, #3d3938));
  --sw-text: var(--bk-text-2, var(--mc-core-grey-2, #d0c5c0));
  --sw-hover: var(--bk-hover, #fffc70);
  --sw-accent: var(--bk-accent, var(--mc-core-green-4, #52a535));
  --sw-accent-strong: var(--bk-accent-strong, var(--mc-core-green-5, #3c8527));
  --sw-track-off: var(--bk-surface-2, rgba(255, 255, 255, 0.07));
  --sw-thumb: var(--bk-bg-sidebar, var(--mc-core-grey-6, #262423));
  --sw-thumb-text: var(--bk-text-3, var(--mc-core-grey-3, #aba09c));

  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-family: var(--font-pixel-12-mono);
  font-size: 13px;
  line-height: 1.5;
  color: var(--sw-text);
  user-select: none;
}

/* 浅色外观在没有宿主主题变量时用一套浅色底 */
.mc-pixel-switch--appearance-light {
  --sw-border: var(--bk-border, var(--mc-core-grey-2, #d0c5c0));
  --sw-text: var(--bk-text-2, #3d3938);
  --sw-hover: var(--bk-hover, #8a6d00);
  --sw-track-off: var(--bk-surface-2, rgba(38, 36, 35, 0.07));
  --sw-thumb: var(--bk-bg-sidebar, var(--mc-core-off-white, #fcf5f1));
  --sw-thumb-text: var(--bk-text-3, #6b6562);
}

/* 真实 checkbox 视觉隐藏但保留语义与键盘可达性 */
.mc-pixel-switch-input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 凹槽：内凹的矩形，用内阴影做出「凹下去」的像素感 */
.mc-pixel-switch-track {
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 46px;
  height: 24px;
  padding: 2px;
  border: 2px solid var(--sw-border);
  border-radius: 0;
  background: var(--sw-track-off);
  box-shadow: inset 2px 2px 0 rgba(0, 0, 0, 0.28);
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.is-small .mc-pixel-switch-track {
  width: 38px;
  height: 20px;
}

/* 滑块：直角方块，打开时滑到右边 */
.mc-pixel-switch-thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  font-size: 11px;
  line-height: 1;
  color: var(--sw-thumb-text);
  border: 2px solid var(--sw-border);
  border-radius: 0;
  background: var(--sw-thumb);
  transform: translateX(0);
  transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease,
    color 0.2s ease;
}

.is-small .mc-pixel-switch-thumb {
  width: 14px;
  height: 14px;
  font-size: 10px;
}

/* 打开：凹槽变草绿，滑块滑到右侧并变成亮色 */
.is-on .mc-pixel-switch-track {
  background: var(--sw-accent);
  border-color: var(--sw-accent-strong);
}

.is-on .mc-pixel-switch-thumb {
  color: var(--sw-accent-strong);
  background: var(--mc-core-off-white, #fcf5f1);
  border-color: var(--sw-accent-strong);
  transform: translateX(22px);
}

.is-small.is-on .mc-pixel-switch-thumb {
  transform: translateX(18px);
}

/* 悬停：凹槽描边提亮，和 checkbox / 按钮保持同一种反馈 */
.mc-pixel-switch:hover .mc-pixel-switch-track {
  border-color: var(--sw-hover);
}

.mc-pixel-switch:hover .mc-pixel-switch-thumb {
  border-color: var(--sw-hover);
}

.mc-pixel-switch-input:focus-visible + .mc-pixel-switch-track {
  border-color: var(--sw-hover);
  box-shadow: inset 2px 2px 0 rgba(0, 0, 0, 0.28), 0 0 0 2px var(--sw-hover);
}

/* 禁用：整体降透明度，并去掉悬停反馈 */
.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.is-disabled:hover .mc-pixel-switch-track,
.is-disabled:hover .mc-pixel-switch-thumb {
  border-color: var(--sw-border);
}

.mc-pixel-switch-label {
  flex: 1 1 auto;
}
</style>
