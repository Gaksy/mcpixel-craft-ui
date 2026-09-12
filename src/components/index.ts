// 组件桶文件：与 src/index.ts 保持一致的导出 / 注册方式
// （组件自身的 name 由各 .vue 里的 defineOptions 提供）
import type { App, Component } from "vue";
import McPixelButton from "./McPixelButton/McPixelButton.vue";
import McPixelInput from "./McPixelInput/McPixelInput.vue";
import McPixelInnerTipsInput from "./McPixelInnerTipsInput/McPixelInnerTipsInput.vue";
import McPixelCard from "./McPixelCard/McPixelCard.vue";

const components: Component[] = [
  McPixelButton,
  McPixelInput,
  McPixelInnerTipsInput,
  McPixelCard,
];

const install = (app: App) => {
  components.forEach((component: any) => {
    app.component(component.name, component);
  });
};

export { McPixelButton, McPixelInput, McPixelInnerTipsInput, McPixelCard };

export default { install };
