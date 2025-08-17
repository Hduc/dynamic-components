export interface TableConfig {
    id: string,
    tableKey: string,
    tableName?: string
    urlColumn: string
    urlData: string
    actions?:DynamicAction[]
}
export interface ColumnHeader{
    key:string,
    type:string
    name:string,
    order?:number
    width:number
}
export interface DynamicAction {
    id:string,
    actionName: string,
    actionType: string
    iconClass: string
    color?: string
    style?: string
    formId:string
    roles?: string
    parentId?: string
    formName?: string
    submitUrl?: string
    afterSubmitType?: string
    layoutJson?:string
}

export interface DynamicTableMetaData {
    tableKey: string,
    columnName: string
    columnType: string
    displayName?: string
    columnOrder?: number
    getUrl?: string
    extendJson?: string
}


