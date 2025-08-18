import { BaseLayoutItemConfig } from ".";

export interface TableColumnOption {
    value: string | number;
    label: string;
}

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

export interface TableConfig extends BaseLayoutItemConfig {
    label: string;
    columns: TableColumn[];
    columnsApiUrl?: string;
    dataApiUrl?: string;
}