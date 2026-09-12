/** 表格列配置（McPixelTable） */
export interface TableColumn {
  /** 取值字段名；同时作为插槽名（actions 表示操作列） */
  key: string;
  /** 表头文案 */
  title: string;
  /** 列宽（如 "120px"、20%） */
  width?: string;
  /** 对齐方式，默认 left */
  align?: "left" | "center" | "right";
  /** 等宽像素字体（ID、代码、时间等） */
  mono?: boolean;
}
