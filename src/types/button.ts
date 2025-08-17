import { ButtonProps } from "@mui/material";

export interface ButtonConfig {
  id?: string;
  label?: string;
  grid?: number;
  config?: {
    variant?: ButtonProps['variant'];
    color?: ButtonProps['color'];
    onClickAction?: string;
    // Tên của action trong actionRegistry
  };
}