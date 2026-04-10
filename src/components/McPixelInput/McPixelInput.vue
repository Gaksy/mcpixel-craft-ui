<script setup lang="ts">
import type { Variant, Size, State, Appearance } from "../CommonStyleEnum";
import { computed } from "vue";

defineOptions({ name: "McPixelInput" });

// type InputType = "text" | "password" | "email" | "number" | "tel" | "url";

type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week"
  | "color"
  | "file"
  | "range"
  | "checkbox"
  | "radio"
  | "hidden";

interface Props {
  appearance?: Appearance;
  block?: boolean;
  disabled?: boolean;
  size?: Size;
  state?: State;
  type?: InputType;
  variant?: Variant;
  readonly?: boolean;
  placeholder?: string;
  value?: string | number;
  name?: string;
  id?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  accept?: string; // for file input
  multiple?: boolean; // for file input
  checked?: boolean; // for checkbox/radio
  wait?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  appearance: "light",
  block: false,
  disabled: false,
  size: "medium",
  state: "general",
  type: "text",
  variant: "secondary",
  readonly: false,
  placeholder: "",
  value: "",
  name: "",
  id: "",
  required: false,
  min: undefined,
  max: undefined,
  step: undefined,
  accept: "",
  multiple: false,
  checked: false,
  wait: false,
});

const isBlock = computed(() => props.block);
const isDisabled = computed(() => props.disabled || props.wait);
const isReadonly = computed(() => props.readonly);
const isWaiting = computed(() => props.wait);

const emitUpdate = defineEmits<{
  (e: "update:value", value: string | number | boolean): void;
  (e: "change", event: Event): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
  (e: "input", event: Event): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (props.type === "checkbox" || props.type === "radio") {
    emitUpdate("update:value", target.checked);
  } else if (props.type === "number" || props.type === "range") {
    emitUpdate("update:value", target.valueAsNumber || target.value);
  } else {
    emitUpdate("update:value", target.value);
  }

  emitUpdate("input", event);
};

const handleChange = (event: Event) => {
  emitUpdate("change", event);
};

const handleFocus = (event: FocusEvent) => {
  emitUpdate("focus", event);
};

const handleBlur = (event: FocusEvent) => {
  emitUpdate("blur", event);
};

// 特殊类型不需要某些样式类
const isSpecialType = computed(() =>
  ["checkbox", "radio", "color", "file", "range", "hidden"].includes(props.type)
);
</script>

<template>
  <input
    :id="id"
    :name="name"
    :type="type"
    :value="value"
    :checked="checked"
    :placeholder="placeholder"
    :disabled="isDisabled"
    :readonly="isReadonly"
    :required="required"
    :min="min"
    :max="max"
    :step="step"
    :accept="accept"
    :multiple="multiple"
    :class="[
      'mc-pixel-input',
      `mc-pixel-input-size-${size}`,
      `mc-pixel-input-variant-${variant}`,
      `mc-pixel-input-state-${state}`,
      `mc-pixel-input-appearance-${appearance}`,
      {
        'mc-pixel-input-block': isBlock,
        'mc-pixel-input-special': isSpecialType,
        'mc-pixel-input-waiting': isWaiting,
      },
    ]"
    @input="handleInput"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>

<style scoped>
.mc-pixel-input {
  font-family: var(--font-pixel-12-mono);
  position: relative;
  transition: background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  border-radius: 0;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  border-style: solid;
  border-width: 2px;
  font-weight: normal;
  letter-spacing: 0.5px;
  vertical-align: middle;
  box-sizing: border-box;
}

.mc-pixel-input:not(.mc-pixel-input-special) {
  padding-left: 8px;
}

.mc-pixel-input.mc-pixel-input-special {
  all: revert;
  width: auto;
  height: auto;
  min-width: auto;
  min-height: auto;
  padding: 0;
  border: none;
  background: transparent;
}

/* BLOCK */

.mc-pixel-input-block {
  display: block;
  width: 100%;
}

/* APPEARANCE */

.mc-pixel-input.mc-pixel-input-appearance-light {
  color: var(--mc-core-grey-6);
}

.mc-pixel-input.mc-pixel-input-appearance-dark {
  color: var(--mc-core-grey-1);
  background: var(--mc-core-grey-4);
}

/* READONLY */

.mc-pixel-input.mc-pixel-input-appearance-light:read-only {
  background: var(--mc-core-grey-1);
  cursor: default;
}

.mc-pixel-input.mc-pixel-input-appearance-dark:read-only {
  background: var(--mc-core-grey-5);
  cursor: default;
}

/* SIZE SMALL */

.mc-pixel-input-size-small {
  height: var(--mc-small-height);
  min-width: var(--mc-small-width);
  font-size: var(--mc-small-font-size);
}

/* SIZE MEDIUM */

.mc-pixel-input-size-medium {
  height: var(--mc-medium-height);
  min-width: var(--mc-medium-width);
  font-size: var(--mc-medium-font-size);
}

/* SIZE LARGE */

.mc-pixel-input-size-large {
  height: var(--mc-large-height);
  min-width: var(--mc-large-width);
  font-size: var(--mc-large-font-size);
}

/* STATE SUCCESS */

.mc-pixel-input.mc-pixel-input-state-success {
  box-shadow: var(--mc-state-box-shadow-success);
}

/* STATE ERROR */

.mc-pixel-input.mc-pixel-input-state-error {
  box-shadow: var(--mc-state-box-shadow-error);
}

/* STATE WARNING */

.mc-pixel-input.mc-pixel-input-state-warning {
  box-shadow: var(--mc-state-box-shadow-warning);
}

/* STATE SELECTED */

.mc-pixel-input.mc-pixel-input-state-selected {
  box-shadow: var(--mc-state-box-shadow-selected);
}

/* VARIANT GENERAL */

.mc-pixel-input-variant-general {
  border-color: var(--mc-vanilla-grey-5);
  background: transparent;
  color: var(--mc-vanilla-grey-3);
}

.mc-pixel-input-variant-general:hover:not(:disabled) {
  border-color: var(--mc-vanilla-grey-5);
}

.mc-pixel-input-variant-general:focus {
  border-color: var(--mc-vanilla-grey-6);
  box-shadow: 0 0 0 2px var(--mc-vanilla-grey-2);
  outline: none;
}

.mc-pixel-input-variant-general.mc-pixel-input-state-success:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-success);
}

.mc-pixel-input-variant-general.mc-pixel-input-state-error:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-error);
}

.mc-pixel-input-variant-general.mc-pixel-input-state-warning:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-warning);
}

.mc-pixel-input-variant-general.mc-pixel-input-state-selected:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-selected);
}

.mc-pixel-input-variant-general:active:not(:disabled) {
  border-color: var(--mc-vanilla-grey-6);
}

/* VARIANT PRIMARY */

.mc-pixel-input-variant-primary {
  border-color: var(--mc-vanilla-blue-6);
  background: transparent;
  color: var(--mc-core-grey-5);
}

.mc-pixel-input-variant-primary:hover:not(:disabled) {
  border-color: var(--mc-vanilla-blue-5);
}

.mc-pixel-input-variant-primary:focus {
  border-color: var(--mc-vanilla-blue-6);
  box-shadow: 0 0 0 2px var(--mc-vanilla-blue-2);
  outline: none;
}

.mc-pixel-input-variant-primary.mc-pixel-input-state-success:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-success);
}

.mc-pixel-input-variant-primary.mc-pixel-input-state-error:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-error);
}

.mc-pixel-input-variant-primary.mc-pixel-input-state-warning:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-warning);
}

.mc-pixel-input-variant-primary.mc-pixel-input-state-selected:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-selected);
}

.mc-pixel-input-variant-primary:active:not(:disabled) {
  border-color: var(--mc-vanilla-blue-6);
}

/* VARIANT SECONDARY */

.mc-pixel-input-variant-secondary {
  border-color: var(--mc-core-green-6);
  background: transparent;
  color: var(--mc-core-grey-5);
}

.mc-pixel-input-variant-secondary:hover:not(:disabled) {
  border-color: var(--mc-core-green-5);
}

.mc-pixel-input-variant-secondary:focus {
  border-color: var(--mc-core-green-6);
  box-shadow: 0 0 0 2px var(--mc-core-green-2);
  outline: none;
}

.mc-pixel-input-variant-secondary.mc-pixel-input-state-success:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-success);
}

.mc-pixel-input-variant-secondary.mc-pixel-input-state-error:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-error);
}

.mc-pixel-input-variant-secondary.mc-pixel-input-state-warning:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-warning);
}

.mc-pixel-input-variant-secondary.mc-pixel-input-state-selected:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-selected);
}

.mc-pixel-input-variant-secondary:active:not(:disabled) {
  border-color: var(--mc-core-green-6);
}

/* VARIANT DANGER */

.mc-pixel-input-variant-danger {
  border-color: var(--mc-dungeons-orange-6);
  background: transparent;
  color: var(--mc-core-grey-5);
}

.mc-pixel-input-variant-danger:hover:not(:disabled) {
  border-color: var(--mc-dungeons-orange-5);
}

.mc-pixel-input-variant-danger:focus {
  border-color: var(--mc-dungeons-orange-6);
  box-shadow: 0 0 0 2px var(--mc-dungeons-orange-2);
  outline: none;
}

.mc-pixel-input-variant-danger.mc-pixel-input-state-success:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-success);
}

.mc-pixel-input-variant-danger.mc-pixel-input-state-error:hover:not(:disabled) {
  box-shadow: var(--mc-focused-state-box-shadow-error);
}

.mc-pixel-input-variant-danger.mc-pixel-input-state-warning:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-warning);
}

.mc-pixel-input-variant-danger.mc-pixel-input-state-selected:hover:not(
    :disabled
  ) {
  box-shadow: var(--mc-focused-state-box-shadow-selected);
}

.mc-pixel-input-variant-danger:active:not(:disabled) {
  border-color: var(--mc-dungeons-orange-6);
}

/* DISABLED */

.mc-pixel-input.mc-pixel-input-appearance-light:disabled {
  cursor: not-allowed;
  color: white;
  background-color: var(--mc-core-grey-3);
}
.mc-pixel-input.mc-pixel-input-appearance-dark:disabled {
  cursor: not-allowed;
  background-color: var(--mc-core-grey-5);
}

/* WAIT */

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

.mc-pixel-input.mc-pixel-input-waiting {
  animation: mc-pixel-wait-flash 1s infinite;
  cursor: wait;
  pointer-events: none;
}
</style>
