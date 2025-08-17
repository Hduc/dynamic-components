import { Box, Button, Grid, IconButton, Paper, Tab, Tabs } from "@mui/material";
import Add from "@mui/icons-material/Add";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import Settings from "@mui/icons-material/Settings";
import { TabsConfig, DynFormData, Errors, AddComponentContext, LayoutItem } from "./types";
import { useState } from "react";
import DynamicTableComponent from "./DynamicTableComponent";
import ConfigurableWrapper from "./ConfigurableWrapper";
import DynamicField from "./DynamicField";

interface TabsComponentProps {
    componentId: string;
    componentConfig: TabsConfig;
    formData: DynFormData;
    errors: Errors;
    onFieldChange: (fieldId: string, value: any) => void;
    onTableChange: (tableId: string, data: any[]) => void;
    onAddTab?: (tabsComponentId: string) => void;
    onOpenConfig?: (itemId: string) => void;
    onOpenTableConfig?: (itemId: string) => void;
    onDeleteItem?: (itemId: string) => void;
    onOpenTabConfig?: (componentId: string, tabId: string) => void;
    onOpenAddComponentDialog?: (context: AddComponentContext) => void;
    onMoveItem?: (itemId: string, direction: 'up' | 'down') => void;
}

export default function TabsComponent({
    componentId, componentConfig,
    formData,
    onFieldChange,
    onTableChange,
    onAddTab,
    onOpenConfig,
    onDeleteItem,
    onOpenTableConfig,
    errors,
    onOpenTabConfig,
    onOpenAddComponentDialog,
    onMoveItem
}: TabsComponentProps) {
    const [activeTab, setActiveTab] = useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => setActiveTab(newValue);


    const renderLayoutItem = (item: LayoutItem, index: number, arrayLength: number) => {
        switch (item.type) {
            case 'field':
                return (<Grid item xs={12}
                    sm={item.config.grid} key={item.id}>
                    <ConfigurableWrapper type="trường"
                        onEdit={onOpenConfig ? () => onOpenConfig(item.id) : undefined}
                        onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
                        onMoveUp={onMoveItem ? () => onMoveItem(item.id, 'up') : undefined}
                        onMoveDown={onMoveItem ? () => onMoveItem(item.id, 'down') : undefined}
                        isFirst={index === 0}
                        isLast={index === arrayLength - 1}>
                        <DynamicField fieldConfig={item.config} formData={formData}
                            onFieldChange={onFieldChange} errorText={errors[item.id]} />
                    </ConfigurableWrapper>
                </Grid>);
            case 'table':
                return (<Grid item xs={12}
                    key={item.id}>
                    <ConfigurableWrapper type="bảng"
                        onEdit={onOpenConfig ? () => onOpenConfig(item.id) : undefined}
                        onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
                        onMoveUp={onMoveItem ? () => onMoveItem(item.id, 'up') : undefined}
                        onMoveDown={onMoveItem ? () => onMoveItem(item.id, 'down') : undefined}
                        isFirst={index === 0}
                        isLast={index === arrayLength - 1}>
                        <DynamicTableComponent tableConfig={item.config}
                            tableData={formData[item.id] || []} onTableChange={onTableChange} />
                    </ConfigurableWrapper>
                </Grid>);
            default: return null;
        }
    };
    return (
        <Paper variant="outlined">
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ flexGrow: 1 }}
                >
                    {componentConfig.tabs.map((tab) => (
                        <Tab
                            key={tab.id}
                            label={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    {tab.label}
                                    {onOpenTabConfig && (
                                        <IconButton
                                            size="small"
                                            sx={{ p: 0.5 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onOpenTabConfig(componentId, tab.id);
                                            }}
                                            title="Chỉnh sửa tên tab"
                                        >
                                            <Settings sx={{ fontSize: "1rem" }} />
                                        </IconButton>
                                    )}
                                </Box>
                            }
                        />
                    ))}
                </Tabs>

                {onAddTab && (
                    <IconButton
                        onClick={() => onAddTab(componentId)}
                        color="primary"
                        title="Thêm Tab mới"
                        sx={{ mr: 1, ml: 1 }}
                    >
                        <AddCircleOutline />
                    </IconButton>
                )}
            </Box>

            {componentConfig.tabs.map((tab, index) => (
                <Box role="tabpanel" hidden={activeTab !== index} key={tab.id} sx={{ p: 3 }}>
                    {activeTab === index && (
                        <Grid container spacing={3}>
                            {tab.items.map((item, idx, arr) =>
                                renderLayoutItem(item, idx, arr.length)
                            )}

                            {onOpenAddComponentDialog && (
                                <Grid item xs={12}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Add />}
                                        onClick={() => onOpenAddComponentDialog({ parentId: componentId, parentType: 'tab', tabIndex: index })}
                                        sx={{ mt: 2 }}
                                    >
                                        Thêm thành phần vào TAB
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </Box>
            ))}
        </Paper>
    );
}
