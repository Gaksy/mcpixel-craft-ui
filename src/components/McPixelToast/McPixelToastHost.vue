<script setup lang="ts">
/**
 * McPixelToastHost —— 轻提示的宿主容器（全局只挂一个）
 *
 * 一般不用手写它：`useMcPixelToast()` 第一次被调用时会自己把宿主挂到 body 上。
 * 容器本身 `pointer-events: none` 且固定在顶部，**不遮挡、不阻塞**页面操作；
 * 只有提示条自身可点（点一下立刻关掉）。
 */
import McPixelToast, { type ToastKind } from "./McPixelToast.vue";
import { toastItems, dismissToast } from "./useMcPixelToast";

interface Item {
  id: number;
  kind: ToastKind;
  message: string;
  leaving: boolean;
}

const items = toastItems as unknown as Item[];
</script>

<template>
  <div class="mc-pixel-toast-host" aria-live="polite">
    <McPixelToast
      v-for="item in items"
      :key="item.id"
      :kind="item.kind"
      :message="item.message"
      :leaving="item.leaving"
      @click="dismissToast(item.id)"
    />
  </div>
</template>

<style scoped>
.mc-pixel-toast-host {
  position: fixed;
  top: 16px;
  left: 50%;
  z-index: 12000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transform: translateX(-50%);
  /* 关键：不阻塞界面 */
  pointer-events: none;
}
</style>
