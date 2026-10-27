import './assets/theme'
import type { App, Component } from "vue";
import McPixelButton from "./components/McPixelButton/McPixelButton.vue";
import McPixelInput from "./components/McPixelInput/McPixelInput.vue";
import McPixelSelect from "./components/McPixelSelect/McPixelSelect.vue";
import McPixelInnerTipsInput from "./components/McPixelInnerTipsInput/McPixelInnerTipsInput.vue";
import McPixelCard from "./components/McPixelCard/McPixelCard.vue";
import McPixelTable from "./components/McPixelTable/McPixelTable.vue";
import McPixelCheckbox from "./components/McPixelCheckbox/McPixelCheckbox.vue";
import McPixelSwitch from "./components/McPixelSwitch/McPixelSwitch.vue";
import McPixelPagination from "./components/McPixelPagination/McPixelPagination.vue";
import McPixelToast from "./components/McPixelToast/McPixelToast.vue";
import McPixelSearchInput from "./components/McPixelSearchInput/McPixelSearchInput.vue";
import McPixelStateButton from "./components/McPixelStateButton/McPixelStateButton.vue";
import McPixelLoadingOverlay from "./components/McPixelLoadingOverlay/McPixelLoadingOverlay.vue";

const components: Component[] = [
    McPixelButton,
    McPixelInput,
    McPixelSelect,
    McPixelInnerTipsInput,
    McPixelCard,
    McPixelTable,
    McPixelCheckbox,
    McPixelSwitch,
    McPixelPagination,
    McPixelToast,
    McPixelSearchInput,
    McPixelStateButton,
    McPixelLoadingOverlay,
];

const install = (app: App) => {
    components.forEach((component: any) => {
        app.component(component.name, component);
    });
};

export {
    McPixelButton,
    McPixelInput,
    McPixelSelect,
    McPixelInnerTipsInput,
    McPixelCard,
    McPixelTable,
    McPixelCheckbox,
    McPixelSwitch,
    McPixelPagination,
    McPixelToast,
    McPixelSearchInput,
    McPixelStateButton,
    McPixelLoadingOverlay,
};

// 轻提示：命令式 API（toast.success / error / warning），宿主自动挂载
export { useMcPixelToast } from "./components/McPixelToast/useMcPixelToast";
export type { ToastKind } from "./components/McPixelToast/McPixelToast.vue";
export type { StateTone } from "./components/McPixelStateButton/McPixelStateButton.vue";

export default {
    install,
};
