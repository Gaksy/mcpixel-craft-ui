<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref } from "vue";
import type { Variant, State, Appearance } from "../CommonStyleEnum";

defineOptions({ name: "McPixelInnerTipsInput" });

interface Props {
  placeholder?: string;
  modelValue?: string | number;
  disabled?: boolean;
  password?: boolean;
  variant?: Variant;
  state?: State;
  appearance?: Appearance;
  wait?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "请输入内容",
  modelValue: "",
  disabled: false,
  password: false,
  appearance: "light",
  variant: "primary",
  state: "general",
  wait: false,
});

const emits = defineEmits(["update:modelValue", "focus", "blur"]);

const innerLabel = ref<HTMLElement | null>(null);
const innerInput = ref<HTMLInputElement | null>(null);
const container = ref<HTMLElement | null>(null);
const focusedState = ref<boolean>(false);

const containerHandleFocus = () => {
  if (props.disabled) return;
  focusedState.value = true;
  setTimeout(() => innerInput.value?.focus({ preventScroll: true }), 100);
};
const containerHandleBlur = () => {
  if (props.disabled) return;
  focusedState.value = !!props.modelValue;
};

const innerInputHandleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emits("update:modelValue", target.value);
};
const innerInputHandleFocus = (event: FocusEvent) => {
  focusedState.value = true;
  emits("focus", event);
};
const innerInputHandleBlur = (event: FocusEvent) => {
  emits("blur", event);
};

let cleanup: (() => void) | null = null;
onMounted(() => {
  cleanup = setupInputContainerListeners(
    containerHandleFocus,
    containerHandleBlur,
    container
  );
});
onUnmounted(() => cleanup?.());

function setupInputContainerListeners(
  onFocus: (event: FocusEvent) => void,
  onBlur: (event: FocusEvent) => void,
  containerRef: Ref<HTMLElement | null> | HTMLElement
): () => void {
  const el =
    containerRef instanceof HTMLElement ? containerRef : containerRef.value;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  if (!el) return () => {};

  el.addEventListener("focus", onFocus, true);
  el.addEventListener("blur", onBlur, true);

  return () => {
    el.removeEventListener("focus", onFocus, true);
    el.removeEventListener("blur", onBlur, true);
  };
}
</script>

<template>
  <div
    ref="container"
    class="mc-pixel-inner-tips-input-container"
    :class="[
      `mc-pixel-inner-tips-input--variant-${variant}`,
      `mc-pixel-inner-tips-input--appearance-${appearance}`,
      `mc-pixel-inner-tips-input--state-${state}`,
      focusedState ? 'mc-pixel-inner-tips-input--focused' : '',
      disabled ? 'mc-pixel-inner-tips-input--disabled' : '',
      wait ? 'mc-pixel-inner-tips-input--wait' : '',
    ]"
    tabindex="0"
  >
    <label
      ref="innerLabel"
      class="mc-pixel-inner-tips-input-label"
      :class="[
        focusedState ? 'mc-pixel-inner-tips-input-label--focused' : '',
        disabled ? 'mc-pixel-inner-tips-input-label--disabled' : '',
      ]"
    >
      {{ placeholder }}
    </label>

    <input
      ref="innerInput"
      class="mc-pixel-inner-tips-input-input"
      :class="[`mc-pixel-inner-tips-input--appearance-${appearance}`]"
      :type="password ? 'password' : 'text'"
      :value="modelValue"
      :disabled="disabled"
      @input="innerInputHandleInput"
      @focus="innerInputHandleFocus"
      @blur="innerInputHandleBlur"
    />
  </div>
</template>

<style scoped>
/* ---------------- Container ---------------- */
.mc-pixel-inner-tips-input-container {
  border-left: var(--mc-core-grey-6) solid 2px;
  border-bottom: var(--mc-core-grey-6) solid 2px;
  border-top: var(--mc-core-grey-4) solid 2px;
  border-right: var(--mc-core-grey-4) solid 2px;
  width: var(--mc-large-width);
  height: var(--mc-large-height);
  transition: box-shadow 0.2s;
  font-family: var(--font-pixel-12-mono);
  overflow: hidden;
}

/* ---------------- Label ---------------- */
.mc-pixel-inner-tips-input-label {
  display: flex;
  align-items: center;
  height: var(--mc-large-height);
  padding-left: 15px;
  transition: font-size 0.3s ease, padding-top 0.3s ease, padding-left 0.3s ease,
    height 0.3s ease;
}

.mc-pixel-inner-tips-input-label--focused {
  font-size: var(--mc-small-font-size);
  height: 20px;
  padding-top: 4px;
  padding-left: 10px;
}

/* ---------------- Input ---------------- */
.mc-pixel-inner-tips-input-input {
  border: none;
  outline: none;
  width: 90%;
  font-size: var(--mc-medium-font-size);
  padding-left: 10px;
  font-family: var(--font-pixel-12-mono);
  background: transparent; /* 透明，显示容器背景 */
  color: inherit; /* 字体颜色继承容器 */
}

/* ---------------- Appearance ---------------- */
.mc-pixel-inner-tips-input--appearance-light {
  background: inherit;
  color: var(--mc-core-grey-5);
}
.mc-pixel-inner-tips-input--appearance-dark {
  background: inherit;
  color: var(--mc-core-grey-6);
}

/* ---------------- Disabled ---------------- */
.mc-pixel-inner-tips-input--disabled {
  cursor: not-allowed;
  background: var(--mc-core-grey-5) !important;
  color: var(--mc-core-grey-4) !important;
}
.mc-pixel-inner-tips-input-input:disabled {
  background: var(--mc-core-grey-5);
  color: var(--mc-core-grey-4);
  cursor: not-allowed;
}

/* ---------------- Variant ---------------- */
.mc-pixel-inner-tips-input--variant-primary {
  background: #e5f0ff;
}
.mc-pixel-inner-tips-input--variant-secondary {
  background: #ebffe9;
}
.mc-pixel-inner-tips-input--variant-danger {
  background: #fdebe1;
}
.mc-pixel-inner-tips-input--variant-general {
  background: #f0f0f0; /* 或者你希望的灰色 */
}

/* ---------------- State ---------------- */
.mc-pixel-inner-tips-input--state-success {
  box-shadow: var(--mc-state-box-shadow-success);
}
.mc-pixel-inner-tips-input--state-success.mc-pixel-inner-tips-input--focused {
  box-shadow: var(--mc-focused-state-box-shadow-success);
}

.mc-pixel-inner-tips-input--state-error {
  box-shadow: var(--mc-state-box-shadow-error);
}
.mc-pixel-inner-tips-input--state-error.mc-pixel-inner-tips-input--focused {
  box-shadow: var(--mc-focused-state-box-shadow-error);
}

.mc-pixel-inner-tips-input--state-warning {
  box-shadow: var(--mc-state-box-shadow-warning);
}
.mc-pixel-inner-tips-input--state-warning.mc-pixel-inner-tips-input--focused {
  box-shadow: var(--mc-focused-state-box-shadow-warning);
}

.mc-pixel-inner-tips-input--state-selected {
  box-shadow: var(--mc-state-box-shadow-selected);
}
.mc-pixel-inner-tips-input--state-selected.mc-pixel-inner-tips-input--focused {
  box-shadow: var(--mc-focused-state-box-shadow-selected);
}

/* default = general */
.mc-pixel-inner-tips-input--state-general {
  box-shadow: var(--mc-focused-box-shadow-black-deep);
}
.mc-pixel-inner-tips-input--state-general.mc-pixel-inner-tips-input--focused {
  box-shadow: var(--mc-focused-box-shadow-black);
}

/* ---------------- Wait Animation ---------------- */
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

.mc-pixel-inner-tips-input--wait {
  animation: mc-pixel-wait-flash 1s infinite;
  cursor: wait;
  pointer-events: none;
}
</style>
