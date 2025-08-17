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
export type LayoutItemConfig = FieldConfig | TableConfig | TabsConfig | StepperConfig  | ButtonConfig;
export interface BaseLayoutItem<T extends 'field' | 'table' | 'tabs' | 'stepper' | 'modal-button' | 'button',
  C extends LayoutItemConfig> {
  id: string;
  type: T;
  config: C;
}
export type FieldLayoutItem = BaseLayoutItem<'field',  FieldConfig>;
export type TableLayoutItem = BaseLayoutItem<'table',  TableConfig>;
export type TabsLayoutItem = BaseLayoutItem<'tabs',  TabsConfig>;
export type StepperLayoutItem = BaseLayoutItem<'stepper',  StepperConfig>;
export type ButtonLayoutItem = BaseLayoutItem<'button',  ButtonConfig>;

export type LayoutItem = FieldLayoutItem | TableLayoutItem | TabsLayoutItem | StepperLayoutItem | ButtonLayoutItem;

export type Layout = LayoutItem[];



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
