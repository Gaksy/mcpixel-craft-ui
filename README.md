# McPixel Craft UI

像素风（Minecraft 风格）Vue 3 组件库：直角描边、像素字体、草方块绿配色，内置浅色 / 深色两套外观。

**在线示例与文档：<https://www.inception.work/mcpixel-ui>**

每个组件都有「基础用法 / 状态 / 尺寸」演示块、可展开源码和 API 表，右上角可整页切换浅色 / 深色。

当前版本 **0.7.0** · 需要 Vue **3.5+** · 无运行时依赖（只在 peerDependencies 里依赖 `vue`）

## 组件一览

| 组件 | 说明 |
|------|------|
| `McPixelButton` | 按钮：4 种 variant × 5 种 state × 3 种尺寸，支持 block / wait |
| `McPixelInput` | 输入框：state、尺寸、密码、只读、数字等 |
| `McPixelInnerTipsInput` | 带内嵌提示区的输入框（登录 / 注册页那种） |
| `McPixelCheckbox` | 多选框：支持半选（indeterminate）、紧凑模式、插槽文案 |
| `McPixelSwitch` | 开关滑块：左右切换，关闭「–」/ 开启「O」，开启时凹槽变草绿 |
| `McPixelCard` | 卡片：浅色 / 深色外观 + 状态描边 |
| `McPixelTable` | 表格：列配置 + 具名插槽自定义单元格，自带空数据 / 加载中占位 |
| `McPixelPagination` | 分页：方形 `‹ ›` 按钮 + 每页数量选择 |

## 安装

组件库**尚未发布到 npm registry**，用下面两种方式之一引入。

### 1. 本地路径（开发期推荐）

```bash
npm i file:../mcpixel-craft-ui

# 或者用 npm link
cd mcpixel-craft-ui && npm link
cd ../your-project && npm link mcpixel-craft-ui
```

⚠️ 本地链接消费的是 **`dist/` 产物**（`package.json` 的 `module` / `types` / `style` 都指向 dist），
而 `dist/` 被 gitignore。所以**改了组件源码必须先在组件库执行 `npm run build`**，宿主项目才能看到变化
（Vite 建议顺手重启一次 dev server）。

### 2. 直接从 GitHub

```bash
npm i github:Gaksy/mcpixel-craft-ui
```

`package.json` 里带了 `prepare: npm run build`，npm 安装时会自动构建一次 `dist/`。

## 快速上手

```ts
// main.ts
import { createApp } from "vue";
import McPixelCraftUI from "mcpixel-craft-ui";
import "mcpixel-craft-ui/style.css"; // 必需：组件样式 + 主题变量 + 像素字体 @font-face
import App from "./App.vue";

createApp(App).use(McPixelCraftUI).mount("#app");
```

整体注册后模板里直接用；也可以按需具名导入（打包工具会 tree-shaking）：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { McPixelButton, McPixelSwitch } from "mcpixel-craft-ui";

const on = ref(false);
</script>

<template>
  <McPixelButton variant="primary" @click="on = !on">切换</McPixelButton>
  <McPixelSwitch v-model="on" appearance="light" label="接收通知" />
</template>
```

所有可交互组件统一用 `modelValue` + `update:modelValue`，直接 `v-model` 即可。

## 主题与配色

### 跟随宿主主题（推荐）

组件优先读宿主提供的语义变量，读不到才回落到内置调色板 —— 在你自己的设计系统里可以直接换肤：

| 变量 | 用途 |
|------|------|
| `--bk-bg-sidebar` | 面 / 卡片背景 |
| `--bk-border` | 描边 |
| `--bk-text-1` ~ `--bk-text-4` | 文字层级 |
| `--bk-accent` / `--bk-accent-strong` | 主色 / 深主色（勾选、开关开启） |
| `--bk-hover` | 悬停强调色 |

```css
:root {
  --bk-bg-sidebar: #262423;
  --bk-border: #3d3938;
  --bk-text-1: #fcf5f1;
  --bk-accent: #52a535;
  --bk-hover: #fffc70;
}
```

### 内置调色板

不定义宿主变量时用组件库自带的一套（`src/assets/theme/mcpixel-craft-ui-color.css`）：

| 变量 | 值 | 用途 |
|------|----|------|
| `--mc-core-green-4` | `#52a535` | 草方块绿（主色） |
| `--mc-core-green-5` | `#3c8527` | 深一档的绿（描边 / 悬停） |
| `--mc-core-grey-6` | `#262423` | 深色面 |
| `--mc-core-grey-5` | `#3d3938` | 深色描边 |
| `--mc-core-grey-1` | `#ede5e2` | 浅色底 |
| `--mc-core-off-white` | `#fcf5f1` | 深色主题文字 |
| `--mc-core-off-black` | `#171615` | 页面底色 |

每个可见组件还有 `appearance="light | dark"`，用于**在同一页面上**混用两种外观
（例如浅色文档页里放一块深色面板）：它决定这组语义变量取哪一套色，不等同于「整站主题」。

### 字体

组件库自带 **Fusion Pixel** 像素字体，`@font-face` 写在 `style.css` 里，组件文字统一用变量
`--font-pixel-12-mono`。

- 字体体积较大（全语言合计上百 MB），生产环境建议挂 CDN：用构建插件把 `src: url("./fonts/…")`
  改写成「CDN 优先 + 服务器兜底」的多源列表。inception-work 的 `vite.config.ts` 里
  `fontCdnPlugin` 就是现成实现，可以直接抄。
- 字体许可：**SIL Open Font License 1.1**（Fusion Pixel Font，© TakWolf）。

## 组件 API 摘要

### McPixelButton

| 参数 | 说明 | 类型 | 默认 |
|------|------|------|------|
| `variant` | 配色 | `primary / secondary / danger / general` | `secondary` |
| `state` | 状态语义 | `general / success / error / warning / selected` | `general` |
| `size` | 尺寸 | `small / medium / large` | — |
| `appearance` | 外观 | `light / dark` | `light` |
| `block` / `disabled` / `wait` | 独占一行 / 禁用 / 加载中 | `boolean` | `false` |

### McPixelSwitch

| 参数 | 说明 | 类型 | 默认 |
|------|------|------|------|
| `v-model` | 是否开启 | `boolean` | `false` |
| `label` | 文案（也可用默认插槽） | `string` | — |
| `size` | 尺寸 | `medium / small` | `medium` |
| `offText` / `onText` | 滑块上的状态符号 | `string` | `–` / `O` |
| `disabled` / `appearance` | 禁用 / 外观 | `boolean` / `light·dark` | `false` / `dark` |
| `change` | 切换事件 | `(checked: boolean) => void` | — |

### McPixelTable

| 参数 | 说明 |
|------|------|
| `columns` | `{ key, title, width?, align?, mono? }[]` |
| `rows` | 行数据数组 |
| `rowKey` | 行 key 字段名，默认 `id` |
| `appearance` / `loading` / `emptyText` / `loadingText` | 外观 / 加载中 / 空数据文案 |

单元格用同名插槽自定义（`<template #状态列="{ row, value, index }">`）；操作列约定
`key: "actions"` + `#actions` 插槽。

> 完整 props / 事件（Checkbox、Input、Card、Pagination 等）见在线文档每个组件末尾的 **API 表**。

## 开发

```bash
npm install
npm run build   # 产出 dist/：es + umd + css + fonts + types
npm run pack    # 打 npm 包（build + npm pack）
```

目录约定：

```
src/components/<Xxx>/<Xxx>.vue   组件实现（<script setup> + defineOptions({ name })）
src/components/<Xxx>/index.ts    该组件的导出 / install
src/assets/theme/                调色板、变量、字体、normalize
types/components/<Xxx>.d.ts      手写类型声明（与组件成对维护）
types/index.d.ts                 桶导出 + GlobalComponents
```

两个容易踩的点：

1. **类型声明是手写的**，不在构建时生成 —— 新增 / 修改组件必须同步改 `types/`，否则宿主项目类型对不上实现。
2. `dist/` 不入库，对外发布 / 给宿主项目消费前都要先 `npm run build`。

## 相关链接

- 在线示例与文档：<https://www.inception.work/mcpixel-ui>
- 主站：<https://www.inception.work>
- 问题反馈：<https://github.com/Gaksy/mcpixel-craft-ui/issues>
- 使用方参考实现：<https://github.com/Inception-Work/inception-work>

## 许可证

组件库本身暂未声明开源许可证；内置的 Fusion Pixel 字体遵循 **SIL Open Font License 1.1**。
如需对外分发，建议补一份 `LICENSE`。
