<script setup lang="ts">
/**
 * McPixelTable —— 像素风数据表格
 *
 * 设计要点：
 * - 直角 + 2px 描边，表头用一层浅底区分，行 hover 有提示色
 * - 颜色全部走 CSS 变量，优先继承宿主主题（后台的 --bk-*），
 *   没有时回落到组件库调色板（--mc-core-*），因此天然支持浅色/深色
 * - 列由 columns 配置，单元格可用同名插槽自定义（`#<key>="{ row, value }"`），
 *   操作列约定 `key: "actions"` + `#actions` 插槽
 * - 空数据 / 加载中都有占位行
 */
import { computed } from "vue";
import type { Appearance } from "../CommonStyleEnum";
import type { TableColumn } from "./types";

defineOptions({ name: "McPixelTable" });

interface Props {
  columns: TableColumn[];
  rows: Array<Record<string, unknown>>;
  /** 行 key 字段名，默认 "id" */
  rowKey?: string;
  appearance?: Appearance;
  loading?: boolean;
  emptyText?: string;
  /** 是否显示行 loading 骨架（loading 为 true 时生效） */
  loadingText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: "id",
  appearance: "dark",
  loading: false,
  emptyText: "暂无数据",
  loadingText: "加载中...",
});

const cols = computed(() => props.columns ?? []);

function keyOf(row: Record<string, unknown>, index: number): string | number {
  const value = row?.[props.rowKey];
  return (value as string | number) ?? index;
}

function cellStyle(col: TableColumn) {
  return {
    width: col.width,
    textAlign: col.align ?? "left",
    fontFamily: col.mono ? "var(--font-pixel-12-mono)" : undefined,
  };
}
</script>

<template>
  <div class="mc-pixel-table-wrap" :class="`mc-pixel-table--appearance-${appearance}`">
    <table class="mc-pixel-table">
      <thead>
        <tr>
          <th v-for="col in cols" :key="col.key" :style="cellStyle(col)">{{ col.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td class="mc-pixel-table-empty" :colspan="cols.length">{{ loadingText }}</td>
        </tr>
        <tr v-else-if="rows.length === 0">
          <td class="mc-pixel-table-empty" :colspan="cols.length">
            <slot name="empty">{{ emptyText }}</slot>
          </td>
        </tr>
        <tr v-for="(row, index) in rows" v-else :key="keyOf(row, index)">
          <td v-for="col in cols" :key="col.key" :style="cellStyle(col)">
            <slot
              :name="col.key"
              :row="row"
              :value="row[col.key]"
              :index="index"
            >{{ row[col.key] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.mc-pixel-table-wrap {
  /* 优先用宿主主题变量（后台 --bk-*），没有就回落到组件库调色板 */
  --t-border: var(--bk-border, var(--mc-core-grey-5, #3d3938));
  --t-border-soft: var(--bk-border-soft, rgba(255, 255, 255, 0.07));
  --t-text-1: var(--bk-text-1, var(--mc-core-off-white, #fcf5f1));
  --t-text-3: var(--bk-text-3, var(--mc-core-grey-3, #aba09c));
  --t-text-4: var(--bk-text-4, var(--mc-core-grey-4, #6b6562));
  --t-head-bg: var(--bk-surface-2, rgba(255, 255, 255, 0.07));
  --t-row-hover: var(--bk-surface, rgba(255, 255, 255, 0.04));
  --t-bg: transparent;

  box-sizing: border-box;
  width: 100%;
  overflow-x: auto;
  border: 2px solid var(--t-border);
  background: var(--t-bg);
  font-family: var(--font-pixel-12-mono);
}

/* 浅色外观在没有宿主主题变量时用一套浅色底 */
.mc-pixel-table--appearance-light {
  --t-border: var(--bk-border, var(--mc-core-grey-2, #d0c5c0));
  --t-border-soft: var(--bk-border-soft, rgba(38, 36, 35, 0.08));
  --t-text-1: var(--bk-text-1, var(--mc-core-grey-6, #262423));
  --t-text-3: var(--bk-text-3, #6b6562);
  --t-text-4: var(--bk-text-4, #aba09c);
  --t-head-bg: var(--bk-surface-2, rgba(38, 36, 35, 0.06));
  --t-row-hover: var(--bk-surface, rgba(38, 36, 35, 0.04));
}

.mc-pixel-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  color: var(--t-text-1);
}

.mc-pixel-table th,
.mc-pixel-table td {
  box-sizing: border-box;
  padding: 10px 12px;
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid var(--t-border-soft);
}

.mc-pixel-table th {
  font-weight: normal;
  font-size: 12px;
  letter-spacing: 0.05em;
  color: var(--t-text-3);
  background: var(--t-head-bg);
  border-bottom: 2px solid var(--t-border);
}

.mc-pixel-table tbody tr {
  transition: background-color 0.18s ease;
}

.mc-pixel-table tbody tr:hover {
  background: var(--t-row-hover);
}

.mc-pixel-table tbody tr:last-child td {
  border-bottom: none;
}

.mc-pixel-table-empty {
  padding: 28px 12px;
  text-align: center;
  color: var(--t-text-4);
}
</style>
