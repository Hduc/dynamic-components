import { ButtonConfig } from "./button";
import { FieldConfig } from "./field";
import { StepperConfig } from "./step";
import { TabsConfig } from "./tab";
import { TableConfig } from "./table";

export type DynFormData = { [key: string]: any };

export type Errors = { [key: string]: string };


export type AddComponentContext = {
  parentId: string;
  parentType: 'root' | 'tab' | 'step';
  tabIndex?: number;
  stepIndex?: number;
};

export interface LayoutItemConfigMap {
  field: FieldConfig;
  button: ButtonConfig;
  table: TableConfig;
  tabs: TabsConfig;
  stepper: StepperConfig;
}

export interface BaseLayoutItemConfig {
  id: string
  type: keyof LayoutItemConfigMap
}

export type LayoutItemConfig = ButtonConfig | FieldConfig | TabsConfig | StepperConfig | TableConfig

// ===== Base và union LayoutItem sinh tự động =====
export interface BaseLayoutItem<T extends keyof LayoutItemConfigMap> {
  id: string;
  type: T;
  config: LayoutItemConfigMap[T];
}

export type LayoutItem = {  [K in keyof LayoutItemConfigMap]: BaseLayoutItem<K>}[keyof LayoutItemConfigMap];

export type Layout = LayoutItem[];

// Tổng hợp
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
