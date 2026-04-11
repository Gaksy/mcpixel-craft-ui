import type { DefineComponent } from "vue";
import type { State, Appearance } from "./CommonStyleEnum";

export interface McPixelCardProps {
    appearance?: Appearance;
    state?: State;
}

declare const McPixelCard: DefineComponent<
    McPixelCardProps,
    {},
    {},
    {},
    {},
    {},
    {},
    {}
>;

export default McPixelCard;