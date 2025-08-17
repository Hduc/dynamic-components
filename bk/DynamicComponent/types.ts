import { ButtonProps } from "@mui/material";

export type DynFormData = { [key: string]: any };
export type Errors = { [key: string]: string };
export type AddComponentContext = { parentId: string; parentType: 'root' | 'tab' | 'step'; tabIndex?: number; stepIndex?: number; };
// Interface cho các lựa chọn trong Radio hoặc Select
export interface FieldOption {
  value: string | number;
  label: string;
  [key: string]: any; // Cho phép các thuộc tính khác như id, name
}

// Interface cho các quy tắc xác thực (validation)
export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string; // Dành cho Regex
  urlLoad?: string
}

export interface FieldAction {
  action: 'FETCH_AND_UPDATE';
  apiUrl: string; // e.g., /api/customers/{value}
  targetField?: string
  targets?: {
    sourceKey: string; // Key from API response. Use '.' for direct response.
    destinationField: string; // ID of the form field to update.
  }[];
}

export interface ExtraFieldConfig {
  helperText?: string;
  options?: FieldOption[];
  url?: string;
  valueField?: string;
  labelField?: string;
  defaultValue?: string; // e.g., 'now', 'now-10d', 'now+2h'
  onValueChange?: FieldAction[];
}



// Interface cho các cấu hình bổ sung
export interface ExtraConfig {
  helperText?: string;
  // Dùng cho các lựa chọn tĩnh (static options)
  options?: FieldOption[];
  // Dùng để tải dữ liệu động cho Select
  url?: string;
  valueField?: string; // Tên thuộc tính làm giá trị (vd: 'id')
  labelField?: string; // Tên thuộc tính làm nhãn (vd: 'name')
  defaultValue?: string
}

// Interface chính cho fieldConfig
export interface FieldConfig {
  /**
   * ID duy nhất của trường, dùng làm key trong state formData.
   * Ví dụ: "ho_ten", "email_address"
   */
  id: string;

  /**
   * Loại control sẽ được render trên UI.
   */
  type: 'text' | 'number' | 'date' | 'datetime-local' | 'color' | 'radio' | 'checkbox' | 'select';

  /**
   * Nhãn hiển thị cho người dùng.
   * Ví dụ: "Họ và Tên"
   */
  label: string;

  /**
   * Độ rộng của trường trong hệ thống lưới (grid) của Material-UI (tổng là 12).
   */
  grid: number;

  /**
   * Đối tượng chứa các quy tắc xác thực cho trường.
   */
  validation?: FieldValidation;

  /**
   * Các cấu hình bổ sung tùy thuộc vào `type` của trường.
   */
  config?: ExtraFieldConfig;

  /**
   * ID của một trường khác mà trường này phụ thuộc vào.
   * Hữu ích cho việc tạo các select box phụ thuộc (cascading selects).
   */
  dependsOn?: string;
}

export interface TableColumnOption {
  value: string | number;
  label: string;
}

// Interface cho một cột trong bảng (Table)
export interface TableColumn {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'select';
  visible?: boolean;
  defaultValue?: string;
  color?: string;
  backgroundColor?: string;
  config?: {
    options?: TableColumnOption[];
    url?: string;
  }
}

export interface TableConfig {
  id: string;
  label: string;
  tableType?: string
  columns: TableColumn[];
  columnsApiUrl?: string;
  dataApiUrl?: string;
}

export interface TabItem {
  id: string;
  label: string;
  items: LayoutItem[];
}

export interface TabsConfig {
  tabs: TabItem[];
}
export interface StepItem {
  id: string;
  label: string;
  items: LayoutItem[];
  onNextAction?: string;
}

export interface StepperConfig {
  steps: StepItem[];
}

export interface ModalFormConfig {
  buttonLabel: string;
  dialogTitle: string;
  layout: LayoutItem[];
  onSubmitAction?: 'ADD_TO_TABLE';
  onSubmitTarget?: string;
}

export interface ButtonConfig {
  id: string;
  label: string;
  grid: 3 | 4 | 6 | 12;
  config: {
    variant?: ButtonProps['variant'];
    color?: ButtonProps['color'];
    onClickAction?: string; // Tên của action trong actionRegistry
  };
}


export interface DynamicButtonProps {
  componentConfig: ButtonConfig;
  onAction: (actionName: string) => void;
}

export type LayoutItemConfig = FieldConfig | TableConfig | TabsConfig | StepperConfig | ModalFormConfig | ButtonConfig;

export interface BaseLayoutItem<T extends 'field' | 'table' | 'tabs' | 'stepper' | 'modal-button' | 'button', C extends LayoutItemConfig> {
  id: string;
  type: T;
  config: C;
}

export type FieldLayoutItem = BaseLayoutItem<'field', FieldConfig>;
export type TableLayoutItem = BaseLayoutItem<'table', TableConfig>;
export type TabsLayoutItem = BaseLayoutItem<'tabs', TabsConfig>;
export type StepperLayoutItem = BaseLayoutItem<'stepper', StepperConfig>;
type ModalButtonLayoutItem = BaseLayoutItem<'modal-button', ModalFormConfig>;
type ButtonLayoutItem = BaseLayoutItem<'button', ButtonConfig>;
export type LayoutItem = FieldLayoutItem | TableLayoutItem | TabsLayoutItem | StepperLayoutItem | ModalButtonLayoutItem | ButtonLayoutItem;



export interface IDynamicForm {
  id?: string
  parentId?: string
  formName: string
  submitUrl: string
  afterSubmitType: string
  layoutJson: string
  isActive?: boolean
  createdBy?: string
  createdAt?: string
  modifiedAt?: string
}
