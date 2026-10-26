<script setup lang="ts">
/**
 * McPixelSearchInput —— 像素风搜索框
 *
 * 为什么单独做一个（而不是拿 McPixelInput 凑）：搜索框和普通输入框的形态要求不一样 ——
 * 它要有一个"搜索"图标、要能一键清空、按回车就搜、请求在飞的时候要能"转着"。
 * 站点里原来直接用裸 `<input>`，高度 36px、字号 13px、没有像素描边，
 * 跟旁边的 mcpixel 按钮（24px / 32px 档）摆在一起高矮不齐、质感也不统一。
 *
 * 视觉与组件库其它控件同一套：2px 像素描边 + 内凹硬阴影 + 像素字体 + 直角。
 * 尺寸走组件库的高度变量（small 24 / medium 32 / large 48），所以能和 McPixelButton、
 * McPixelSwitch 摆在同一行对齐。
 *
 * 用法：
 * ```vue
 * <McPixelSearchInput v-model="keyword" placeholder="搜标题或简介" @search="load()" />
 * <McPixelSearchInput v-model="q" size="small" :wait="searching" @search="search" />
 * ```
 */
import { computed, ref } from "vue";
import type { Appearance, Size } from "../CommonStyleEnum";

defineOptions({ name: "McPixelSearchInput" });

interface Props {
  modelValue?: string;
  placeholder?: string;
  /** 尺寸：small 24px / medium 32px（默认）/ large 48px，与 McPixelButton 同档 */
  size?: Size;
  appearance?: Appearance;
  disabled?: boolean;
  /** 搜索请求在飞：输入框只读 + 图标闪烁（和 McPixelSwitch 的 wait 同一套节奏） */
  wait?: boolean;
  /** 有内容时右侧显示清空按钮 */
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  placeholder: "",
  size: "medium",
  appearance: "dark",
  disabled: false,
  wait: false,
  clearable: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  /** 回车或点击搜索图标 */
  (e: "search", value: string): void;
  (e: "clear"): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const focused = ref(false);

const isDisabled = computed(() => props.disabled || props.wait);
const sizeClass = computed(() =>
  props.size === "small" ? "is-small" : props.size === "large" ? "is-large" : "is-medium"
);
const hasValue = computed(() => String(props.modelValue ?? "").length > 0);

function onInput(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}

function onSubmit() {
  if (isDisabled.value) return;
  emit("search", String(props.modelValue ?? ""));
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    event.preventDefault();
    onSubmit();
  } else if (event.key === "Escape" && hasValue.value) {
    // Esc 先清空（与浏览器搜索框的习惯一致）
    event.preventDefault();
    clear();
  }
}

function clear() {
  emit("update:modelValue", "");
  emit("clear");
  inputRef.value?.focus();
}

function onFocus(event: FocusEvent) {
  focused.value = true;
  emit("focus", event);
}

function onBlur(event: FocusEvent) {
  focused.value = false;
  emit("blur", event);
}
</script>

<template>
  <div
    class="mc-pixel-search"
    :class="[
      `mc-pixel-search--appearance-${appearance}`,
      sizeClass,
      {
        'is-focused': focused,
        'is-disabled': isDisabled,
        'is-wait': wait,
      },
    ]"
  >
    <!-- 放大镜：纯 CSS 画的像素放大镜（方框 + 斜柄），不用图标字体 -->
    <button
      type="button"
      class="mc-pixel-search-icon"
      :disabled="isDisabled"
      :aria-label="placeholder"
      tabindex="-1"
      @click="onSubmit"
    >
      <span class="mc-pixel-search-lens" aria-hidden="true">
        <span class="mc-pixel-search-handle" />
      </span>
    </button>

    <input
      ref="inputRef"
      class="mc-pixel-search-input"
      type="search"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="isDisabled"
      autocomplete="off"
      spellcheck="false"
      @input="onInput"
      @keydown="onKeydown"
      @focus="onFocus"
      @blur="onBlur"
    />

    <button
      v-if="clearable && hasValue && !isDisabled"
      type="button"
      class="mc-pixel-search-clear"
      aria-label="clear"
      tabindex="-1"
      @click="clear"
    >
      ✕
    </button>
  </div>
</template>

<style scoped>
.mc-pixel-search {
  /* 跟宿主主题走：后台用 --bk-*，前台回落到组件库调色板 */
  --search-border: var(--bk-border, var(--mc-core-grey-5, #3d3938));
  --search-bg: var(--bk-surface-1, var(--mc-core-grey-7, #1d1c1b));
  --search-text: var(--bk-text-1, var(--mc-core-off-white, #fcf5f1));
  --search-hint: var(--bk-text-4, var(--mc-core-grey-4, #6b6562));
  --search-accent: var(--bk-accent, var(--mc-core-green-4, #52a535));

  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  padding: 0 8px;
  font-family: var(--font-pixel-12-mono, monospace);
  color: var(--search-text);
  background: var(--search-bg);
  border: 2px solid var(--search-border);
  border-radius: 0;
  /* 内凹：和开关凹槽、输入框同一套像素质感 */
  box-shadow: inset 2px 2px 0 rgba(0, 0, 0, 0.28);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.mc-pixel-search--appearance-light {
  --search-border: var(--bk-border, var(--mc-core-grey-2, #d0c5c0));
  --search-bg: var(--bk-surface-1, var(--mc-core-off-white, #fcf5f1));
  --search-text: var(--bk-text-1, #262423);
  --search-hint: var(--bk-text-3, #6b6562);
}

/* 尺寸与组件库按钮/开关同档：24 / 32 / 48 */
.is-small {
  height: var(--mc-small-height, 24px);
  font-size: var(--mc-small-font-size, 11px);
}

.is-medium {
  height: var(--mc-medium-height, 32px);
  font-size: var(--mc-medium-font-size, 15px);
}

.is-large {
  height: var(--mc-large-height, 48px);
  font-size: var(--mc-large-font-size, 17px);
}

/* 聚焦：描边变强调色（绿色），不画外发光，保持像素风的硬边 */
.is-focused {
  border-color: var(--search-accent);
}

.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 搜索中：整框闪烁一下即可，不做转圈（像素风里转圈不搭） */
.is-wait {
  animation: mc-pixel-search-flash 1s infinite;
}

@media (prefers-reduced-motion: reduce) {
  .is-wait {
    animation: none;
  }
}

@keyframes mc-pixel-search-flash {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

/* 放大镜按钮 */
.mc-pixel-search-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.4em;
  height: 1.4em;
  padding: 0;
  background: none;
  border: 0;
  cursor: pointer;
  color: var(--search-hint);
  transition: color 0.15s ease;
}

.mc-pixel-search-icon:hover:not(:disabled) {
  color: var(--search-accent);
}

.mc-pixel-search-icon:disabled {
  cursor: wait;
}

/* 镜片：方形描边（像素风的"圆"） */
.mc-pixel-search-lens {
  position: relative;
  display: block;
  box-sizing: border-box;
  width: 0.78em;
  height: 0.78em;
  border: 2px solid currentColor;
}

/* 手柄：斜 45° 的短棒挂在右下角 */
.mc-pixel-search-handle {
  position: absolute;
  right: -0.28em;
  bottom: -0.28em;
  display: block;
  width: 0.34em;
  height: 2px;
  background: currentColor;
  transform: rotate(45deg);
  transform-origin: left center;
}

.mc-pixel-search-input {
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  background: transparent;
  border: 0;
  outline: none;
  /* 去掉 Safari/Chrome 给 type=search 的默认样式与清除按钮（用我们自己的） */
  appearance: none;
  -webkit-appearance: none;
}

.mc-pixel-search-input::placeholder {
  color: var(--search-hint);
  opacity: 1;
}

.mc-pixel-search-input::-webkit-search-decoration,
.mc-pixel-search-input::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}

.mc-pixel-search-clear {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.2em;
  height: 1.2em;
  padding: 0;
  font-family: inherit;
  font-size: 0.8em;
  line-height: 1;
  color: var(--search-hint);
  background: none;
  border: 0;
  cursor: pointer;
}

.mc-pixel-search-clear:hover {
  color: var(--mc-core-green-3, #6cc349);
}
</style>
