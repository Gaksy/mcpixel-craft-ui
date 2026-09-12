<script setup lang="ts">
/**
 * McPixelPagination —— 像素风分页
 *
 * 结构：`[<]  当前页 / 总页数  [>]    [每页数量 ▾]`
 *
 * - 左右两个正方形小按钮（宽高一致，里面是 < 与 >）
 * - 中间显示 当前页 / 总页数（可选带上总条数）
 * - 右侧每页数量下拉，选项来自 sizeOptions
 * - 颜色优先继承宿主主题变量（--bk-*），没有时回落组件库调色板，深浅主题自适应
 */
import { computed } from "vue";
import type { Appearance } from "../CommonStyleEnum";

defineOptions({ name: "McPixelPagination" });

interface Props {
  /** 当前页（从 1 开始） */
  current?: number;
  /** 每页条数 */
  size?: number;
  /** 总条数 */
  total?: number;
  /** 每页条数可选项 */
  sizeOptions?: number[];
  /** 每页数量后缀文案（如「条/页」） */
  sizeSuffix?: string;
  /** 是否显示总条数（默认只显示 当前页 / 总页数） */
  showTotal?: boolean;
  appearance?: Appearance;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  current: 1,
  size: 10,
  total: 0,
  sizeOptions: () => [10, 20, 50, 100],
  sizeSuffix: "条/页",
  showTotal: false,
  appearance: "dark",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:current", value: number): void;
  (e: "update:size", value: number): void;
  (e: "change"): void;
}>();

/** 总页数（空数据也算 1 页，避免出现 0 / 0） */
const totalPages = computed(() => Math.max(1, Math.ceil((props.total || 0) / Math.max(1, props.size))));
/** 当前页夹在有效区间内，防止外部传进来越界 */
const page = computed(() => Math.min(Math.max(1, props.current), totalPages.value));

const prevDisabled = computed(() => props.disabled || page.value <= 1);
const nextDisabled = computed(() => props.disabled || page.value >= totalPages.value);

function go(target: number) {
  const next = Math.min(Math.max(1, target), totalPages.value);
  if (next === page.value) return;
  emit("update:current", next);
  emit("change");
}

function onSizeChange(event: Event) {
  const next = Number((event.target as HTMLSelectElement).value);
  if (!Number.isFinite(next) || next <= 0 || next === props.size) return;
  emit("update:size", next);
  // 换了每页条数统一回到第 1 页
  emit("update:current", 1);
  emit("change");
}
</script>

<template>
  <div
    class="mc-pixel-pagination"
    :class="`mc-pixel-pagination--appearance-${appearance}`"
  >
    <button
      class="mc-pixel-pagination-btn"
      type="button"
      :disabled="prevDisabled"
      aria-label="上一页"
      @click="go(page - 1)"
    >
      &lt;
    </button>

    <span class="mc-pixel-pagination-info">
      {{ page }} / {{ totalPages }}
      <template v-if="showTotal"> · 共 {{ total }} 条</template>
    </span>

    <button
      class="mc-pixel-pagination-btn"
      type="button"
      :disabled="nextDisabled"
      aria-label="下一页"
      @click="go(page + 1)"
    >
      &gt;
    </button>

    <label class="mc-pixel-pagination-size">
      <select :value="size" :disabled="disabled" @change="onSizeChange">
        <option v-for="option in sizeOptions" :key="option" :value="option">
          {{ option }} {{ sizeSuffix }}
        </option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.mc-pixel-pagination {
  /* 优先用宿主主题变量（后台 --bk-*），没有就回落到组件库调色板 */
  --pg-border: var(--bk-border, var(--mc-core-grey-5, #3d3938));
  --pg-text: var(--bk-text-2, var(--mc-core-grey-2, #d0c5c0));
  --pg-text-dim: var(--bk-text-4, var(--mc-core-grey-4, #6b6562));
  --pg-hover: var(--bk-hover, #fffc70);
  --pg-surface: var(--bk-surface, rgba(255, 255, 255, 0.04));
  --pg-surface-2: var(--bk-surface-2, rgba(255, 255, 255, 0.07));

  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-pixel-12-mono);
  font-size: 12px;
  color: var(--pg-text);
}

.mc-pixel-pagination--appearance-light {
  --pg-border: var(--bk-border, var(--mc-core-grey-2, #d0c5c0));
  --pg-text: var(--bk-text-2, #3d3938);
  --pg-text-dim: var(--bk-text-4, #aba09c);
  --pg-hover: var(--bk-hover, #8a6d00);
  --pg-surface: var(--bk-surface, rgba(38, 36, 35, 0.04));
  --pg-surface-2: var(--bk-surface-2, rgba(38, 36, 35, 0.07));
}

/* 正方形小按钮：宽高一致，里面是 < / > */
.mc-pixel-pagination-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  padding: 0;
  font-family: inherit;
  font-size: 13px;
  line-height: 1;
  color: var(--pg-text);
  cursor: pointer;
  border: 2px solid var(--pg-border);
  border-radius: 0;
  background: var(--pg-surface);
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.mc-pixel-pagination-btn:hover:not(:disabled) {
  color: var(--pg-hover);
  border-color: var(--pg-hover);
}

.mc-pixel-pagination-btn:disabled {
  color: var(--pg-text-dim);
  cursor: not-allowed;
}

.mc-pixel-pagination-info {
  min-width: 5.5em;
  text-align: center;
  white-space: nowrap;
}

.mc-pixel-pagination-size select {
  box-sizing: border-box;
  height: 26px;
  padding: 0 6px;
  font-family: inherit;
  font-size: 12px;
  color: var(--pg-text);
  cursor: pointer;
  border: 2px solid var(--pg-border);
  border-radius: 0;
  background: var(--pg-surface);
  outline: none;
  transition: border-color 0.2s ease;
}

.mc-pixel-pagination-size select:hover,
.mc-pixel-pagination-size select:focus {
  border-color: var(--pg-hover);
}
</style>
