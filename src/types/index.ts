import { ComponentType } from "react";
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
  table: TableConfig;
  tabs: TabsConfig;
  stepper: StepperConfig;
  button: ButtonConfig;
}
export type LayoutItemConfig = FieldConfig | TableConfig | TabsConfig | StepperConfig  | ButtonConfig;

export interface BaseLayoutItem<T extends keyof LayoutItemConfigMap> {
  id: string;
  type: T;
  config: LayoutItemConfigMap[T];
}
export type LayoutItem = {
  [K in keyof LayoutItemConfigMap]: BaseLayoutItem<K>;
}[keyof LayoutItemConfigMap];

export type Layout = LayoutItem[];

// type liệt kê tên các item hợp lệ
export type LayoutItemType = LayoutItem["type"];

// type mapping: key là LayoutItemType, value là component React
export type ComponentRegistry = {
  [K in keyof LayoutItemConfigMap]: ComponentType<LayoutItemConfigMap[K]>;
};
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
