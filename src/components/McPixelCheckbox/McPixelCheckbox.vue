<script setup lang="ts">
/**
 * McPixelCheckbox —— 像素风多选框
 *
 * 结构：`<label>` 包住「真实 input（视觉隐藏）+ 像素方块 + 文案」，
 * 所以点文字也能切换，键盘、读屏、表单语义都保留。
 *
 * - 勾选：草方块绿填充 + 像素对勾；半选：黄块 + 横杠（indeterminate）
 * - 颜色优先继承宿主主题变量（--bk-*），没有时回落组件库调色板（--mc-core-*），
 *   因此后台深/浅主题与独立使用都能适配
 * - 文案可用 `label` 属性，也可用默认插槽写更复杂的内容（如带补充说明、标签）
 */
import { computed, onMounted, ref, watch } from "vue";
import type { Appearance } from "../CommonStyleEnum";

defineOptions({ name: "McPixelCheckbox" });

interface Props {
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

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: "",
  disabled: false,
  indeterminate: false,
  appearance: "dark",
  compact: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "change", value: boolean): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

/** 原生 input 的 indeterminate 只能通过属性设置 */
function syncIndeterminate() {
  if (inputRef.value) inputRef.value.indeterminate = props.indeterminate;
}

onMounted(syncIndeterminate);
watch(() => props.indeterminate, syncIndeterminate);
watch(() => props.modelValue, () => queueMicrotask(syncIndeterminate));

const isChecked = computed(() => !!props.modelValue && !props.indeterminate);

function onChange(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  emit("update:modelValue", checked);
  emit("change", checked);
}
</script>

<template>
  <label
    class="mc-pixel-checkbox"
    :class="[
      `mc-pixel-checkbox--appearance-${appearance}`,
      {
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-disabled': disabled,
        'is-compact': compact,
      },
    ]"
  >
    <input
      ref="inputRef"
      class="mc-pixel-checkbox-input"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="mc-pixel-checkbox-box" aria-hidden="true">
      <span v-if="indeterminate" class="mc-pixel-checkbox-dash" />
      <svg v-else-if="isChecked" class="mc-pixel-checkbox-tick" viewBox="0 0 12 12">
        <path d="M1.5 6.5 L4.5 9.5 L10.5 2.5" />
      </svg>
    </span>
    <span v-if="label || $slots.default" class="mc-pixel-checkbox-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.mc-pixel-checkbox {
  /* 优先用宿主主题变量（后台 --bk-*），没有就回落到组件库调色板 */
  --cb-border: var(--bk-border, var(--mc-core-grey-5, #3d3938));
  --cb-text: var(--bk-text-2, var(--mc-core-grey-2, #d0c5c0));
  --cb-hover: var(--bk-hover, #fffc70);
  --cb-accent: var(--bk-accent, var(--mc-core-green-4, #52a535));
  --cb-accent-strong: var(--bk-accent-strong, var(--mc-core-green-5, #3c8527));
  --cb-box-bg: var(--bk-surface, rgba(255, 255, 255, 0.04));

  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-family: var(--font-pixel-12-mono);
  font-size: 13px;
  line-height: 1.5;
  color: var(--cb-text);
  user-select: none;
}

/* 浅色外观在没有宿主主题变量时用一套浅色底 */
.mc-pixel-checkbox--appearance-light {
  --cb-border: var(--bk-border, var(--mc-core-grey-2, #d0c5c0));
  --cb-text: var(--bk-text-2, #3d3938);
  --cb-hover: var(--bk-hover, #8a6d00);
  --cb-box-bg: var(--bk-surface, rgba(38, 36, 35, 0.04));
}

/* 真实 input 视觉隐藏但保留语义与键盘可达性 */
.mc-pixel-checkbox-input {
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

/* 像素方块 */
.mc-pixel-checkbox-box {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  margin-top: 1px;
  border: 2px solid var(--cb-border);
  border-radius: 0;
  background: var(--cb-box-bg);
  transition: background-color 0.18s ease, border-color 0.18s ease;
}

.is-compact .mc-pixel-checkbox-box {
  width: 14px;
  height: 14px;
  margin-top: 2px;
}

.mc-pixel-checkbox:hover .mc-pixel-checkbox-box {
  border-color: var(--cb-hover);
}

.is-checked .mc-pixel-checkbox-box {
  background: var(--cb-accent);
  border-color: var(--cb-accent-strong);
}

.is-indeterminate .mc-pixel-checkbox-box {
  background: var(--cb-hover);
  border-color: var(--cb-hover);
}

/* 对勾：描边路径，直角像素感 */
.mc-pixel-checkbox-tick {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: var(--mc-core-off-white, #fcf5f1);
  stroke-width: 2.4;
  stroke-linecap: square;
  stroke-linejoin: miter;
}

/* 半选：一条横杠 */
.mc-pixel-checkbox-dash {
  width: 8px;
  height: 4px;
  background: var(--mc-core-grey-6, #262423);
}

.mc-pixel-checkbox-label {
  flex: 1 1 auto;
  min-width: 0;
}

/* 键盘聚焦提示 */
.mc-pixel-checkbox-input:focus-visible + .mc-pixel-checkbox-box {
  border-color: var(--cb-hover);
  box-shadow: 0 0 0 2px rgba(255, 252, 112, 0.25);
}

.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.is-disabled:hover .mc-pixel-checkbox-box {
  border-color: var(--cb-border);
}
</style>
