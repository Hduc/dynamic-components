
import { Box, Button, CircularProgress, Grid, IconButton, Paper, Step, StepLabel, Stepper, Tab, Tabs, Typography } from "@mui/material";
import { StepperConfig } from "../../types/step";
import { AddComponentContext, DynFormData, Errors, LayoutItem } from "../../types";
import { useState } from "react";
import ConfigurableWrapper from "./ConfigurableWrapper";
import DynamicField from "./DynamicField";
import DynamicTableComponent from "./DynamicTableComponent";
import { Add, AddCircleOutline, Settings } from "@mui/icons-material";
import { TabsConfig } from "../../types/tab";


interface TabsComponentProps {
    componentId: string;
    componentConfig: TabsConfig;
    formData: DynFormData;
    errors: Errors;

    onFieldChange: (fieldId: string,
        value: any) => void;

    onTableChange: (tableId: string,
        data: any[]) => void;

    onAddTab: (tabsComponentId: string) => void;

    onOpenConfig: (itemId: string) => void;

    onOpenTableConfig: (itemId: string) => void;

    onDeleteItem: (itemId: string) => void;

    onOpenTabConfig: (componentId: string,
        tabId: string) => void;

    onOpenAddComponentDialog: (context: AddComponentContext) => void;

    onMoveItem: (itemId: string,
        direction: 'up' | 'down') => void;
}

const TabsComponent: React.FC<TabsComponentProps> = ({ componentId,
    componentConfig,
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
    onMoveItem }) => {
    const [activeTab,
        setActiveTab] = useState(0);
    const handleTabChange = (event: React.SyntheticEvent,
        newValue: number) => setActiveTab(newValue);
    const renderLayoutItem = (item: LayoutItem,
        index: number,
        array: LayoutItem[]) => {
        switch (item.type) {
            case 'field': return (<Grid sx={{ xs: 3, sm: item.config.grid }} key={item.id}>
                <ConfigurableWrapper type="trường"
                    onEdit={() =>
                        onOpenConfig(item.id)}
                    onDelete={() =>
                        onDeleteItem(item.id)}
                    onMoveUp={() =>
                        onMoveItem(item.id,
                            'up')}
                    onMoveDown={() =>
                        onMoveItem(item.id,
                            'down')} isFirst={index === 0} isLast={index === array.length - 1}>
                    <DynamicField fieldConfig={item.config} formData={formData}
                        onFieldChange={onFieldChange} errorText={errors[item.id]} />
                </ConfigurableWrapper>
            </Grid>);
            case 'table': return (<Grid sx={{ xs: 12 }} key={item.id}>
                <ConfigurableWrapper type="bảng"
                    onEdit={() =>
                        onOpenTableConfig(item.id)}
                    onDelete={() =>
                        onDeleteItem(item.id)}
                    onMoveUp={() =>
                        onMoveItem(item.id,
                            'up')}
                    onMoveDown={() =>
                        onMoveItem(item.id,
                            'down')} isFirst={index === 0} isLast={index === array.length - 1}>
                    <DynamicTableComponent tableConfig={item.config} tableData={formData[item.id] || []}
                        onTableChange={onTableChange} />
                </ConfigurableWrapper>
            </Grid>);
            default: return null;
        }
    };
    return (<Paper variant="outlined">
        <Box sx={{
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Tabs value={activeTab}
                onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ flexGrow: 1 }}>{componentConfig.tabs.map(tab =>
                    <Tab key={tab.id} label={<Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        {tab.label}<IconButton size="small" sx={{ p: 0.5 }}
                            onClick={(e) => {
                                e.stopPropagation();

                                onOpenTabConfig(componentId,
                                    tab.id);
                            }} title="Chỉnh sửa tên tab">
                            <Settings sx={{ fontSize: '1rem' }} />
                        </IconButton>
                    </Box>} />)}
            </Tabs>
            <IconButton
                onClick={() =>
                    onAddTab(componentId)} color="primary" title="Thêm Tab mới" sx={{
                        mr: 1,
                        ml: 1
                    }}>
                <AddCircleOutline />
            </IconButton>
        </Box>{componentConfig.tabs.map((tab, index) => (<Box role="tabpanel" hidden={activeTab !== index} key={tab.id} sx={{ p: 3 }}>
            {activeTab === index && (<Grid container spacing={3}>{tab.items.map((item, idx, arr) => renderLayoutItem(item,
                idx,
                arr))}<Grid sx={{ xs: 12 }} >
                    <Button variant="outlined" size="small" startIcon={<Add />}
                        onClick={() =>
                            onOpenAddComponentDialog({
                                parentId: componentId,
                                parentType: 'tab',
                                tabIndex: index
                            })} sx={{ mt: 2 }}>Thêm thành phần vào Tab</Button>
                </Grid>
            </Grid>)}
        </Box>))}
    </Paper>);
};


export default TabsComponent