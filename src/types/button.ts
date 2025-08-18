import { ButtonProps } from "@mui/material";
import { BaseLayoutItemConfig } from ".";

export interface ButtonConfig extends BaseLayoutItemConfig{
  type: "button",
  label?: string;
  grid?: number;
  config?: {
    variant?: ButtonProps['variant'];
    color?: ButtonProps['color'];
    onClickAction?: string;
    // Tên của action trong actionRegistry
  };
}