import React, { useState, useEffect, useCallback } from 'react';
import {
    Grid, Button,
    Box, Typography, Paper,
    CircularProgress, Alert,
    Snackbar,
    TextField,
    Divider
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SaveIcon from '@mui/icons-material/Save';
import ReplayIcon from '@mui/icons-material/Replay';

//component
import ConfigurableWrapper from './ConfigurableWrapper';
import DynamicTableComponent from './DynamicTableComponent';
import AddComponentDialog from './AddComponentDialog';
import AIFormDialog from './AIFormDialog';
import FieldConfigDialog from './FieldConfigDialog';
import TableConfigDialog from './TableConfigDialog';
import DynamicField from './DynamicField';
import TabsComponent from './TabsComponent';
import StepperComponent from './StepperComponent';
import {
    AddComponentContext,
    ButtonConfig,
    DynFormData, Errors, FieldConfig, FieldLayoutItem, IDynamicForm, LayoutItem,
    LayoutItemConfig, ModalFormConfig,
    StepItem,
    StepperLayoutItem, TabItem, TableConfig,
    TabsLayoutItem
} from './types';
import TabConfigDialog from './TabConfigDialog';
import ModalButtonComponent from './ModalButtonComponent';
import ModalButtonConfigDialog from './ModalButtonConfigDialog';
import { getFormById, updatedForm } from 'src/apis/apiDynamicForm';
import ButtonConfigDialog from './ButtonConfigDialog';
import StepConfigDialog from './StepConfigDialog';
import DynamicButton from './DynamicButton';
import { parseDateExpression } from './functionCommon';

interface DynamicComponentProps {
    formKey?: string
}


export default function DynamicComponent({ formKey }: DynamicComponentProps): JSX.Element {

    const [addComponentContext, setAddComponentContext] = useState<AddComponentContext | null>(null);
    const [isButtonConfigOpen, setButtonConfigOpen] = useState(false);
    const [infoForm, setInfoForm] = useState<Partial<IDynamicForm>>({})
    const [layout, setLayout] = useState<LayoutItem[]>([]);
    const [formData, setFormData] = useState<DynFormData>({});
    const [errors, setErrors] = useState<Errors>({});
    const [isAddComponentOpen, setAddComponentOpen] = useState(false);
    const [isAiDialogOpen, setAiDialogOpen] = useState(false);
    const [isConfigOpen, setConfigOpen] = useState(false);
    const [isTableConfigOpen, setTableConfigOpen] = useState(false);
    const [isTabConfigOpen, setTabConfigOpen] = useState(false);
    const [isModalButtonConfigOpen, setModalButtonConfigOpen] = useState(false);
    const [isStepConfigOpen, setStepConfigOpen] = useState(false);
    const [editingTabInfo, setEditingTabInfo] = useState<{ componentId: string; tabId: string; currentLabel: string } | null>(null);
    const [editingStepInfo, setEditingStepInfo] = useState<{ componentId: string; stepId: string; currentLabel: string, currentAction: string } | null>(null);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [allFieldsFlat, setAllFieldsFlat] = useState<{ id: string, label: string }[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [addToTabInfo, setAddToTabInfo] = useState<{ componentId: string; tabIndex: number } | null>(null);
    const [allTables, setAllTables] = useState<{ id: string, label: string }[]>([]);
    // const [isAddComponentToTabOpen, setAddComponentToTabOpen] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });

    const actionRegistry: {
        [key: string]
        : (formData: DynFormData,
            setFormData: React.Dispatch<React.SetStateAction<FormData>>,
            setErrors: React.Dispatch<React.SetStateAction<Errors>>) => Promise<void>
    } = {
        VALIDATE_FORM: async (currentData, _, setErr) => {
            console.log("Validating form with data:", currentData);
            const newErrors: Errors = {};
            // if (!currentData.customer_name) {
            //     newErrors.customer_name = "Tên khách hàng là bắt buộc!";
            // }
            // setErr(newErrors);
            if (Object.keys(newErrors).length === 0) {
                setToast({ open: true, message: 'Form hợp lệ!', severity: 'success' });
            } else {
                setToast({ open: true, message: 'Form có lỗi, vui lòng kiểm tra lại!', severity: 'error' });
            }
        },
        VALIDATE_STEP_API: async (currentData, _, setErr) => {
            //const res = await apiCommonGet(currentData[key]);
        },
        CALL_MOCK_API: async (currentData, setFd, __) => {
            setToast({ open: true, message: 'Đang gọi API...', severity: 'info' });
            //const sn = await apiCommonGet();
            debugger
            // setFd(prev => ({ ...prev, serial_number: sn }));
            // setToast({ open: true, message: `Lấy số SN mới thành công: ${sn}`, severity: 'success' });
        }
    };

    const validateStepFields = (itemsToValidate: LayoutItem[]): Errors => {
        const stepErrors: Errors = {};
        const fieldConfigs = itemsToValidate.filter((i): i is FieldLayoutItem => i.type === 'field').map(i => i.config);

        fieldConfigs.forEach(fieldConfig => {
            const value = formData[fieldConfig.id];
            const validationRules = fieldConfig.validation || {};
            let hasError = false;

            setErrors(prev => { const newErrors = { ...prev }; delete newErrors[fieldConfig.id]; return newErrors; });

            if (validationRules.required && (value === undefined || value === null || value === '')) {
                stepErrors[fieldConfig.id] = 'Trường này là bắt buộc.'; hasError = true;
            }
            if (value && !hasError) {
                if (validationRules.minLength && String(value).length < validationRules.minLength) {
                    stepErrors[fieldConfig.id] = `Phải có ít nhất ${validationRules.minLength} ký tự.`;
                }
                if (validationRules.maxLength && String(value).length > validationRules.maxLength) {
                    stepErrors[fieldConfig.id] = `Không được vượt quá ${validationRules.maxLength} ký tự.`;
                }
                if (validationRules.minValue !== undefined && Number(value) < validationRules.minValue) {
                    stepErrors[fieldConfig.id] = `Giá trị phải lớn hơn hoặc bằng ${validationRules.minValue}.`;
                }
                if (validationRules.maxValue !== undefined && Number(value) > validationRules.maxValue) {
                    stepErrors[fieldConfig.id] = `Giá trị phải nhỏ hơn hoặc bằng ${validationRules.maxValue}.`;
                }
                if (validationRules.pattern) {
                    try {
                        const regex = new RegExp(validationRules.pattern);
                        if (!regex.test(String(value))) {
                            stepErrors[fieldConfig.id] = `Giá trị không khớp với định dạng yêu cầu.`;
                        }
                    }
                    catch (e) {
                        console.error("Invalid regex pattern:", validationRules.pattern);
                    }
                }
            }
        });

        // const fieldIdsInStep = fieldConfigs.map(f => f.id);
        // if (fieldIdsInStep.includes('promo_reason') && formData.promo_code?.toLowerCase().startsWith('vip') && !formData.promo_reason) { stepErrors.promo_reason = 'Vui lòng nhập lý do cho mã VIP.'; }

        if (Object.keys(stepErrors).length > 0) { setErrors(prev => ({ ...prev, ...stepErrors })); }
        return stepErrors;
    };
    useEffect(() => {
        const processDefaultValues = (items: LayoutItem[], initialData: DynFormData): DynFormData => {
            let data = { ...initialData };
            items.forEach(item => {
                if (item.type === 'field') {
                    const { id, type, config } = item.config;
                    if ((type === 'date' || type === 'datetime-local') && config?.defaultValue && data[id] === undefined) {
                        const val = parseDateExpression(config.defaultValue, type);
                        if (val) data[id] = val;
                    }
                } else if (item.type === 'tabs') {
                    item.config.tabs.forEach(tab => { data = processDefaultValues(tab.items, data); });
                } else if (item.type === 'stepper') {
                    item.config.steps.forEach(step => { data = processDefaultValues(step.items, data); });
                } else if (item.type === 'modal-button') {
                    data = processDefaultValues(item.config.layout, data);
                }
            });
            return data;
        };

        let initialFormData: DynFormData = {};
        layout.forEach(item => {
            if (item.type === 'table') {
                initialFormData[item.config.id] = [];
            }
        });
        initialFormData = processDefaultValues(layout, initialFormData);
        setFormData(initialFormData);

    }, [layout]);

    useEffect(() => {
        let dataChanged = false;
        let newFormData = { ...formData };

        if (formData.customer && formData.customer_address_dependency !== formData.customer) {
            (async () => {
                // const newAddress = await mockApi.getCustomerAddress(formData.customer);
                // setFormData(prev => ({ ...prev, delivery_address: newAddress, customer_address_dependency: formData.customer }));
            })();
        }
        if (formData.email && formData.username_dependency !== formData.email) {
            const username = formData.email.split('@')[0];
            newFormData = { ...newFormData, username: username, username_dependency: formData.email }; dataChanged = true;
        }

        if (dataChanged) { setFormData(newFormData); }
    }, [formData]);

    const loadInitialConfiguration = useCallback(async () => {
        if (!formKey) return
        const savedLayout = await getFormById(formKey);
        if (savedLayout.success) {
            const obj = savedLayout.data as IDynamicForm
            setInfoForm(obj)
            const dataMap = JSON.parse(obj.layoutJson)
            if (Array.isArray(dataMap) && dataMap.length > 0) {
                setLayout(dataMap);
                setToast({ open: true, message: 'Đã tải cấu hình đã lưu.', severity: 'info' });
            }
        }
        // (async () => { const serial = await mockApi.getSerialNumber(); setFormData(prev => ({ ...prev, serial_number: serial })); })();
    }, [formKey]);

    useEffect(() => {
        loadInitialConfiguration();
    }, [loadInitialConfiguration]);

    useEffect(() => {
        const flattenFields = (items: LayoutItem[]): { id: string, label: string }[] => {
            let fields: { id: string, label: string }[] = [];
            for (const item of items) {
                if (item.type === 'field')
                    fields.push({ id: item.config.id, label: item.config.label });
                else if (item.type === 'tabs')
                    fields = fields.concat(...item.config.tabs.map(tab => flattenFields(tab.items)));
                else if (item.type === 'stepper')
                    fields = fields.concat(...item.config.steps.map(step => flattenFields(step.items)));
            }
            return fields;
        };
        setAllFieldsFlat(flattenFields(layout));
    }, [layout]);


    const findLayoutItem = (items: LayoutItem[], id: string): LayoutItem | null => {
        for (const item of items) {
            if (item.id === id)
                return item;
            if (item.type === 'tabs') {
                for (const tab of item.config.tabs) {
                    const found = findLayoutItem(tab.items, id);
                    if (found) return found;
                }
            }
            if (item.type === 'stepper') {
                for (const step of item.config.steps) {
                    const found = findLayoutItem(step.items, id);
                    if (found) return found;
                }
            }
            if (item.type === 'modal-button') {
                const found = findLayoutItem(item.config.layout, id);
                if (found) return found;
            }
        }
        return null;
    };

    const handleFieldChange = (fieldId: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
        if (errors[fieldId]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldId];
                return newErrors;
            });
        }

        const fieldLayoutItem = findLayoutItem(layout, fieldId) as FieldLayoutItem | null;

        if (!fieldLayoutItem || !fieldLayoutItem.config.config?.onValueChange) {
            return;
        }

        fieldLayoutItem.config.config.onValueChange.forEach(action => {
            if (action.action === 'FETCH_AND_UPDATE') {
                if (!value) {
                    const updates: DynFormData = {};
                    action.targets && action.targets.forEach(target => {
                        updates[target.destinationField] = '';
                    });
                    setFormData(prev => ({ ...prev, ...updates }));
                    return;
                }
                const apiUrl = action.apiUrl.replace('{value}', encodeURIComponent(value));

                const executeApiCall = async () => {
                    try {
                        let responseData: any;
                        // if (apiUrl.startsWith('/api/customer/')) {
                        //     const customerId = apiUrl.split('/').pop();
                        //     if (customerId) {
                        //         responseData = await mockApi.getCustomerById(customerId);
                        //     }
                        // } else {
                        //     console.warn(`API call for ${apiUrl} is not mocked.`);
                        //     return;
                        // }

                        if (responseData) {
                            const updates: DynFormData = {};
                            action.targets && action.targets.forEach(target => {
                                const sourceValue = target.sourceKey === '.' ? responseData : responseData[target.sourceKey];
                                if (sourceValue !== undefined) {
                                    updates[target.destinationField] = sourceValue;
                                }
                            });
                            setFormData(prev => ({ ...prev, ...updates }));
                        }
                    } catch (err) {
                        console.error(`Action failed for API call to ${apiUrl}`, err);
                        setToast({ open: true, message: 'Lỗi khi tải dữ liệu động.', severity: 'error' });
                    }
                };

                executeApiCall();
            }
        });
    };
    const handleTableChange = (tableId: string, data: any[], tableType?: string) => {
        setFormData(prev => ({ ...prev, [tableId]: { typeName: tableType, value: data } }));
    }

    const addComponent = (type: LayoutItem['type']) => {
        if (!addComponentContext) return;
        const { parentId, parentType, tabIndex, stepIndex } = addComponentContext;
        let newComponent: LayoutItem;
        const id = `${type}_${Date.now()}`;
        switch (type) {
            case 'field':
                newComponent = {
                    id, type: 'field',
                    config: {
                        id, type: 'text', label: 'Trường mới', grid: 12,
                        validation: { required: false }, config: {}
                    }
                };
                break;
            case 'button': newComponent = { id, type: 'button', config: { id, label: 'Nút hành động', grid: 3, config: { variant: 'contained', color: 'primary', onClickAction: '' } } }; break;
            case 'tabs':
                newComponent = { id, type: 'tabs', config: { tabs: [{ id: `tab_${Date.now()}`, label: 'Tab 1', items: [] }] } };
                break;
            case 'stepper':
                newComponent = { id, type: 'stepper', config: { steps: [{ id: `step_${Date.now()}`, label: 'Bước 1', items: [] }] } };
                break;
            case 'table':
                newComponent = { id, type: 'table', config: { id, label: 'Bảng mới', columns: [{ id: 'col1', label: 'Cột 1', type: 'text' }] } };
                setFormData(prev => ({ ...prev, [id]: [] }));
                break;
            case 'modal-button':
                newComponent = {
                    id, type: 'modal-button',
                    config: {
                        buttonLabel: 'Mở Form',
                        dialogTitle: 'Form trong Dialog',
                        layout: [{
                            id: `modal_field_${Date.now()}`,
                            type: 'field', config: {
                                id: `modal_field_${Date.now()}`,
                                type: 'text',
                                label: 'Dữ liệu mới',
                                grid: 12,
                                validation: { required: true }
                            }
                        }]
                    }
                };
                break;
            default:
                return;
        }
        if (parentType === 'root') {
            setLayout(prev => [...prev, newComponent]);
        } else {
            setLayout(prevLayout => {
                const newLayout = JSON.parse(JSON.stringify(prevLayout));
                const parentComponent = findLayoutItem(newLayout, parentId);
                if (parentComponent) {
                    if (parentComponent.type === 'tabs' && tabIndex !== undefined) {
                        parentComponent.config.tabs[tabIndex].items.push(newComponent);
                    } else if (parentComponent.type === 'stepper' && stepIndex !== undefined) {
                        parentComponent.config.steps[stepIndex].items.push(newComponent);
                    }
                }
                return newLayout;
            });
        }
        setAddComponentOpen(false);
        setAddComponentContext(null);
    };

    const handleAiGenerate = (generatedItems: LayoutItem[]) => {
        setLayout(generatedItems);
        setFormData({});
    };

    const findAndModifyLayout = (items: LayoutItem[], id: string, callback: (item: LayoutItem) => LayoutItem | null): LayoutItem[] => items.map(item => {
        if (item.id === id)
            return callback(item);
        if (item.type === 'tabs') {
            const newTabs = item.config.tabs.map(tab => ({ ...tab, items: findAndModifyLayout(tab.items, id, callback) }));
            return {
                ...item, config: { ...item.config, tabs: newTabs }
            };
        }
        if (item.type === 'stepper') {
            const newSteps = item.config.steps.map(step => ({ ...step, items: findAndModifyLayout(step.items, id, callback) }));
            return {
                ...item,
                config: { ...item.config, steps: newSteps }
            };
        }
        if (item.type === 'modal-button') {
            const newLayout = findAndModifyLayout(item.config.layout, id, callback);
            return {
                ...item, config: { ...item.config, layout: newLayout }
            };
        }
        return item;
    }).filter((item): item is LayoutItem => item !== null);

    const findItemConfig = (items: LayoutItem[], id: string | null): LayoutItemConfig | null => {
        if (!id)
            return null;
        for (const item of items) {
            if (item.id === id)
                return item.config;
            if (item.type === 'tabs') {
                for (const tab of item.config.tabs) {
                    const found = findItemConfig(tab.items, id);
                    if (found) return found;
                }
            }
            if (item.type === 'stepper') {
                for (const step of item.config.steps) {
                    const found = findItemConfig(step.items, id);
                    if (found) return found;
                }
            }
        }
        return null;
    };

    const handleDeleteItem = (itemIdToDelete: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thành phần này?')) {
            setLayout(prevLayout => findAndModifyLayout(prevLayout, itemIdToDelete, () => null));
            const newFormData = { ...formData };
            delete newFormData[itemIdToDelete];
            setFormData(newFormData);
        }
    };

    const handleOpenConfig = (itemId: string) => {
        setEditingItemId(itemId);
        setConfigOpen(true);
    };

    const handleOpenTableConfig = (itemId: string) => {
        setEditingItemId(itemId);
        setTableConfigOpen(true);
    };

    const handleSaveConfig = (updatedConfig: any) => {
        setLayout(prevLayout => findAndModifyLayout(prevLayout, editingItemId!, (item) => ({ ...item, config: updatedConfig })));
        setConfigOpen(false); setTableConfigOpen(false); setEditingItemId(null);
    };


    const addTabToTabsComponent = (tabsComponentId: string) => {
        setLayout(prevLayout => {
            const newLayout = JSON.parse(JSON.stringify(prevLayout));
            const tabsComponent = newLayout.find((c: TabsLayoutItem) => c.id === tabsComponentId);
            if (tabsComponent)
                tabsComponent.config.tabs.push({ id: `tab_${Date.now()}`, label: `Tab ${tabsComponent.config.tabs.length + 1}`, items: [] });
            return newLayout;
        });
    };

    const addFieldToStep = (stepperComponentId: string, stepIndex: number) => {
        setLayout(prevLayout => {
            const newLayout = JSON.parse(JSON.stringify(prevLayout));
            const stepperComponent = newLayout.find((c: StepperLayoutItem) => c.id === stepperComponentId);
            if (stepperComponent && stepperComponent.config.steps[stepIndex]) {
                const fieldId = `field_${Date.now()}`;
                stepperComponent.config.steps[stepIndex].items.push({
                    id: fieldId, type: 'field', config: {
                        id: fieldId, type: 'text', label: 'Trường mới', grid: 12, validation: { required: false }, config: {}
                    }
                });
            }
            return newLayout;
        });
    };

    const addStepToStepperComponent = (stepperComponentId: string) => { setLayout(prevLayout => { const newLayout = JSON.parse(JSON.stringify(prevLayout)); const stepperComponent = newLayout.find((c: StepperLayoutItem) => c.id === stepperComponentId); if (stepperComponent) stepperComponent.config.steps.push({ id: `step_${Date.now()}`, label: `Bước ${stepperComponent.config.steps.length + 1}`, items: [] }); return newLayout; }); };

    const handleSaveConfiguration = async () => {
        setIsSaving(true);
        const res = await updatedForm({
            ...infoForm,
            layoutJson: JSON.stringify(layout)
        })
        if (res.success) {
            setIsSaving(false);
            setToast({ open: true, message: "Lưu thành công", severity: 'success' });
        }
        else {
            setIsSaving(false);
            setToast({ open: true, message: res.message || 'Lưu cấu hình thất bại.', severity: 'error' });
        }
    };

    const handleOpenTabConfig = (componentId: string, tabId: string) => {
        const tabsComponent = layout.find(c => c.id === componentId) as TabsLayoutItem | undefined;
        if (tabsComponent) {
            const tab = tabsComponent.config.tabs.find(t => t.id === tabId);
            if (tab) {
                setEditingTabInfo({ componentId, tabId, currentLabel: tab.label });
                setTabConfigOpen(true);
            }
        }
    };

    const handleSaveTabConfig = (newLabel: string) => {
        if (!editingTabInfo)
            return;
        const { componentId, tabId } = editingTabInfo;
        setLayout(prevLayout => {
            const newLayout = JSON.parse(JSON.stringify(prevLayout));
            const tabsComponent = newLayout.find((c: LayoutItem): c is TabsLayoutItem => c.id === componentId);
            if (tabsComponent) {
                const tabToUpdate = tabsComponent.config.tabs.find((t: TabItem) => t.id === tabId);
                if (tabToUpdate) { tabToUpdate.label = newLabel; }
            }
            return newLayout;
        });
        setTabConfigOpen(false);
        setEditingTabInfo(null);
    };

    const handleDeleteTabConfig = () => {

        if (!editingTabInfo)
            return;
        if (window.confirm('Bạn có chắc chắn muốn xóa tab này?')) {
            const { componentId, tabId } = editingTabInfo;
            setLayout(prevLayout => {
                const newLayout = JSON.parse(JSON.stringify(prevLayout));
                const tabsComponent = newLayout.find((c: LayoutItem): c is TabsLayoutItem => c.id === componentId);
                if (tabsComponent) tabsComponent.config.tabs = tabsComponent.config.tabs.filter(
                    (t: TabItem) => t.id !== tabId
                );
                return newLayout;
            });
            setTabConfigOpen(false);
            setEditingTabInfo(null);
        }
    };

    const handleModalSubmit = (modalData: DynFormData, targetId?: string, action?: 'ADD_TO_TABLE') => {
        if (action === 'ADD_TO_TABLE' && targetId) {
            setFormData(prev => {
                const currentTableData = prev[targetId] || [];
                const newTableData = [...currentTableData, modalData];
                return { ...prev, [targetId]: newTableData };
            });
            setToast({ open: true, message: 'Đã thêm dữ liệu vào bảng thành công!', severity: 'success' });
        }
    };
    const executeAction = async (actionName: string) => {
        const action = actionRegistry[actionName];
        if (action) {
            try {
                await action(formData, setFormData, setErrors);
            } catch (error: any) {
                console.error(`Action "${actionName}" failed:`, error);
                setToast({ open: true, message: error.message || `Hành động "${actionName}" thất bại!`, severity: 'error' });
                throw error; // Re-throw to be caught by the caller (e.g., StepperComponent)
            }
        } else {
            console.warn(`Action "${actionName}" not found in registry.`);
            setToast({ open: true, message: `Hành động "${actionName}" không tồn tại!`, severity: 'warning' });
            throw new Error("Action not found");
        }
    };

    const handleOpenModalButtonConfig = (itemId: string) => {
        setEditingItemId(itemId);
        setModalButtonConfigOpen(true);
    };

    const handleSaveModalButtonConfig = (updatedConfig: Partial<ModalFormConfig>) => {
        //setLayout(prevLayout => findAndModifyLayout(prevLayout, editingItemId!, (item) => ({ ...item, config: { ...(item.config as ModalFormConfig), ...updatedConfig } })));
        setModalButtonConfigOpen(false);
        setEditingItemId(null);
    };
    const handleSaveStepConfig = (newConfig: { label: string, onNextAction: string }) => {
        if (!editingStepInfo) return;
        const { componentId, stepId } = editingStepInfo;
        setLayout(prevLayout => {
            const newLayout = JSON.parse(JSON.stringify(prevLayout));
            const stepperComponent = newLayout.find((c: LayoutItem): c is StepperLayoutItem => c.id === componentId);
            if (stepperComponent) {
                const stepToUpdate = stepperComponent.config.steps.find((s: StepItem) => s.id === stepId);
                if (stepToUpdate) {
                    stepToUpdate.label = newConfig.label;
                    stepToUpdate.onNextAction = newConfig.onNextAction;
                }
            }
            return newLayout;
        });
        setStepConfigOpen(false);
        setEditingStepInfo(null);
    };



    const handleOpenStepConfig = (componentId: string, stepId: string) => {
        const stepperComponent = layout.find(c => c.id === componentId) as StepperLayoutItem | undefined;
        if (stepperComponent) {
            const step = stepperComponent.config.steps.find(s => s.id === stepId);
            if (step) {
                setEditingStepInfo({ componentId, stepId, currentLabel: step.label, currentAction: step.onNextAction || '' });
                setStepConfigOpen(true);
            }
        }
    };


    const handleOpenAddComponentDialog = (context: AddComponentContext) => { setAddComponentContext(context); setAddComponentOpen(true); };

    const handleOpenButtonConfig = (itemId: string) => { setEditingItemId(itemId); setButtonConfigOpen(true); };

    const handleChangeInfoForm = (field: keyof IDynamicForm, value: any) => {
        setInfoForm(prev => ({ ...prev, [field]: value }));
    };


    const handleOnSubmitForm = (e: any) => {
        e.preventDefault()
        // sẽ gọi api test thử
        debugger
    }



    const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
        const findAndReorder = (items: LayoutItem[]): LayoutItem[] => {
            const index = items.findIndex(i => i.id === itemId);
            if (index !== -1) {
                const newIndex = direction === 'up' ? index - 1 : index + 1;
                if (newIndex < 0 || newIndex >= items.length) return items;
                const newItems = [...items];
                [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
                return newItems;
            }

            return items.map(item => {
                if (item.type === 'tabs') {
                    const newTabs = item.config.tabs.map(tab => ({
                        ...tab,
                        items: findAndReorder(tab.items)
                    }));
                    return { ...item, config: { ...item.config, tabs: newTabs } };
                }
                if (item.type === 'stepper') {
                    const newSteps = item.config.steps.map(step => ({
                        ...step,
                        items: findAndReorder(step.items)
                    }));
                    return { ...item, config: { ...item.config, steps: newSteps } };
                }
                return item;
            });
        };
        setLayout(prevLayout => findAndReorder(prevLayout));
    };

    const renderLayoutItem = (item: LayoutItem, index: number, array: LayoutItem[]) => {
        const commonProps = {
            onMoveUp: () => handleMoveItem(item.id, 'up'),
            onMoveDown: () => handleMoveItem(item.id, 'down'),
            isFirst: index === 0,
            isLast: index === array.length - 1
        };
        switch (item.type) {
            case 'field':
                return (<Grid item xs={12} sm={item.config.grid} key={item.id}>
                    <ConfigurableWrapper type="trường"
                        onEdit={() => handleOpenConfig(item.id)}
                        onDelete={() => handleDeleteItem(item.id)}
                        {...commonProps}>
                        <DynamicField fieldConfig={item.config} formData={formData}
                            onFieldChange={handleFieldChange} errorText={errors[item.id]} />
                    </ConfigurableWrapper>
                </Grid>);
            case 'tabs':
                return (<Grid item
                    xs={12}
                    key={item.id}>
                    <ConfigurableWrapper type="tab"
                        onDelete={() => handleDeleteItem(item.id)}
                        {...commonProps}>
                        <TabsComponent componentId={item.id} componentConfig={item.config} formData={formData}
                            onFieldChange={handleFieldChange}
                            onTableChange={handleTableChange}
                            onAddTab={addTabToTabsComponent}
                            onOpenConfig={handleOpenConfig}
                            onDeleteItem={handleDeleteItem}
                            onOpenTableConfig={handleOpenTableConfig}
                            onOpenTabConfig={handleOpenTabConfig}
                            onOpenAddComponentDialog={handleOpenAddComponentDialog}
                            errors={errors} onMoveItem={handleMoveItem} />
                    </ConfigurableWrapper>
                </Grid>);
            case 'table':
                return (<Grid item xs={12} key={item.id}>
                    <ConfigurableWrapper type="bảng"
                        onEdit={() => handleOpenTableConfig(item.id)}
                        onDelete={() => handleDeleteItem(item.id)} {...commonProps}>
                        <DynamicTableComponent tableConfig={item.config}
                            tableData={formData[item.id]?.value || []} onTableChange={handleTableChange} />
                    </ConfigurableWrapper>
                </Grid>);
            case 'stepper':
                return (<Grid item xs={12} key={item.id}>
                    <ConfigurableWrapper type="stepper"
                        onDelete={() => handleDeleteItem(item.id)} {...commonProps}>
                        <StepperComponent componentId={item.id} componentConfig={item.config}
                            formData={formData} onFieldChange={handleFieldChange}
                            onTableChange={handleTableChange} onAddStep={addStepToStepperComponent} onOpenConfig={handleOpenConfig}
                            onDeleteItem={handleDeleteItem} onOpenTableConfig={handleOpenTableConfig} errors={errors} onValidateStep={validateStepFields}
                            onOpenStepConfig={handleOpenStepConfig} onExecuteAction={executeAction}
                            onMoveItem={handleMoveItem} onOpenAddComponentDialog={handleOpenAddComponentDialog} />
                    </ConfigurableWrapper>
                </Grid>);
            case 'modal-button':
                return (<Grid item
                    xs={12} key={item.id}>
                    <ConfigurableWrapper type="nút modal"
                        onEdit={() => handleOpenModalButtonConfig(item.id)}
                        onDelete={() => handleDeleteItem(item.id)}
                        {...commonProps}>
                        <ModalButtonComponent componentConfig={item.config} onModalSubmit={handleModalSubmit} />
                    </ConfigurableWrapper>
                </Grid>);
            case 'button':
                return (<Grid item
                    xs={12}
                    sm={item.config.grid}
                    key={item.id}>
                    <ConfigurableWrapper type="nút hành động"
                        onEdit={() => handleOpenButtonConfig(item.id)}
                        onDelete={() => handleDeleteItem(item.id)}
                        {...commonProps}>
                        <DynamicButton componentConfig={item.config} onAction={executeAction} />
                    </ConfigurableWrapper>
                </Grid>);
            default:
                return null;
        }
    };
    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Paper sx={{ p: 15, margin: 'auto' }}>
                <Typography variant="h4" component="h1" gutterBottom>Trình tạo Form</Typography>
                <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button variant="contained" startIcon={<AutoAwesomeIcon />}
                        onClick={() => setAiDialogOpen(true)}>
                        Tạo bằng AI
                    </Button>
                    <Button variant="outlined" startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                        onClick={handleSaveConfiguration}
                        disabled={isSaving}>
                        {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
                    </Button>
                    <Button variant="outlined" startIcon={<ReplayIcon />} onClick={loadInitialConfiguration}>
                        Tải lại
                    </Button>
                </Box>
                <Typography variant="h5" gutterBottom>{infoForm.formName}</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pb: 10 }}>
                    <TextField label="Tên trang" value={infoForm.formName} onChange={(e) => handleChangeInfoForm('formName', e.target.value)} fullWidth
                        helperText="Tên trang, form" />
                    <TextField label="Gửi tới URL" value={infoForm.submitUrl} onChange={(e) => handleChangeInfoForm('submitUrl', e.target.value)} fullWidth
                        helperText="Là link khi gửi form. Nếu là store điền: DynamicStore/+ tên store" />
                </Box>
                <Divider sx={{ my: 10 }} >Thành phần</Divider>
                <Box component="form" onSubmit={handleOnSubmitForm} id={infoForm.id || 'dynamic-form-id'}>
                    <Grid container spacing={3}>
                        {layout.length === 0 && <Grid item xs={12}><Typography align="center" color="text.secondary" sx={{ p: 4 }}>Đang tải cấu hình...</Typography></Grid>}
                        {layout.map((item, index, arr) => renderLayoutItem(item, index, arr))}
                        <Grid item xs={12}>
                            <Button fullWidth startIcon={<AddCircleOutlineIcon />}
                                onClick={() => setAddComponentOpen(true)} sx={{ mt: 2, p: 3, borderStyle: 'dashed', borderWidth: '2px', color: 'text.secondary', '&:hover': { backgroundColor: 'action.hover' } }}>
                                Thêm thành phần
                            </Button>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 4 }}>
                            <Button type="submit" variant="contained" color="primary" size="large" onClick={handleOnSubmitForm}>
                                Gửi dữ liệu
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ mt: 5, p: 2, backgroundColor: '#eee', borderRadius: 1 }}>
                    <Typography variant="h6">Dữ liệu Form hiện tại (JSON)</Typography>
                    <pre>{JSON.stringify(formData, null, 2)}</pre>
                </Box>
            </Paper>


            <AddComponentDialog open={isAddComponentOpen} onClose={() => setAddComponentOpen(false)} onSelect={addComponent} context={addComponentContext} />
            <AIFormDialog open={isAiDialogOpen} onClose={() => setAiDialogOpen(false)} onGenerate={handleAiGenerate} />
            <FieldConfigDialog open={isConfigOpen} onClose={() => setConfigOpen(false)} onSave={handleSaveConfig as any} existingFieldConfig={findItemConfig(layout, editingItemId) as FieldConfig | null} allFields={allFieldsFlat} />
            <TableConfigDialog open={isTableConfigOpen} onClose={() => setTableConfigOpen(false)} onSave={handleSaveConfig as any} existingTableConfig={findItemConfig(layout, editingItemId) as TableConfig | null} />
            <TabConfigDialog open={isTabConfigOpen} onClose={() => setTabConfigOpen(false)} onSave={handleSaveTabConfig} currentLabel={editingTabInfo?.currentLabel || ''} onDelete={handleDeleteTabConfig} />
            <StepConfigDialog
                open={isStepConfigOpen}
                onClose={() => setStepConfigOpen(false)}
                onSave={handleSaveStepConfig}
                currentLabel={editingStepInfo?.currentLabel || ''}
                currentAction={editingStepInfo?.currentAction || ''}
                availableActions={Object.keys(actionRegistry)} />
            <ModalButtonConfigDialog
                open={isModalButtonConfigOpen}
                onClose={() => setModalButtonConfigOpen(false)}
                onSave={handleSaveModalButtonConfig}
                existingConfig={findItemConfig(layout, editingItemId) as ModalFormConfig | null}
                availableTables={allTables} />
            <ButtonConfigDialog
                open={isButtonConfigOpen}
                onClose={() => setButtonConfigOpen(false)}
                onSave={handleSaveConfig as any}
                existingConfig={findItemConfig(layout, editingItemId) as ButtonConfig | null}
                availableActions={Object.keys(actionRegistry)} />
            <Snackbar open={toast.open} autoHideDuration={6000}
                onClose={() => setToast(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setToast(prev => ({ ...prev, open: false }))}
                    severity={toast.severity} sx={{ width: '100%' }}>{toast.message}</Alert>
            </Snackbar>
        </Box>
    );
}