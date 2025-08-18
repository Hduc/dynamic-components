import { BaseLayoutItemConfig } from ".";

export interface FieldAction {
    action?: string// 'FETCH_AND_UPDATE';
    targetField?: string
    apiUrl: string;
    targets?: {
        sourceKey: string;
        destinationField: string;
    }[];
}
export interface FieldOption {
    value: string | number;
    label: string;
    [key: string]: any;
}
export interface FieldValidation {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
}
export interface ExtraFieldConfig {
    helperText?: string;
    options?: FieldOption[];
    url?: string;
    valueField?: string;
    labelField?: string;
    defaultValue?: string;  // e.g.,'now','now-10d','now+2h'
    variant?: string
    color?: string

    onValueChange?: FieldAction[];
}
export interface FieldConfig extends BaseLayoutItemConfig{
    inputType: 'text' | 'number' | 'date' | 'datetime-local' | 'color' | 'radio' | 'select';
    label: string;
    grid: number;
    validation?: FieldValidation;
    config?: ExtraFieldConfig;
    dependsOn?: string;
}
