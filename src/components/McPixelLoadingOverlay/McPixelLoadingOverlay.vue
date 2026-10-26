<script setup lang="ts">
/**
 * McPixelLoadingOverlay —— 全屏加载遮罩（像素风）
 *
 * 用途：一个"**会重排整页内容**"的操作正在进行时（换筛选条件、切搜索模式、整页刷新），
 * 让用户明确知道"现在整页都在忙"，同时把背景**模糊 + 调暗**，压掉背后还在跳动的旧内容，
 * 视觉上更安静 —— 站长口径：加载中要给全屏一个模糊效果并调暗背景。
 *
 * 特点：
 * - 平滑进出（opacity + scale 的 0.22s ease），不是硬闪；
 * - 进度条是**缓动的往返滑动**（ease-in-out），看起来像在"呼吸"，不会有卡帧感；
 * - `Teleport` 到 body：不受父级 transform/overflow 影响（本站全局弹窗的约定）；
 * - `prefers-reduced-motion` 下不滑动、不缩放，只留静态提示。
 *
 * 用法：
 * ```vue
 * <McPixelLoadingOverlay :visible="busy" text="搜索中…" />
 * <!-- 需要自定义加载内容时用插槽 -->
 * <McPixelLoadingOverlay :visible="busy"><BlockSpinner /></McPixelLoadingOverlay>
 * ```
 */
import { computed } from "vue";

defineOptions({ name: "McPixelLoadingOverlay" });

interface Props {
  /** 是否显示 */
  visible?: boolean;
  /** 文案（可留空；也可以用默认插槽完全自定义） */
  text?: string;
  /** 背景模糊强度（px），0 = 不模糊 */
  blur?: number;
  /** 背景压暗强度（0–1） */
  dim?: number;
  /** 层级（要盖住页面上的抽屉 / 悬浮卡，但低于全局轻提示） */
  zIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  text: "",
  blur: 6,
  dim: 0.45,
  zIndex: 11000,
});

const layerStyle = computed(() => ({
  zIndex: String(props.zIndex),
  "--mc-loading-blur": `${Math.max(0, props.blur)}px`,
  "--mc-loading-dim": String(Math.min(1, Math.max(0, props.dim))),
}));
</script>

<template>
  <Teleport to="body">
    <Transition name="mc-pixel-loading">
      <div v-if="visible" class="mc-pixel-loading" :style="layerStyle" role="status" aria-live="polite">
        <div class="mc-pixel-loading-panel">
          <slot>
            <!-- 默认加载指示：缓动往返滑动的像素进度条 -->
            <span class="mc-pixel-loading-track" aria-hidden="true">
              <span class="mc-pixel-loading-fill" />
            </span>
            <span v-if="text" class="mc-pixel-loading-text">{{ text }}</span>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mc-pixel-loading {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 关键：模糊 + 调暗背景（前缀交给构建按目标浏览器补） */
  background: rgba(8, 7, 6, var(--mc-loading-dim, 0.45));
  backdrop-filter: blur(var(--mc-loading-blur, 6px));
  /* 遮罩本身不参与布局，只挡交互 */
  cursor: progress;
}

.mc-pixel-loading-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  min-width: 200px;
  padding: 20px 26px;
  background: var(--bk-bg-modal, rgba(38, 36, 35, 0.92));
  border: 2px solid var(--bk-border, var(--mc-core-grey-5, #3d3938));
  border-radius: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.25);
  color: var(--bk-text-1, var(--mc-core-off-white, #fcf5f1));
  font-family: var(--font-pixel-12-mono, monospace);
  font-size: 13px;
}

/* ---------- 默认进度条：轨道 + 缓动滑动的绿块 ---------- */
.mc-pixel-loading-track {
  position: relative;
  display: block;
  box-sizing: border-box;
  width: 168px;
  height: 10px;
  overflow: hidden;
  background: var(--mc-core-grey-7, #1d1c1b);
  border: 2px solid var(--bk-border, var(--mc-core-grey-5, #3d3938));
}

.mc-pixel-loading-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 42%;
  background: var(--mc-core-green-4, #52a535);
  /* ease-in-out 让来回滑动有加减速，观感更顺 */
  animation: mc-pixel-loading-sweep 1.15s ease-in-out infinite;
  will-change: transform;
}

@keyframes mc-pixel-loading-sweep {
  0% {
    transform: translateX(-105%);
  }
  50% {
    transform: translateX(140%);
  }
  100% {
    transform: translateX(-105%);
  }
}

.mc-pixel-loading-text {
  letter-spacing: 0.04em;
  opacity: 0.92;
}

/* ---------- 进出场：淡入 + 轻微缩放 ---------- */
.mc-pixel-loading-enter-active,
.mc-pixel-loading-leave-active {
  transition: opacity 0.22s ease;
}

.mc-pixel-loading-enter-active .mc-pixel-loading-panel,
.mc-pixel-loading-leave-active .mc-pixel-loading-panel {
  transition: transform 0.22s ease, opacity 0.22s ease;
}

.mc-pixel-loading-enter-from,
.mc-pixel-loading-leave-to {
  opacity: 0;
}

.mc-pixel-loading-enter-from .mc-pixel-loading-panel,
.mc-pixel-loading-leave-to .mc-pixel-loading-panel {
  transform: scale(0.96);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .mc-pixel-loading-fill {
    animation: none;
    width: 100%;
  }
  .mc-pixel-loading-enter-active,
  .mc-pixel-loading-leave-active,
  .mc-pixel-loading-enter-active .mc-pixel-loading-panel,
  .mc-pixel-loading-leave-active .mc-pixel-loading-panel {
    transition: none;
  }
}
</style>
