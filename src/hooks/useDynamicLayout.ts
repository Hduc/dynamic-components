import { createContext, useEffect, useState } from "react";
import { AddComponentContext, BaseLayoutItem, DynFormData, Errors, IDynamicForm, Layout, LayoutItem, LayoutItemConfig } from "../types";
import { mockApi } from "../config/mockApi";
import { parseDateExpression } from "../components/common/fuc_common";
import { StepItem } from "../types/step";
import { TabItem, TabsConfig } from "../types/tab";

export function useDynamicLayout() {
  const [infoForm, setInfoForm] = useState<Partial<IDynamicForm>>({})
  const [layout, setLayout] = useState<Layout>([]);
  const [formData, setFormData] = useState<DynFormData>({});
  const [errors, setErrors] = useState<Errors>({});
  const [isAddComponentOpen, setAddComponentOpen] = useState(false);
  const [addComponentContext, setAddComponentContext] = useState<AddComponentContext | null>(null);
  const [isAiDialogOpen, setAiDialogOpen] = useState(false);
  const [isConfigOpen, setConfigOpen] = useState(false);
  const [isTableConfigOpen, setTableConfigOpen] = useState(false);
  const [isTabConfigOpen, setTabConfigOpen] = useState(false);
  const [isStepConfigOpen, setStepConfigOpen] = useState(false);
  const [isButtonConfigOpen, setButtonConfigOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [editingTabInfo, setEditingTabInfo] = useState<{
    componentId: string;
    tabId: string;
    currentLabel: string
  } | null>(null);


  const [editingStepInfo, setEditingStepInfo] = useState<{
    componentId: string;
    stepId: string;
    currentLabel: string,
    currentAction: string
  } | null>(null);

  const [allFieldsFlat, setAllFieldsFlat] = useState<{
    id: string,
    label: string
  }[]>([]);

  const [allTables, setAllTables] = useState<{
    id: string,
    label: string
  }[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });


  const actionRegistry: {
    [key: string]: (formData: DynFormData,
      setFormData: React.Dispatch<React.SetStateAction<DynFormData>>,
      setErrors: React.Dispatch<React.SetStateAction<Errors>>) => Promise<void>
  } = {
    VALIDATE_FORM: async (currentData,
      _,
      setErr) => {
      console.log("Validating form with data:", currentData);
      const newErrors: Errors = {};
      if (!currentData.customer_name) {
        newErrors.customer_name = "Tên khách hàng là bắt buộc!";
      }
      setErr(newErrors);
      if (Object.keys(newErrors).length === 0) {
        setToast({
          open: true,
          message: 'Form hợp lệ!',
          severity: 'success'
        });
      } else {
        setToast({
          open: true,
          message: 'Form có lỗi,vui lòng kiểm tra lại!', severity: 'error'
        });
      }
    },
    VALIDATE_STEP_API: async () => {
      await mockApi.validateStepData();
    },
    CALL_MOCK_API: async (currentData,
      setFd,
      __) => {
      setToast({
        open: true,
        message: 'Đang gọi API...',
        severity: 'info'
      });
      const sn = await mockApi.getSerialNumber();
      setFd(prev => ({
        ...prev,
        serial_number: sn
      }));
      setToast({
        open: true,
        message: `Lấy số SN mới thành công: ${sn}`,
        severity: 'success'
      });
    }
  };

  const validateStepFields = (itemsToValidate: Layout): Errors => {
    const stepErrors: Errors = {};
    const fieldConfigs = itemsToValidate.filter((i): i is BaseLayoutItem<'field'> => i.type === 'field').map(i => i.config);

    fieldConfigs.forEach(fieldConfig => {
      const value = formData[fieldConfig.id];
      const validationRules = fieldConfig.validation || {};
      let hasError = false;

      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldConfig.id];
        return newErrors;
      });

      if (validationRules.required && (value === undefined || value === null || value === '')) {
        stepErrors[fieldConfig.id] = 'Trường này là bắt buộc.';
        hasError = true;
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
          } catch (e) {
            console.error("Invalid regex pattern:",
              validationRules.pattern);
          }
        }
      }
    });

    if (Object.keys(stepErrors).length > 0) {
      setErrors(prev => ({
        ...prev,
        ...stepErrors
      }));
    }
    return stepErrors;
  };



  useEffect(() => {
    const processDefaultValues = (items: Layout,
      initialData: DynFormData): DynFormData => {
      let data = { ...initialData };
      items.forEach(item => {
        if (item.type === 'field') {
          const { id, inputType, config } = item.config;
          if ((inputType === 'date' || inputType === 'datetime-local') && config?.defaultValue && data[id] === undefined) {
            const val = parseDateExpression(config.defaultValue, inputType);
            if (val) data[id] = val;
          }
        } else if (item.type === 'tabs') {
          item.config.tabs.forEach(tab => {
            data = processDefaultValues(tab.items,
              data);
          });
        } else if (item.type === 'stepper') {
          item.config.steps.forEach(step => {
            data = processDefaultValues(step.items,
              data);
          });
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
    initialFormData = processDefaultValues(layout,
      initialFormData);
    setFormData(initialFormData);

  }, [layout]);



  useEffect(() => {
    const flattenLayout = (items: Layout): {
      fields: { id: string, label: string }[],
      tables: { id: string, label: string }[]
    } => {
      let fields: { id: string, label: string }[] = [];
      let tables: { id: string, label: string }[] = [];
      for (const item of items) {
        if (item.type === 'field') fields.push({
          id: item.config.id,
          label: item.config.label
        });
        else if (item.type === 'table') tables.push({
          id: item.config.id,
          label: item.config.label
        });
        else if (item.type === 'tabs') {
          const nested = item.config.tabs.map((tab: any) => flattenLayout(tab.items));
          nested.forEach((n: any) => {
            fields = fields.concat(n.fields);
            tables = tables.concat(n.tables);
          })
        }
        else if (item.type === 'stepper') {
          const nested = item.config.steps.map((step: any) => flattenLayout(step.items));
          nested.forEach((n: any) => {
            fields = fields.concat(n.fields);
            tables = tables.concat(n.tables);
          })
        }
      }
      return { fields, tables };
    };
    const { fields,
      tables } = flattenLayout(layout);
    setAllFieldsFlat(fields);
    setAllTables(tables);
  }, [layout]);


  const findItemConfig = (items: LayoutItem[], id: string | null): LayoutItemConfig | null => {
    if (!id) return null;
    for (const item of items) {
      if (item.id === id) return item.config;
      if (item.type === 'tabs') {
        for (const tab of item.config.tabs) {
          const found = findItemConfig(tab.items,
            id);
          if (found) return found;
        }
      } if (item.type === 'stepper') {
        for (const step of item.config.steps) {
          const found = findItemConfig(step.items,
            id);
          if (found) return found;
        }
      }
    } return null;
  };

  const findLayoutItem = (items: Layout, id: string): LayoutItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.type === 'tabs') {
        for (const tab of item.config.tabs) {
          const found = findLayoutItem(tab.items,
            id);
          if (found) return found;
        }
      } if (item.type === 'stepper') {
        for (const step of item.config.steps) {
          const found = findLayoutItem(step.items,
            id);
          if (found) return found;
        }
      }
    } return null;
  };


  const findAndModifyLayout = (items: Layout, id: string, callback: (item: LayoutItem) => LayoutItem | null): Layout => items.map(item => {
    if (item.id === id) return callback(item);
    if (item.type === 'tabs') {
      const newTabs = item.config.tabs.map((tab: any) => ({
        ...tab,
        items: findAndModifyLayout(tab.items,
          id,
          callback)
      }));
      return {
        ...item,
        config: {
          ...item.config,
          tabs: newTabs
        }
      };
    } if (item.type === 'stepper') {
      const newSteps = item.config.steps.map((step: any) => ({
        ...step,
        items: findAndModifyLayout(step.items,
          id,
          callback)
      }));
      return {
        ...item,
        config: {
          ...item.config,
          steps: newSteps
        }
      };
    }
  }).filter((item): item is LayoutItem => item !== null);

  //////////////////////////////////// handle//////////////////////////////////////////////////////////////////////////////////////////
  const handleFieldChangeAndActions = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }

    const fieldLayoutItem = findLayoutItem(layout, fieldId) as BaseLayoutItem<'field'> | undefined;

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
          setFormData(prev => ({
            ...prev,
            ...updates
          }));
          return;
        }
        const apiUrl = action.apiUrl.replace('{value}',
          encodeURIComponent(value));

        const executeApiCall = async () => {
          try {
            let responseData: any;
            if (apiUrl.startsWith('/api/customer/')) {
              const customerId = apiUrl.split('/').pop();
              if (customerId) {
                responseData = await mockApi.getCustomerById(customerId);
              }
            } else {
              console.warn(`API call for ${apiUrl} is not mocked.`);
              return;
            }

            if (responseData) {
              const updates: DynFormData = {};
              action.targets && action.targets.forEach((target: any) => {
                const sourceValue = target.sourceKey === '.' ? responseData : responseData[target.sourceKey];
                if (sourceValue !== undefined) {
                  updates[target.destinationField] = sourceValue;
                }
              });
              setFormData(prev => ({
                ...prev,
                ...updates
              }));
            }
          } catch (err) {
            console.error(`Action failed for API call to ${apiUrl}`,
              err);
            setToast({
              open: true,
              message: 'Lỗi khi tải dữ liệu động.',
              severity: 'error'
            });
          }
        };

        executeApiCall();
      }
    });
  };

  const handleTableChange = (tableId: string, data: any[]) => setFormData(prev => ({ ...prev, [tableId]: data }));

  const addComponent = (type: LayoutItem['type']) => {
    debugger
    if (!addComponentContext) return;

    const { parentId,
      parentType,
      tabIndex,
      stepIndex } = addComponentContext;
    let newComponent: LayoutItem;
    const id = `${type}_${Date.now()}`;

    switch (type) {
      case 'field': newComponent = {
        id,
        type: 'field',
        config: {
          type: 'field',
          id,
          inputType: 'text',
          label: 'Trường mới',
          grid: 12,
          validation: { required: false },
          config: {}
        }
      };
        break;
      case 'table': newComponent = {
        id,
        type: 'table',
        config: {
          id,
          type: 'table',
          label: 'Bảng mới',
          columns: [{
            id: 'col1',
            label: 'Cột 1',
            type: 'text',
            visible: true
          }]
        }
      };
        setFormData(prev => ({
          ...prev,
          [id]: []
        }));
        break;
      case 'button': newComponent = {
        id,
        type: 'button',
        config: {
          id,
          type: 'button',
          label: 'Nút hành động',
          grid: 3,
          config: {
            variant: 'contained',
            color: 'primary',
            onClickAction: ''
          }
        }
      };
        break;
      case 'tabs': newComponent = {
        id,
        type: 'tabs',
        config: {
          id,
          type: 'tabs',
          tabs: [{
            id: `tab_${Date.now()}`,
            label: 'Tab 1',
            items: []
          }]
        }
      };
        break;
      case 'stepper': newComponent = {
        id,
        type: 'stepper',
        config: {
          id,
          type: 'stepper',
          steps: [{
            id: `step_${Date.now()}`,
            label: 'Bước 1',
            items: []
          }]
        }
      };
        break;
      default: return;
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
    debugger
    setAddComponentOpen(false);
    setAddComponentContext(null);
  };

  const handleAiGenerate = (generatedItems: Layout) => {
    setLayout(generatedItems);
    setFormData({});
  };

  const handleDeleteItem = (itemIdToDelete: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành phần này?')) {
      setLayout(prevLayout => findAndModifyLayout(prevLayout,
        itemIdToDelete,
        () => null));
      const newFormData = { ...formData };
      delete newFormData[itemIdToDelete];
      setFormData(newFormData);
    }
  };

  const handleOpenConfig = (itemId: string) => {
    debugger
    setEditingItemId(itemId);
    setConfigOpen(true);
  };

  const handleOpenTableConfig = (itemId: string) => {
    setEditingItemId(itemId);
    setTableConfigOpen(true);
  };

  const handleOpenButtonConfig = (itemId: string) => {
    setEditingItemId(itemId);
    setButtonConfigOpen(true);
  };

  const handleSaveConfig = (updatedConfig: any) => {
    setLayout(prevLayout => findAndModifyLayout(prevLayout,
      editingItemId!,
      (item) => ({
        ...item,
        config: updatedConfig
      })));
    setConfigOpen(false);
    setTableConfigOpen(false);
    setButtonConfigOpen(false);
    setEditingItemId(null);
  };

  const handleOpenAddComponentDialog = (context: AddComponentContext) => {
    debugger
    setAddComponentContext(context);
    setAddComponentOpen(true);
  };

  const addTabToTabsComponent = (tabsComponentId: string) => {
    setLayout(prevLayout => {
      const newLayout = JSON.parse(JSON.stringify(prevLayout));
      const tabsComponent = newLayout.find((c: any) => c.id === tabsComponentId);
      if (tabsComponent) tabsComponent.config.tabs.push({
        id: `tab_${Date.now()}`,
        label: `Tab ${tabsComponent.config.tabs.length + 1}`,
        items: []
      });
      return newLayout;
    });
  };

  const addStepToStepperComponent = (stepperComponentId: string) => {
    setLayout(prevLayout => {
      const newLayout = JSON.parse(JSON.stringify(prevLayout));
      const stepperComponent = newLayout.find((c: any) => c.id === stepperComponentId);
      if (stepperComponent) stepperComponent.config.steps.push({
        id: `step_${Date.now()}`,
        label: `Bước ${stepperComponent.config.steps.length + 1}`,
        items: []
      });
      return newLayout;
    });
  };

  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    try {
      const response = await mockApi.saveFormConfiguration(1,
        layout);
      setToast({
        open: true,
        message: response.message,
        severity: 'success'
      });
    } catch (error: any) {
      setToast({
        open: true,
        message: error.message || 'Lưu cấu hình thất bại.',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenTabConfig = (componentId: string,
    tabId: string) => {
    const tabsComponent = layout.find(c => c.id === componentId) as BaseLayoutItem<'tabs'> | undefined;
    if (tabsComponent) {
      const tab = tabsComponent.config.tabs.find(t => t.id === tabId);
      if (tab) {
        setEditingTabInfo({
          componentId,
          tabId,
          currentLabel: tab.label
        });
        setTabConfigOpen(true);
      }
    }
  };

  const handleSaveTabConfig = (newLabel: string) => {
    if (!editingTabInfo) return;
    const { componentId,
      tabId } = editingTabInfo;
    setLayout(prevLayout => {
      const newLayout = JSON.parse(JSON.stringify(prevLayout));
      const tabsComponent = newLayout.find((c: LayoutItemConfig) => c.id === componentId) as BaseLayoutItem<'tabs'> | undefined;
      if (tabsComponent) {
        const tabToUpdate = tabsComponent.config.tabs.find((t: TabItem) => t.id === tabId);
        if (tabToUpdate) {
          tabToUpdate.label = newLabel;
        }
      } return newLayout;
    });
    setTabConfigOpen(false);
    setEditingTabInfo(null);
  };

  const handleOpenStepConfig = (componentId: string,
    stepId: string) => {
    const stepperComponent = layout.find(c => c.id === componentId) as BaseLayoutItem<'stepper'> | undefined;
    if (stepperComponent) {
      const step = stepperComponent.config.steps.find(s => s.id === stepId);
      if (step) {
        setEditingStepInfo({
          componentId,
          stepId,
          currentLabel: step.label,
          currentAction: step.onNextAction || ''
        });
        setStepConfigOpen(true);
      }
    }
  };

  const handleSaveStepConfig = (newConfig: {
    label: string,
    onNextAction: string
  }) => {
    if (!editingStepInfo) return;
    const { componentId,
      stepId } = editingStepInfo;
    setLayout(prevLayout => {
      const newLayout = JSON.parse(JSON.stringify(prevLayout));
      const stepperComponent = newLayout.find((c: LayoutItemConfig) => c.id === componentId);
      if (stepperComponent) {
        const stepToUpdate = stepperComponent.config.steps.find((s: StepItem) => s.id === stepId);
        if (stepToUpdate) {
          stepToUpdate.label = newConfig.label;
          stepToUpdate.onNextAction = newConfig.onNextAction;
        }
      } return newLayout;
    });
    setStepConfigOpen(false);
    setEditingStepInfo(null);
  };

  const handleModalSubmit = (modalData: DynFormData,
    targetId?: string,
    action?: string) => {
    console.log("Modal submitted:",
      {
        modalData,
        targetId,
        action
      });
    if (action === 'ADD_TO_TABLE' && targetId) {
      setFormData(prev => {
        const currentTableData = prev[targetId] || [];
        const newTableData = [...currentTableData,
          modalData];
        return {
          ...prev,
          [targetId]: newTableData
        };
      });
      setToast({
        open: true,
        message: 'Đã thêm dữ liệu vào bảng thành công!',
        severity: 'success'
      });
    }
  };

  const executeAction = async (actionName: string) => {
    const action = actionRegistry[actionName];
    if (action) {
      try {
        await action(formData,
          setFormData,
          setErrors);
      } catch (error: any) {
        console.error(`Action "${actionName}" failed:`,
          error);
        setToast({
          open: true,
          message: error.message || `Hành động "${actionName}" thất bại!`,
          severity: 'error'
        });
        throw error;
        // Re-throw to be caught by the caller (e.g.,StepperComponent)
      }
    } else {
      console.warn(`Action "${actionName}" not found in registry.`);
      setToast({
        open: true,
        message: `Hành động "${actionName}" không tồn tại!`,
        severity: 'warning'
      });
      throw new Error("Action not found");
    }
  };

  const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
    const findAndReorder = (items: Layout): Layout => {
      const index = items.findIndex(i => i.id === itemId);
      if (index !== -1) {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= items.length) return items;
        const newItems = [...items];
        [newItems[index],
        newItems[newIndex]] = [newItems[newIndex],
        newItems[index]];
        return newItems;
      }

      return items.map(item => {
        if (item.type === 'tabs') {
          const tabsItem = item as BaseLayoutItem<'tabs'>;
          const newTabs = tabsItem.config.tabs.map((tab: any) => ({
            ...tab,
            items: findAndReorder(tab.items)
          }));
          return {
            ...item,
            config: {
              ...tabsItem.config,
              tabs: newTabs
            }
          };
        }
        if (item.type === 'stepper') {
          const newSteps = item.config.steps.map((step: any) => ({
            ...step,
            items: findAndReorder(step.items)
          }));
          return {
            ...item,
            config: {
              ...item.config,
              steps: newSteps
            }
          };
        }
        return item;
      });
    };
    setLayout(prevLayout => findAndReorder(prevLayout));
  };

  return {
    infoForm,
    layout,
    formData,
    errors,
    editingItemId,
    editingTabInfo,
    editingStepInfo,
    addComponentContext,
    isConfigOpen,
    isTableConfigOpen,
    isTabConfigOpen,
    isStepConfigOpen,
    isButtonConfigOpen,
    isAiDialogOpen,
    toast,
    isSaving,
    isAddComponentOpen,
    allFieldsFlat,
    allTables,
    actionRegistry,

    findItemConfig,
    setStepConfigOpen,
    setAiDialogOpen,
    setConfigOpen,
    setLayout,
    setToast,
    setInfoForm,
    setAddComponentOpen,
    setTableConfigOpen,
    setTabConfigOpen,
    setButtonConfigOpen,
    validateStepFields,
    handleFieldChangeAndActions,
    handleTableChange,
    addComponent,
    handleAiGenerate,
    handleDeleteItem,
    handleOpenConfig,
    handleOpenTableConfig,
    handleOpenButtonConfig,
    handleSaveConfig,
    handleOpenAddComponentDialog,
    addStepToStepperComponent,
    addTabToTabsComponent,
    handleSaveConfiguration,
    handleOpenTabConfig,
    handleSaveTabConfig,
    handleOpenStepConfig,
    handleSaveStepConfig,
    handleModalSubmit,
    executeAction,
    handleMoveItem
  };
}
