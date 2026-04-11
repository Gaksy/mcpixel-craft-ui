import './assets/theme'
import type { App, Component } from "vue";
import McPixelButton from "./components/McPixelButton/McPixelButton.vue";

McPixelButton.name = "McPixelButton";

const components: Component[] = [McPixelButton];

const install = (app: App) => {
    components.forEach((component: any) => {
        app.component(component.name, component);
    });
};

export { McPixelButton };

export default {
    install,
};