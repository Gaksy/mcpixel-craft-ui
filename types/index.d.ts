import McPixelButton from "./components/McPixelButton";
import McPixelInput from "./components/McPixelInput";
import McPixelInnerTipsInput from "./components/McPixelInnerTipsInput";
import McPixelCard from "./components/McPixelCard";
import McPixelTable from "./components/McPixelTable";
import McPixelCheckbox from "./components/McPixelCheckbox";
import McPixelSwitch from "./components/McPixelSwitch";
import McPixelPagination from "./components/McPixelPagination";

export {
    McPixelButton,
    McPixelInput,
    McPixelInnerTipsInput,
    McPixelCard,
    McPixelTable,
    McPixelCheckbox,
    McPixelSwitch,
    McPixelPagination,
};

export type { McPixelButtonProps } from "./components/McPixelButton";
export type { McPixelInputProps } from "./components/McPixelInput";
export type { McPixelInnerTipsInputProps } from "./components/McPixelInnerTipsInput";
export type { McPixelCardProps } from "./components/McPixelCard";
export type { McPixelTableProps, TableColumn } from "./components/McPixelTable";
export type { McPixelCheckboxProps } from "./components/McPixelCheckbox";
export type { McPixelSwitchProps } from "./components/McPixelSwitch";
export type { McPixelPaginationProps } from "./components/McPixelPagination";

declare const _default: {
    install(app: any, ...options: any[]): any;
};

export default _default;

declare module "vue" {
    export interface GlobalComponents {
        McPixelButton: typeof import("mcpixel-craft-ui")["McPixelButton"];
        McPixelInput: typeof import("mcpixel-craft-ui")["McPixelInput"];
        McPixelInnerTipsInput: typeof import("mcpixel-craft-ui")["McPixelInnerTipsInput"];
        McPixelCard: typeof import("mcpixel-craft-ui")["McPixelCard"];
        McPixelTable: typeof import("mcpixel-craft-ui")["McPixelTable"];
        McPixelCheckbox: typeof import("mcpixel-craft-ui")["McPixelCheckbox"];
        McPixelSwitch: typeof import("mcpixel-craft-ui")["McPixelSwitch"];
        McPixelPagination: typeof import("mcpixel-craft-ui")["McPixelPagination"];
    }
}
