import './assets/theme'
import McPixelButton from "./components/McPixelButton/McPixelButton.vue";

const components = [McPixelButton];

const install = (app: any) => {
    components.forEach((component) => {
        app.component(component.name, component);
    });
};

export { McPixelButton };

export default {
    install,
};