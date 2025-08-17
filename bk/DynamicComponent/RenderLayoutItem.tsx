import { Grid } from "@mui/material";
import ConfigurableWrapper from "./ConfigurableWrapper";
import DynamicField from "./DynamicField";
import DynamicTableComponent from "./DynamicTableComponent";
import { DynFormData, Errors, FieldConfig, LayoutItem } from "./types";

interface RenderLayoutItemProps {
  item: LayoutItem;
  index: number;
  array: LayoutItem[];
  formData: DynFormData;
  errors: Errors;
  onFieldChange: (fieldId: string, value: any) => void;
  onTableChange: (tableId: string, data: any[], tableType?: string) => void;
  onOpenConfig?: (itemId: string) => void;
  onOpenTableConfig?: (itemId: string) => void;
  onDeleteItem?: (itemId: string) => void;
  onMoveItem?: (itemId: string, direction: "up" | "down") => void;
}

export default function RenderLayoutItem({
  item,
  index,
  array,
  formData,
  errors,
  onFieldChange,
  onTableChange,
  onOpenConfig,
  onOpenTableConfig,
  onDeleteItem,
  onMoveItem,
}: RenderLayoutItemProps) {
  switch (item.type) {
    case "field":
      return (
        <Grid item xs={12} sm={item.config.grid} key={item.id}>
          <ConfigurableWrapper
            type="trường"
            onEdit={onOpenConfig ? () => onOpenConfig(item.id) : undefined}
            onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
            onMoveUp={onMoveItem ? () => onMoveItem(item.id, "up") : undefined}
            onMoveDown={onMoveItem ? () => onMoveItem(item.id, "down") : undefined}
            isFirst={index === 0}
            isLast={index === array.length - 1}
          >
            <DynamicField
              fieldConfig={item.config as FieldConfig}
              formData={formData}
              onFieldChange={onFieldChange}
              errorText={errors[item.id]}
            />
          </ConfigurableWrapper>
        </Grid>
      );

    case "table":
      return (
        <Grid item xs={12} key={item.id}>
          <ConfigurableWrapper
            type="bảng"
            onEdit={onOpenTableConfig ? () => onOpenTableConfig(item.id) : undefined}
            onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
          >
            <DynamicTableComponent
              tableConfig={item.config}
              tableData={formData[item.config.id]?.value || []}
              onTableChange={onTableChange}
            />
          </ConfigurableWrapper>
        </Grid>
      );

    default:
      return null;
  }
}
