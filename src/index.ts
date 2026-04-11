import './assets/theme'
import type { App, Component } from "vue";
import McPixelButton from "./components/McPixelButton/McPixelButton.vue";
import McPixelInput from "./components/McPixelInput/McPixelInput.vue";
import McPixelInnerTipsInput from "./components/McPixelInnerTipsInput/McPixelInnerTipsInput.vue";

McPixelButton.name = "McPixelButton";
McPixelInput.name = "McPixelInput";
McPixelInnerTipsInput.name = "McPixelInnerTipsInput";

const components: Component[] = [McPixelButton, McPixelInput, McPixelInnerTipsInput];

const install = (app: App) => {
    components.forEach((component: any) => {
        app.component(component.name, component);
    });
};

export { McPixelButton, McPixelInput, McPixelInnerTipsInput };

export default {
    install,
};