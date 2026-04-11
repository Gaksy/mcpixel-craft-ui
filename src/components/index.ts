// src/components/mcpixel-craft-ui/index.ts
import type { App } from "vue";
import { McPixelButton } from "./McPixelButton";
import { McPixelInput } from "./McPixelInput";
import { McPixelInnerTipsInput } from "./McPixelInnerTipsInput";

// 整体插件
export default {
  install(app: App) {
    // 直接注册 McPixelButton
    app.component("McPixelButton", McPixelButton);
    app.component("McPixelInput", McPixelInput);
    app.component("McPixelInnerTipsInput", McPixelInnerTipsInput);
  },
};

// 单独导出每个组件
export { McPixelButton, McPixelInput, McPixelInnerTipsInput };
