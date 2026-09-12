<script setup lang="ts">
import type { State, Appearance } from "../CommonStyleEnum";
import { computed } from "vue";

defineOptions({ name: "McPixelCard" });

interface Props {
  appearance?: Appearance;
  state?: State;
}

const props = withDefaults(defineProps<Props>(), {
  appearance: "light",
  state: "general",
});

const className = computed(() => [
  "mc-pixel-card",
  `mc-pixel-card-appearance-${props.appearance}`,
  `mc-pixel-card-state-${props.state}`,
]);
</script>

<template>
  <div :class="className">
    <slot />
  </div>
</template>

<style scoped>
.mc-pixel-card {
  font-family: var(--font-pixel-12-mono);
  border-style: solid;
  border-width: 2px;
  border-radius: 0;
  padding: 12px;
  transition: box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.mc-pixel-card-appearance-light {
  /* 优先用宿主主题变量（后台 --bk-*）：卡片应该是「比页面底色亮一档的面」，
     直接写死调色板会在深色后台里变成一块灰板，看着像 disabled */
  color: var(--bk-text-1, var(--mc-core-grey-6));
  background-color: var(--bk-bg-sidebar, var(--mc-core-grey-1));
  border-color: var(--bk-border, var(--mc-core-grey-6));
}

.mc-pixel-card-appearance-dark {
  color: var(--bk-text-1, var(--mc-core-grey-1));
  background-color: var(--bk-bg-sidebar, var(--mc-core-grey-5));
  border-color: var(--bk-border, var(--mc-core-grey-4));
}

.mc-pixel-card-state-success {
  box-shadow: var(--mc-state-box-shadow-success);
}

.mc-pixel-card-state-error {
  box-shadow: var(--mc-state-box-shadow-error);
}

.mc-pixel-card-state-warning {
  box-shadow: var(--mc-state-box-shadow-warning);
}

.mc-pixel-card-state-selected {
  box-shadow: var(--mc-state-box-shadow-selected);
}

/* success hover */
.mc-pixel-card-state-success:hover {
  box-shadow: var(--mc-focused-state-box-shadow-success);
}

/* error hover */
.mc-pixel-card-state-error:hover {
  box-shadow: var(--mc-focused-state-box-shadow-error);
}

/* warning hover */
.mc-pixel-card-state-warning:hover {
  box-shadow: var(--mc-focused-state-box-shadow-warning);
}

/* selected hover */
.mc-pixel-card-state-selected:hover {
  box-shadow: var(--mc-focused-state-box-shadow-selected);
}
</style>
