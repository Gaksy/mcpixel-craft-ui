<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref } from "vue";
import type { State, Appearance } from "../CommonStyleEnum";

defineOptions({ name: "McPixelInnerTipsInput" });

interface Props {
  placeholder?: string;
  modelValue?: string | number;
  disabled?: boolean;
  password?: boolean;
  state?: State;
  appearance?: Appearance;
  wait?: boolean;
  /**
   * 透传给内层 <input> 的 autocomplete（如 "username" / "current-password"）。
   *
   * 为什么要透传：浏览器靠它区分字段角色才能正确自动填充；
   * 不给的话属性会落到**根 div** 上，内层 input 是个没有 name 的 text，
   * 浏览器的密码管理器认不出来，只能"随便填"，连带着把焦点抢来抢去。
   */
  autocomplete?: string;
  /** 透传给内层 <input> 的 name（同理，密码管理器会用到） */
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "请输入内容",
  modelValue: "",
  disabled: false,
  password: false,
  appearance: "light",
  state: "general",
  wait: false,
  autocomplete: "",
  name: "",
});

const emits = defineEmits(["update:modelValue", "focus", "blur"]);

const innerLabel = ref<HTMLElement | null>(null);
const innerInput = ref<HTMLInputElement | null>(null);
const container = ref<HTMLElement | null>(null);
const focusedState = ref<boolean>(false);

/** 把焦点从容器转交给内层 input 的定时器（同一时刻只允许有一个） */
let refocusTimer: number | null = null;

/**
 * 容器获焦时把焦点交给内层 input。
 *
 * 关键修复（2026-10-20）：监听是挂在容器上的**捕获阶段**，内层 input 自己获焦也会进到这里。
 * 旧实现无条件排一个「100ms 后再聚焦自己」的定时器，还不清旧的 ——
 * 浏览器自动填充会在 100ms 内依次聚焦两个字段，两边的定时器就互相把焦点抢回去，
 * 表现是登录页用户名和密码框「互抢焦点」，几十毫秒一次永不收敛。
 *
 * 现在：只处理"焦点落在容器本身"的情况（点到了输入框的留白），
 * 并且在真正聚焦前再确认一次焦点没被别处拿走；旧定时器先清掉。
 */
const containerHandleFocus = (event: FocusEvent) => {
  if (props.disabled) return;
  focusedState.value = true;
  if (event && event.target !== container.value) return;
  if (refocusTimer !== null) window.clearTimeout(refocusTimer);
  refocusTimer = window.setTimeout(() => {
    refocusTimer = null;
    const active = document.activeElement;
    // 这 100ms 里用户/浏览器已经把焦点放到别处了，就别抢
    if (active && active !== container.value && active !== document.body) return;
    innerInput.value?.focus({ preventScroll: true });
  }, 100);
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
onUnmounted(() => {
  cleanup?.();
  if (refocusTimer !== null) {
    window.clearTimeout(refocusTimer);
    refocusTimer = null;
  }
});

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
      :autocomplete="autocomplete || undefined"
      :name="name || undefined"
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
  background: var(--mc-core-grey-1);
  color: var(--mc-core-grey-5);
}
.mc-pixel-inner-tips-input--appearance-dark {
  background: var(--mc-core-grey-4);
  color: var(--mc-core-grey-1);
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
