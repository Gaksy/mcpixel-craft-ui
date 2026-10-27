<script setup lang="ts">
/**
 * McPixelSelect —— 像素风下拉选择。
 *
 * 为什么不用原生 <select>：原生下拉的弹出层由浏览器绘制，样式完全不可控
 * （深色模式下会闪白底、圆角、系统字体），跟组件库这套像素风格对不上。
 * 所以这里自己画一个：触发器 + 弹出面板，均按 appearance 取色。
 *
 * 支持：
 *  - v-model（string | number）
 *  - options：对象数组（{ value, label }）或字符串数组
 *  - 键盘：Enter / Space 展开，↑↓ 移动，Enter 选中，Esc 关闭
 *  - 点击空白关闭、选中项高亮、禁用态
 */
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import type { Variant, Size, State, Appearance } from "../CommonStyleEnum";

defineOptions({ name: "McPixelSelect" });

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface Props {
  appearance?: Appearance;
  block?: boolean;
  disabled?: boolean;
  size?: Size;
  state?: State;
  variant?: Variant;
  modelValue?: string | number | null;
  /** 对象数组或字符串数组 */
  options?: SelectOption[] | string[];
  placeholder?: string;
  id?: string;
  name?: string;
  /** 弹出面板最大高度（px） */
  maxPanelHeight?: number;
}

const props = withDefaults(defineProps<Props>(), {
  appearance: "light",
  block: false,
  disabled: false,
  size: "medium",
  state: "general",
  variant: "secondary",
  modelValue: "",
  options: () => [],
  placeholder: "",
  id: "",
  name: "",
  maxPanelHeight: 0,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "change", value: string | number): void;
}>();

const open = ref(false);
const activeIndex = ref(-1);
const triggerRef = ref<HTMLButtonElement | null>(null);
const rootRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);

/**
 * 面板用 Teleport 挂到 body 上、按触发器的位置做 fixed 定位。
 *
 * 为什么：如果直接放在组件内部用 absolute，任何祖先只要有 overflow:hidden/auto
 * （卡片、滚动容器很常见）都会把面板裁掉 —— 表现就是「下拉框高度受限、要滚动
 * 才能看到其余选项」。挂到 body 后不再受祖先裁剪，同时按可视空间决定向上/向下弹。
 */
const panelStyle = ref<Record<string, string>>({});

/** 统一成 { value, label } */
const normalized = computed<SelectOption[]>(() =>
  (props.options ?? []).map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  ),
);

const selected = computed(() =>
  normalized.value.find((opt) => opt.value === props.modelValue),
);

const displayLabel = computed(() => selected.value?.label ?? props.placeholder);

const isBlock = computed(() => props.block);
const isDisabled = computed(() => props.disabled);

function toggle() {
  if (isDisabled.value) return;
  open.value ? close() : openPanel();
}

function updatePanelPosition() {
  const trigger = triggerRef.value;
  if (!trigger) return;
  const rect = trigger.getBoundingClientRect();
  // 粗略估高：选项行高约 29px + 边框，用来判断放下面还是翻到上面
  const wanted = Math.min(
    normalized.value.length * 29 + 8,
    props.maxPanelHeight > 0 ? props.maxPanelHeight : Number.MAX_SAFE_INTEGER,
  );
  const spaceBelow = window.innerHeight - rect.bottom - 8;
  const spaceAbove = rect.top - 8;
  const openUp = wanted > spaceBelow && spaceAbove > spaceBelow;

  const style: Record<string, string> = {
    position: "fixed",
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: "9999",
    minWidth: "120px",
  };
  if (openUp) {
    style.bottom = `${window.innerHeight - rect.top + 2}px`;
    style.maxHeight = `${Math.min(spaceAbove, props.maxPanelHeight > 0 ? props.maxPanelHeight : spaceAbove)}px`;
  } else {
    style.top = `${rect.bottom + 2}px`;
    style.maxHeight = `${Math.min(spaceBelow, props.maxPanelHeight > 0 ? props.maxPanelHeight : spaceBelow)}px`;
  }
  panelStyle.value = style;
}

function openPanel() {
  open.value = true;
  activeIndex.value = Math.max(
    0,
    normalized.value.findIndex((opt) => opt.value === props.modelValue),
  );
  nextTick(() => {
    updatePanelPosition();
    document.addEventListener("mousedown", onDocMouseDown, true);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", updatePanelPosition);
  });
}

function close() {
  open.value = false;
  document.removeEventListener("mousedown", onDocMouseDown, true);
  window.removeEventListener("scroll", close, true);
  window.removeEventListener("resize", updatePanelPosition);
}

function onDocMouseDown(event: MouseEvent) {
  const target = event.target as Node;
  if (rootRef.value?.contains(target) || panelRef.value?.contains(target)) {
    return;
  }
  close();
}

function pick(opt: SelectOption) {
  if (opt.disabled) return;
  emit("update:modelValue", opt.value);
  emit("change", opt.value);
  close();
  triggerRef.value?.focus();
}

function move(delta: number) {
  if (!normalized.value.length) return;
  const max = normalized.value.length - 1;
  let next = activeIndex.value + delta;
  if (next < 0) next = max;
  if (next > max) next = 0;
  // 跳过禁用项
  let guard = 0;
  while (normalized.value[next]?.disabled && guard++ <= max) {
    next += delta;
    if (next < 0) next = max;
    if (next > max) next = 0;
  }
  activeIndex.value = next;
}

function onKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return;
  switch (event.key) {
    case "Enter":
    case " ":
      event.preventDefault();
      if (!open.value) {
        openPanel();
      } else if (normalized.value[activeIndex.value]) {
        pick(normalized.value[activeIndex.value]);
      }
      break;
    case "ArrowDown":
      event.preventDefault();
      if (!open.value) openPanel();
      else move(1);
      break;
    case "ArrowUp":
      event.preventDefault();
      if (!open.value) openPanel();
      else move(-1);
      break;
    case "Escape":
      if (open.value) {
        event.preventDefault();
        close();
      }
      break;
    case "Tab":
      close();
      break;
  }
}

// 外部把 modelValue 改掉时，收起面板
watch(
  () => props.modelValue,
  () => close(),
);

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onDocMouseDown, true);
  window.removeEventListener("scroll", close, true);
  window.removeEventListener("resize", updatePanelPosition);
});
</script>

<template>
  <div
    ref="rootRef"
    class="mc-pixel-select"
    :class="[
      `mc-pixel-select-appearance-${appearance}`,
      {
        'mc-pixel-select-block': isBlock,
        'mc-pixel-select-open': open,
        'mc-pixel-select-disabled': isDisabled,
      },
    ]"
  >
    <button
      ref="triggerRef"
      :id="id"
      :name="name"
      type="button"
      class="mc-pixel-select-trigger"
      :class="[
        `mc-pixel-select-size-${size}`,
        `mc-pixel-select-variant-${variant}`,
        `mc-pixel-select-state-${state}`,
        `mc-pixel-select-appearance-${appearance}`,
      ]"
      :disabled="isDisabled"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span class="mc-pixel-select-label" :class="{ 'is-placeholder': !selected }">
        {{ displayLabel }}
      </span>
      <span class="mc-pixel-select-caret" aria-hidden="true">▾</span>
    </button>

    <!-- 面板挂到 body：不受卡片/滚动容器的 overflow 裁剪，高度按可视空间自适应 -->
    <Teleport to="body">
      <ul
        v-if="open"
        ref="panelRef"
        class="mc-pixel-select-panel"
        :class="[
          `mc-pixel-select-appearance-${appearance}`,
          `mc-pixel-select-size-${size}`,
        ]"
        :style="panelStyle"
        role="listbox"
      >
      <li
        v-for="(opt, index) in normalized"
        :key="opt.value"
        class="mc-pixel-select-option"
        :class="{
          'is-selected': opt.value === modelValue,
          'is-active': index === activeIndex,
          'is-disabled': opt.disabled,
        }"
        role="option"
        :aria-selected="opt.value === modelValue"
        @mouseenter="activeIndex = index"
        @click="pick(opt)"
      >
        <span class="mc-pixel-select-check" aria-hidden="true">✓</span>
        <span>{{ opt.label }}</span>
      </li>
        <li v-if="!normalized.length" class="mc-pixel-select-empty">—</li>
      </ul>
    </Teleport>
  </div>
</template>

<style scoped>
.mc-pixel-select {
  position: relative;
  display: inline-block;
  vertical-align: middle;
}

.mc-pixel-select.mc-pixel-select-block {
  display: block;
  width: 100%;
}

/* ---------------- 触发器：外观对齐 McPixelInput ---------------- */

.mc-pixel-select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  font-family: var(--font-pixel-12-mono);
  font-weight: normal;
  letter-spacing: 0.5px;
  border-style: solid;
  border-width: 2px;
  border-radius: 0;
  outline: none;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  text-align: left;
  padding-left: 8px;
  padding-right: 8px;
}

.mc-pixel-select-label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.mc-pixel-select-caret {
  flex: 0 0 auto;
  font-size: 0.8em;
  opacity: 0.8;
  transition: transform 0.15s ease;
}

.mc-pixel-select.mc-pixel-select-open .mc-pixel-select-caret {
  transform: rotate(180deg);
}

/* 尺寸与 McPixelInput 一致 */

.mc-pixel-select-size-small {
  height: var(--mc-small-height);
  font-size: var(--mc-small-font-size);
  min-width: var(--mc-small-width);
}

.mc-pixel-select-size-medium {
  height: var(--mc-medium-height);
  font-size: var(--mc-medium-font-size);
  min-width: var(--mc-medium-width);
}

.mc-pixel-select-size-large {
  height: var(--mc-large-height);
  font-size: var(--mc-large-font-size);
  min-width: var(--mc-large-width);
}

/* ---------------- 深浅色（与 McPixelInput 同一套语义色） ---------------- */

.mc-pixel-select-trigger.mc-pixel-select-appearance-light {
  color: var(--mc-core-grey-6);
  background: var(--mc-core-grey-1);
}

.mc-pixel-select-trigger.mc-pixel-select-appearance-dark {
  color: var(--mc-core-grey-1);
  background: var(--mc-core-grey-4);
}

/* variant：边框取色（general / primary / secondary / danger） */

.mc-pixel-select-variant-general {
  border-color: var(--mc-vanilla-grey-5);
}

.mc-pixel-select-variant-general:hover:not(:disabled) {
  border-color: var(--mc-vanilla-grey-6);
}

.mc-pixel-select-variant-general:focus-visible,
.mc-pixel-select-open .mc-pixel-select-variant-general {
  border-color: var(--mc-vanilla-grey-6);
  box-shadow: 0 0 0 2px var(--mc-vanilla-grey-5);
}

.mc-pixel-select-variant-primary {
  border-color: var(--mc-vanilla-blue-6);
}

.mc-pixel-select-variant-primary:hover:not(:disabled) {
  border-color: var(--mc-vanilla-blue-5);
}

.mc-pixel-select-variant-primary:focus-visible,
.mc-pixel-select-open .mc-pixel-select-variant-primary {
  box-shadow: 0 0 0 2px var(--mc-vanilla-blue-2);
}

.mc-pixel-select-variant-secondary {
  border-color: var(--mc-core-green-6);
}

.mc-pixel-select-variant-secondary:hover:not(:disabled) {
  border-color: var(--mc-core-green-5);
}

.mc-pixel-select-variant-secondary:focus-visible,
.mc-pixel-select-open .mc-pixel-select-variant-secondary {
  box-shadow: 0 0 0 2px var(--mc-core-green-2);
}

.mc-pixel-select-variant-danger {
  border-color: var(--mc-dungeons-orange-6);
}

.mc-pixel-select-variant-danger:hover:not(:disabled) {
  border-color: var(--mc-dungeons-orange-5);
}

.mc-pixel-select-variant-danger:focus-visible,
.mc-pixel-select-open .mc-pixel-select-variant-danger {
  box-shadow: 0 0 0 2px var(--mc-dungeons-orange-2);
}

/* state */

.mc-pixel-select-state-success {
  box-shadow: var(--mc-state-box-shadow-success);
}

.mc-pixel-select-state-error {
  box-shadow: var(--mc-state-box-shadow-error);
}

.mc-pixel-select-state-warning {
  box-shadow: var(--mc-state-box-shadow-warning);
}

.mc-pixel-select-state-selected {
  box-shadow: var(--mc-state-box-shadow-selected);
}

/* disabled */

.mc-pixel-select-trigger:disabled {
  cursor: not-allowed;
}

.mc-pixel-select-trigger.mc-pixel-select-appearance-light:disabled {
  color: white;
  background-color: var(--mc-core-grey-3);
}

.mc-pixel-select-trigger.mc-pixel-select-appearance-dark:disabled {
  background-color: var(--mc-core-grey-5);
}

/* ---------------- 弹出面板 ---------------- */

.mc-pixel-select-panel {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  z-index: 60;
  box-sizing: border-box;
  width: 100%;
  min-width: 120px;
  margin: 0;
  padding: 2px 0;
  list-style: none;
  overflow-y: auto;
  border-style: solid;
  border-width: 2px;
  border-radius: 0;
  font-family: var(--font-pixel-12-mono);
  font-size: var(--mc-medium-font-size);
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.35);
}

.mc-pixel-select-panel.mc-pixel-select-appearance-light {
  color: var(--mc-core-grey-6);
  background: var(--mc-core-grey-1);
  border-color: var(--mc-core-grey-3);
}

.mc-pixel-select-panel.mc-pixel-select-appearance-dark {
  color: var(--mc-core-grey-1);
  background: var(--mc-core-grey-5);
  border-color: var(--mc-core-grey-3);
}

.mc-pixel-select-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  cursor: pointer;
  user-select: none;
}

.mc-pixel-select-check {
  width: 1em;
  flex: 0 0 auto;
  opacity: 0;
}

.mc-pixel-select-option.is-selected .mc-pixel-select-check {
  opacity: 1;
  color: var(--mc-core-green-4);
}

/* 悬停/键盘高亮：浅色用浅一档，深色用深一档，保证对比度 */

.mc-pixel-select-panel.mc-pixel-select-appearance-light
  .mc-pixel-select-option.is-active {
  background: var(--mc-core-grey-3);
}

.mc-pixel-select-panel.mc-pixel-select-appearance-dark
  .mc-pixel-select-option.is-active {
  background: var(--mc-core-grey-6);
}

.mc-pixel-select-option.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.mc-pixel-select-empty {
  padding: 6px 8px;
  opacity: 0.6;
}
</style>
