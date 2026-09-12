import type { DefineComponent } from "vue";
import type { Appearance } from "./CommonStyleEnum";

export interface McPixelPaginationProps {
    /** 当前页（从 1 开始） */
    current?: number;
    /** 每页条数 */
    size?: number;
    /** 总条数 */
    total?: number;
    /** 每页条数可选项 */
    sizeOptions?: number[];
    /** 每页数量后缀文案（如「条/页」） */
    sizeSuffix?: string;
    /** 是否显示总条数 */
    showTotal?: boolean;
    appearance?: Appearance;
    disabled?: boolean;
}

declare const McPixelPagination: DefineComponent<
    McPixelPaginationProps,
    {},
    {},
    {},
    {},
    {},
    {},
    {}
>;

export default McPixelPagination;
