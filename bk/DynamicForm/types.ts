// src/components/DynamicForm/types.ts

import { Control, FieldErrors } from 'react-hook-form';
import * as yup from 'yup';

// Các loại control không thay đổi
export type ControlType = 'text'
  | 'select'
  | 'autocomplete'
  | 'table-autocomplete'
  | 'checkbox'
  | 'textarea'
  | 'radio-group'
  | 'checkbox-group'
  | 'date'
  | 'password'
  | 'switch'
  | 'slider'
  | 'currency'
  | 'number'
  | 'color'
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "time"
  | "url"
  | "week";

export interface OptionType {
  label: string;
  value: string | number;
}

/**
 * MỚI: Định nghĩa cho một giá trị được tính toán
 */
export interface CalculatedValue {
  // Danh sách các trường nguồn để tính toán
  sourceFields: string[];
  // Hàm tính toán, nhận vào giá trị của các trường nguồn và trả về kết quả
  calculate: (values: Record<string, any>) => string;
}

/**
 * MỚI: Định nghĩa cho validation có điều kiện.
 * Sử dụng sức mạnh của yup.when()
 */
export interface ConditionalValidation {
  // Tên của trường phụ thuộc
  dependentField: string;
  // Điều kiện để áp dụng validation
  is: (value: any) => boolean;
  // Schema validation sẽ được áp dụng NẾU điều kiện đúng
  then: yup.AnySchema;
  // (Tùy chọn) Schema validation sẽ được áp dụng NẾU điều kiện sai
  otherwise?: yup.AnySchema;
}

/**
 * Cấu hình chi tiết cho một trường (field) trong form.
 */
export interface FormField {
  name: string;
  label: string;
  type: ControlType;
  placeholder?: string;
  defaultValue?: any;
  options?: OptionType[];
  readOnly?: boolean;
  grid?: { xs?: number; sm?: number; md?: number; lg?: number };

  // Validation cơ bản (vẫn giữ lại)
  validation?: yup.AnySchema;

  // --- CÁC THUỘC TÍNH MỚI ---
  calculatedValue?: CalculatedValue;
  conditionalValidation?: ConditionalValidation;
  [key: string]: any;
}

export interface ValidationRule {
  /**
   * Loại quy tắc xác thực.
   * Ví dụ: 'required', 'min', 'max', 'email'.
   */
  type: 'required' | 'min' | 'max' | 'email';

  /**
   * Giá trị cho quy tắc (nếu cần).
   * Ví dụ: 6 cho min-length, hoặc 'today' cho max-date.
   */
  value?: any;

  /**
   * Thông báo lỗi sẽ hiển thị nếu quy tắc bị vi phạm.
   */
  message: string;
}

// Các props khác không thay đổi
export interface DynamicFormProps {
  idForm?: string
  formConfig: FormField[];
  initialValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  isReadOnly?: boolean;
}

export interface FieldProps {
  field: FormField;
  control: Control<any>;
  errors: FieldErrors;
  readOnly?: boolean;
}

export interface DynamicFormRef {
  submit: () => void;
  reset: (values?: Record<string, any>) => void;
}
