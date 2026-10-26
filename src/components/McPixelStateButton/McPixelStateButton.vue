<script setup lang="ts">
/**
 * McPixelStateButton —— 像素风「状态按钮」
 *
 * 它不是"点一下执行一次"的普通按钮，而是**带开关语义的按钮**：
 * 视觉上用"弹出 / 按下"表达状态，用**外围发光**表达"现在生效中"。
 *
 *   未启用（off）：**弹出** —— 顶边高光、底边硬投影，像一块还没按下去的键帽；无光晕。
 *   已启用（on） ：**按下** —— 整体下沉 3px、四边内凹，外加一圈与色调一致的外围发光。
 *
 * 所以状态一眼可读：**有没有光 = 有没有启用**，不用去猜文字或颜色。
 *
 * 区别：
 *   - `McPixelSwitch`：设置项里的滑动开关（凹槽 + 滑块），适合"配置"。
 *   - `McPixelButton`：执行一次动作，没有持久状态。
 *   - `McPixelStateButton`（本组件）：列表里的筛选项、模式切换、开关型按钮 ——
 *     本质是按钮外形，但要点亮/熄灭，并要求在暗色界面上足够醒目。
 *
 * 用法：
 * ```vue
 * <McPixelStateButton v-model="onlyMine" label="只看我的" />
 * <McPixelStateButton v-model="exact" label="精确匹配" tone="blue" size="small" />
 * <McPixelStateButton :model-value="true" label="已启用" :wait="saving" @change="save" />
 * ```
 */
import { computed, ref } from "vue";
import type { Appearance, Size } from "../CommonStyleEnum";

defineOptions({ name: "McPixelStateButton" });

/** 发光色调：绿=启用/成功，蓝=信息，橙=提醒，红=停用/危险 */
export type StateTone = "green" | "blue" | "orange" | "red";

interface Props {
  modelValue?: boolean;
  /** 文案（也可用默认插槽） */
  label?: string;
  /** 尺寸：small 24 / medium 32 / large 48，与 McPixelButton 同档 */
  size?: Size;
  appearance?: Appearance;
  /** 启用时的发光色调 */
  tone?: StateTone;
  /** 是否显示外围发光（关闭后只剩"按下"的几何形态） */
  glow?: boolean;
  disabled?: boolean;
  /** 提交中：闪烁且不可再点 */
  wait?: boolean;
  /** 通栏（独占一行） */
  block?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  label: "",
  size: "medium",
  appearance: "dark",
  tone: "green",
  glow: true,
  disabled: false,
  wait: false,
  block: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "change", value: boolean): void;
}>();

/** 鼠标正按在上面（还没抬起来）：给一次"压下去"的即时反馈 */
const pressing = ref(false);

const isOn = computed(() => !!props.modelValue);
const isDisabled = computed(() => props.disabled || props.wait);
const sizeClass = computed(() =>
  props.size === "small" ? "is-small" : props.size === "large" ? "is-large" : "is-medium"
);

function onPointerDown() {
  if (isDisabled.value) return;
  pressing.value = true;
}

function onPointerUp() {
  pressing.value = false;
}

function toggle() {
  if (isDisabled.value) return;
  pressing.value = false;
  const next = !isOn.value;
  emit("update:modelValue", next);
  emit("change", next);
}

function onKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return;
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    toggle();
  }
}
</script>

<template>
  <button
    type="button"
    class="mc-pixel-state-btn"
    :class="[
      `mc-pixel-state-btn--appearance-${appearance}`,
      `mc-pixel-state-btn--tone-${tone}`,
      sizeClass,
      {
        'is-on': isOn,
        'is-pressing': pressing,
        'is-disabled': isDisabled,
        'is-wait': wait,
        'is-block': block,
        'has-glow': glow,
      },
    ]"
    role="button"
    :aria-pressed="isOn"
    :disabled="isDisabled"
    @click="toggle"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointerleave="onPointerUp"
    @pointercancel="onPointerUp"
    @keydown="onKeydown"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<style scoped>
.mc-pixel-state-btn {
  /* 跟宿主主题走：后台 --bk-*，前台回落到组件库调色板 */
  --sb-face-top: var(--bk-surface-2, #3a3634);
  --sb-face-bottom: var(--bk-surface-1, #2a2726);
  --sb-border: var(--bk-border, #141312);
  --sb-text: var(--bk-text-2, #d0c5c0);
  --sb-text-on: #fcf5f1;

  /* 三种色调：正面渐变 / 内描边 / 光晕 */
  --sb-on-top: var(--mc-core-green-4, #52a535);
  --sb-on-bottom: var(--mc-core-green-5, #3c8527);
  --sb-glow: 82, 165, 53;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-sizing: border-box;
  padding: 0 12px;
  font-family: var(--font-pixel-12-mono, monospace);
  font-weight: normal;
  letter-spacing: 0.02em;
  color: var(--sb-text);
  background: linear-gradient(180deg, var(--sb-face-top), var(--sb-face-bottom));
  border: 2px solid var(--sb-border);
  border-radius: 0;
  cursor: pointer;
  user-select: none;
  -webkit-appearance: none;
  appearance: none;
  /* 弹出态：顶边高光 + 底边硬投影 + 地面投影（3px，正好是按下时下沉的距离） */
  box-shadow:
    inset 2px 2px 0 rgba(255, 255, 255, 0.16),
    inset -2px -2px 0 rgba(0, 0, 0, 0.45),
    0 3px 0 rgba(0, 0, 0, 0.55);
  transform: translateY(0);
  transition:
    transform 0.08s ease-out,
    box-shadow 0.12s ease-out,
    background-color 0.12s ease-out,
    color 0.12s ease-out;
}

/* ---------- 尺寸：与组件库按钮同档 ---------- */
.is-small {
  height: var(--mc-small-height, 24px);
  padding: 0 10px;
  font-size: var(--mc-small-font-size, 11px);
}

.is-medium {
  height: var(--mc-medium-height, 32px);
  font-size: var(--mc-medium-font-size, 15px);
}

.is-large {
  height: var(--mc-large-height, 48px);
  padding: 0 18px;
  font-size: var(--mc-large-font-size, 17px);
}

.is-block {
  display: flex;
  width: 100%;
}

/* ---------- 色调（决定启用时的正面颜色与光晕） ---------- */
.mc-pixel-state-btn--tone-green {
  --sb-on-top: var(--mc-core-green-4, #52a535);
  --sb-on-bottom: var(--mc-core-green-5, #3c8527);
  --sb-glow: 82, 165, 53;
}

.mc-pixel-state-btn--tone-blue {
  --sb-on-top: #4f7fd8;
  --sb-on-bottom: #3a63ad;
  --sb-glow: 79, 127, 216;
}

.mc-pixel-state-btn--tone-orange {
  --sb-on-top: var(--mc-dungeons-orange-4, #c98a2b);
  --sb-on-bottom: var(--mc-dungeons-orange-5, #a06a17);
  --sb-glow: 201, 138, 43;
}

.mc-pixel-state-btn--tone-red {
  --sb-on-top: #d5533f;
  --sb-on-bottom: #aa3c2b;
  --sb-glow: 213, 83, 63;
}

/* 浅色外观：面更亮、字更深，光晕不变（光晕本来就是"亮起来"） */
.mc-pixel-state-btn--appearance-light {
  --sb-face-top: var(--bk-surface-2, #fcf5f1);
  --sb-face-bottom: var(--bk-surface-1, #ded4cd);
  --sb-border: var(--bk-border, #b8ada5);
  --sb-text: var(--bk-text-2, #3d3938);
}

/* ---------- 交互 ---------- */
.mc-pixel-state-btn:hover:not(.is-disabled):not(.is-on) {
  color: var(--mc-core-green-3, #6cc349);
  box-shadow:
    inset 2px 2px 0 rgba(255, 255, 255, 0.2),
    inset -2px -2px 0 rgba(0, 0, 0, 0.45),
    0 3px 0 rgba(0, 0, 0, 0.55),
    0 0 0 2px rgba(255, 255, 255, 0.06);
}

/* 手指/鼠标按住：先压下去（松手才切换状态） */
.is-pressing:not(.is-disabled) {
  transform: translateY(3px);
  box-shadow:
    inset 2px 2px 0 rgba(0, 0, 0, 0.5),
    inset -2px -2px 0 rgba(255, 255, 255, 0.1),
    0 0 0 rgba(0, 0, 0, 0);
}

/* ---------- 已启用：按下 + 外围发光 ---------- */
.is-on {
  color: var(--sb-text-on);
  background: linear-gradient(180deg, var(--sb-on-top), var(--sb-on-bottom));
  border-color: var(--sb-border);
  /* 下沉 3px（正好吃掉弹出态的 3px 地面投影）+ 四边内凹 */
  transform: translateY(3px);
  box-shadow:
    inset 2px 2px 0 rgba(0, 0, 0, 0.4),
    inset -2px -2px 0 rgba(255, 255, 255, 0.18);
}

/* 光晕单独一层：只在启用且开启 glow 时出现 */
.is-on.has-glow {
  box-shadow:
    inset 2px 2px 0 rgba(0, 0, 0, 0.4),
    inset -2px -2px 0 rgba(255, 255, 255, 0.18),
    0 0 12px 2px rgba(var(--sb-glow), 0.6),
    0 0 26px 6px rgba(var(--sb-glow), 0.26);
}

/* 已启用时再按一下：轻微继续下压，给"能关掉"的反馈 */
.is-on.is-pressing:not(.is-disabled) {
  transform: translateY(4px);
  filter: brightness(0.92);
}

/* 键盘可达：聚焦环用强调色，不抢像素风的硬边 */
.mc-pixel-state-btn:focus-visible {
  outline: 2px solid var(--mc-core-green-3, #6cc349);
  outline-offset: 2px;
}

/* ---------- 禁用 / 等待 ---------- */
.is-disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.is-disabled.has-glow,
.is-disabled.is-on {
  box-shadow:
    inset 2px 2px 0 rgba(0, 0, 0, 0.4),
    inset -2px -2px 0 rgba(255, 255, 255, 0.12);
}

.is-wait {
  cursor: wait;
  animation: mc-pixel-state-wait 1s infinite;
}

@keyframes mc-pixel-state-wait {
  0%,
  100% {
    opacity: 0.85;
  }
  50% {
    opacity: 0.45;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mc-pixel-state-btn {
    transition: none;
  }
  .is-wait {
    animation: none;
  }
}
</style>
