export interface FieldAction {
    action?: string// 'FETCH_AND_UPDATE';
    targetField?: string
    apiUrl: string;
    // e.g.,/api/customers/{value}
    targets?: {
        sourceKey: string;
        // Key from API response. Use '.' for direct response.
        destinationField: string;
        // ID of the form field to update.
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
export interface FieldConfig {
    id: string;
    type: 'text' | 'number' | 'date' | 'datetime-local' | 'color' | 'radio' | 'select';
    label: string;
    grid: number;
    validation?: FieldValidation;
    config?: ExtraFieldConfig;
    dependsOn?: string;
}
