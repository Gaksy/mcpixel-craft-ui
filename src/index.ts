import './assets/theme'
import type { App, Component } from "vue";
import McPixelButton from "./components/McPixelButton/McPixelButton.vue";
import McPixelInput from "./components/McPixelInput/McPixelInput.vue";
import McPixelInnerTipsInput from "./components/McPixelInnerTipsInput/McPixelInnerTipsInput.vue";
import McPixelCard from "./components/McPixelCard/McPixelCard.vue";
import McPixelTable from "./components/McPixelTable/McPixelTable.vue";
import McPixelCheckbox from "./components/McPixelCheckbox/McPixelCheckbox.vue";

const components: Component[] = [
    McPixelButton,
    McPixelInput,
    McPixelInnerTipsInput,
    McPixelCard,
    McPixelTable,
    McPixelCheckbox,
];

const install = (app: App) => {
    components.forEach((component: any) => {
        app.component(component.name, component);
    });
};

export {
    McPixelButton,
    McPixelInput,
    McPixelInnerTipsInput,
    McPixelCard,
    McPixelTable,
    McPixelCheckbox,
};

export default {
    install,
};
