import './assets/theme'
import type { App, Component } from "vue";
import McPixelButton from "./components/McPixelButton/McPixelButton.vue";
import McPixelInput from "./components/McPixelInput/McPixelInput.vue";
import McPixelInnerTipsInput from "./components/McPixelInnerTipsInput/McPixelInnerTipsInput.vue";
import McPixelCard from "./components/McPixelCard/McPixelCard.vue";

McPixelButton.name = "McPixelButton";
McPixelInput.name = "McPixelInput";
McPixelInnerTipsInput.name = "McPixelInnerTipsInput";
McPixelCard.name = "McPixelCard";

const components: Component[] = [McPixelButton, McPixelInput, McPixelInnerTipsInput, McPixelCard];

const install = (app: App) => {
    components.forEach((component: any) => {
        app.component(component.name, component);
    });
};

export { McPixelButton, McPixelInput, McPixelInnerTipsInput, McPixelCard };

export default {
    install,
};