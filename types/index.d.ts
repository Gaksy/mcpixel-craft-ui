import McPixelButton from "./components/McPixelButton";
import McPixelInput from "./components/McPixelInput";
import McPixelInnerTipsInput from "./components/McPixelInnerTipsInput";
import McPixelCard from "./components/McPixelCard";
import McPixelTable from "./components/McPixelTable";

export { McPixelButton, McPixelInput, McPixelInnerTipsInput, McPixelCard, McPixelTable };

export type { McPixelButtonProps } from "./components/McPixelButton";
export type { McPixelInputProps } from "./components/McPixelInput";
export type { McPixelInnerTipsInputProps } from "./components/McPixelInnerTipsInput";
export type { McPixelCardProps } from "./components/McPixelCard";
export type { McPixelTableProps, TableColumn } from "./components/McPixelTable";

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
    }
}
