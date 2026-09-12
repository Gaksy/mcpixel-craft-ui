<script setup lang="ts">
import type { Variant, Size, State, Appearance } from "../CommonStyleEnum";
import { computed } from "vue";

defineOptions({ name: "McPixelButton" });

type ButtonType = "button" | "submit" | "reset";

interface Props {
  appearance?: Appearance;
  block?: boolean;
  disabled?: boolean;
  size?: Size;
  state?: State;
  type?: ButtonType;
  variant?: Variant;
  wait?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  appearance: "light",
  block: false,
  disabled: false,
  size: undefined, // 默认为 undefined，表示不指定尺寸
  state: "general",
  type: "button",
  variant: "secondary",
  wait: false,
});

const isBlock = computed(() => props.block);
const isWaiting = computed(() => props.wait);
const isDisabled = computed(() => props.disabled || props.wait);
const emitClick = defineEmits<{ (e: "click", event: MouseEvent): void }>();
const handleClick = (event: MouseEvent) =>
  !isDisabled.value && !isWaiting.value && emitClick("click", event);
</script>

<template>
  <button
    :class="[
      'mc-pixel-button',
      // 只有指定了 size 才添加尺寸类，否则自动撑开
      size && `mc-pixel-button-size-${size}`,
      `mc-pixel-button-variant-${variant}`,
      `mc-pixel-button-state-${state}`,
      `mc-pixel-button-appearance-${appearance}`,
      {
        'mc-pixel-button-waiting': isWaiting,
        'mc-pixel-button-block': isBlock,
      },
    ]"
    :disabled="isDisabled"
    :type="type"
    @click="handleClick"
  >
    <div class="mc-pixel-button-slot">
      <slot></slot>
    </div>
  </button>
</template>

<style scoped>
.mc-pixel-button {
  font-family: var(--font-pixel-12-mono);
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease,
    color 0.3s ease;
  border-radius: 0;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  border-style: solid;
  border-width: 2px;
  font-weight: bold;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  user-select: none;
  /* 未指定 size 时，使用内边距保证基本美观（有 size 的会把 padding 归零按固定高度） */
  padding: 6px 12px;
}
.mc-pixel-button.mc-pixel-button-appearance-light {
  color: var(--mc-core-grey-6);
}
.mc-pixel-button.mc-pixel-button-appearance-dark {
  color: var(--mc-core-grey-6);

}

.mc-pixel-button-slot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  /* 文案与按钮左右边缘至少留 5px，长文案也不会贴着描边 */
  padding: 0 5px;
}

/* block：独占一行（之前只有类名没有规则，只有父容器是 flex 拉伸时才像通栏） */
.mc-pixel-button.mc-pixel-button-block {
  display: flex;
  width: 100%;
}

/* SIZE SMALL - 只有指定 size 时才应用固定宽高 */
.mc-pixel-button-size-small {
  height: var(--mc-small-height);
  min-width: var(--mc-small-width);
  font-size: var(--mc-small-font-size);
  padding: 0;
}

/* SIZE MEDIUM */
.mc-pixel-button-size-medium {
  height: var(--mc-medium-height);
  min-width: var(--mc-medium-width);
  font-size: var(--mc-medium-font-size);
  padding: 0;
}

/* SIZE LARGE */
.mc-pixel-button-size-large {
  height: var(--mc-large-height);
  min-width: var(--mc-large-width);
  font-size: var(--mc-large-font-size);
  padding: 0;
}

/* STATE SUCCESS */
.mc-pixel-button.mc-pixel-button-state-success:not(:hover) {
  box-shadow: var(--mc-state-box-shadow-success);
}

/* STATE ERROR */
.mc-pixel-button.mc-pixel-button-state-error:not(:hover) {
  box-shadow: var(--mc-state-box-shadow-error);
}

/* STATE WARNING */
.mc-pixel-button.mc-pixel-button-state-warning:not(:hover) {
  box-shadow: var(--mc-state-box-shadow-warning);
}

/* STATE SELECTED */
.mc-pixel-button.mc-pixel-button-state-selected:not(:hover) {
  box-shadow: var(--mc-state-box-shadow-selected);
}

/* VARIANT GENERAL */
.mc-pixel-button-variant-general {
  background: var(
    --mc-core-gradient-light-grey,
    linear-gradient(145deg, #e8e8e8, #888d95)
  );
  border-color: var(--mc-vanilla-blue-6);
  color: var(--mc-core-grey-6);
}

.mc-pixel-button.mc-pixel-button-variant-general:hover:not(:disabled) {
  background: var(--mc-core-grey-1);
  color: var(--mc-core-grey-6);
  box-shadow: var(--mc-focused-box-shadow-black);
}

.mc-pixel-button.mc-pixel-button-variant-general.mc-pixel-button-state-success:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-success);
}

.mc-pixel-button.mc-pixel-button-variant-general.mc-pixel-button-state-error:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-error);
}

.mc-pixel-button.mc-pixel-button-variant-general.mc-pixel-button-state-warning:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-warning);
}

.mc-pixel-button.mc-pixel-button-variant-general.mc-pixel-button-state-selected:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-selected);
}

.mc-pixel-button.mc-pixel-button-variant-general:active:not(:disabled) {
  background: var(--mc-core-grey-2);
}

/* VARIANT PRIMARY */
.mc-pixel-button-variant-primary {
  background: var(
    --mc-core-gradient-blue,
    linear-gradient(145deg, #4a6fa5, #2a4f8c)
  );
  border-color: var(--mc-vanilla-blue-6);
  color: var(--mc-core-grey-6);
}

.mc-pixel-button.mc-pixel-button-variant-primary:hover:not(:disabled) {
  background: var(--mc-vanilla-blue-1);
  color: var(--mc-legends-dark-blue-6);
  box-shadow: var(--mc-focused-box-shadow-black);
}

.mc-pixel-button.mc-pixel-button-variant-primary.mc-pixel-button-state-success:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-success);
}

.mc-pixel-button.mc-pixel-button-variant-primary.mc-pixel-button-state-error:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-error);
}

.mc-pixel-button.mc-pixel-button-variant-primary.mc-pixel-button-state-warning:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-warning);
}

.mc-pixel-button.mc-pixel-button-variant-primary.mc-pixel-button-state-selected:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-selected);
}

.mc-pixel-button.mc-pixel-button-variant-primary:active:not(:disabled) {
  background: var(--mc-vanilla-blue-2);
}

/* VARIANT SECONDARY */
.mc-pixel-button-variant-secondary {
  background: var(
    --mc-core-gradient-green,
    linear-gradient(145deg, #4caf50, #2a641c)
  );
  border-color: var(--mc-core-green-6);
  color: var(--mc-core-grey-5);
}

.mc-pixel-button.mc-pixel-button-variant-secondary:hover:not(:disabled) {
  background: var(--mc-core-green-2);
  color: var(--mc-legends-dark-blue-6);
  box-shadow: var(--mc-focused-box-shadow-black);
}

.mc-pixel-button.mc-pixel-button-variant-secondary.mc-pixel-button-state-success:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-success);
}

.mc-pixel-button.mc-pixel-button-variant-secondary.mc-pixel-button-state-error:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-error);
}

.mc-pixel-button.mc-pixel-button-variant-secondary.mc-pixel-button-state-warning:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-warning);
}

.mc-pixel-button.mc-pixel-button-variant-secondary.mc-pixel-button-state-selected:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-selected);
}

.mc-pixel-button.mc-pixel-button-variant-secondary:active:not(:disabled) {
  background: var(--mc-core-green-3);
}

/* VARIANT DANGER */
.mc-pixel-button-variant-danger {
  background: var(--mc-core-gradient-orange, linear-gradient());
  border-color: var(--mc-dungeons-orange-6);
  color: var(--mc-core-grey-5);
}

.mc-pixel-button.mc-pixel-button-variant-danger:hover:not(:disabled) {
  background: var(--mc-dungeons-orange-4);
  color: var(--mc-legends-dark-blue-6);
  box-shadow: var(--mc-focused-box-shadow-black);
}

.mc-pixel-button.mc-pixel-button-variant-danger.mc-pixel-button-state-success:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-success);
}

.mc-pixel-button.mc-pixel-button-variant-danger.mc-pixel-button-state-error:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-error);
}

.mc-pixel-button.mc-pixel-button-variant-danger.mc-pixel-button-state-warning:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-warning);
}

.mc-pixel-button.mc-pixel-button-variant-danger.mc-pixel-button-state-selected:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-selected);
}

.mc-pixel-button.mc-pixel-button-variant-danger:active:not(:disabled) {
  background: var(--mc-dungeons-orange-5);
}

/* EVENT */
.mc-pixel-button:active:not(:disabled) {
  transform: translateY(2px);
}
.mc-pixel-button:disabled {
  color: var(--mc-core-grey-2);
  cursor: not-allowed;
}
.mc-pixel-button.mc-pixel-button-variant-primary:disabled {
  background: var(--mc-legends-dark-blue-5);
}
.mc-pixel-button.mc-pixel-button-variant-secondary:disabled {
  background: var(--mc-core-green-6);
}
.mc-pixel-button.mc-pixel-button-variant-danger:disabled {
  background: var(--mc-dungeons-orange-6);
}
.mc-pixel-button:focus-visible {
  outline: 2px solid var(--mc-core-grey-6);
  outline-offset: 2px;
  border-radius: 0;
}

@keyframes mc-pixel-wait-flash {
  0% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(0.6);
  }
  100% {
    filter: brightness(1);
  }
}

.mc-pixel-button.mc-pixel-button-waiting {
  animation: mc-pixel-wait-flash 1s infinite;
  cursor: wait;
  pointer-events: none;
}
</style>
