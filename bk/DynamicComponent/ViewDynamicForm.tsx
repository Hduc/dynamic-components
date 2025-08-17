import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Box, Typography, Paper, Alert, Snackbar, Button } from '@mui/material';
import DynamicTableComponent from './DynamicTableComponent';
import DynamicField from './DynamicField';
import TabsComponent from './TabsComponent';
import StepperComponent from './StepperComponent';
import ModalButtonComponent from './ModalButtonComponent';
import { DynFormData, Errors, FieldLayoutItem, LayoutItem } from './types';
import { getFormById } from 'src/apis/apiDynamicForm';
import { apiCommonPost } from 'src/apis/apiCommon';

interface ViewDynamicComponentProps {
  formKey?: string;
  layoutJson?: any
  data?: any
  onSubmit?: (obj: any) => void
}

export default function ViewDynamicComponent({ data, formKey, layoutJson, onSubmit }: ViewDynamicComponentProps): JSX.Element {
  const [inforForm, setInforForm] = useState<Partial<any>>({})
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [formData, setFormData] = useState<DynFormData>({});
  const [errors, setErrors] = useState<Errors>({});
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });

  const loadInitialConfiguration = useCallback(async () => {
    if (layoutJson) {
      const dataMap = typeof layoutJson == 'string' ? JSON.parse(layoutJson) : layoutJson;
      setLayout(dataMap)
      return
    }
    if (!formKey) return;
    const savedLayout = await getFormById(formKey);
    if (savedLayout.success) {
      const obj = savedLayout.data;
      setInforForm({ ...obj, layoutJson: '' })
      const dataMap = JSON.parse(obj.layoutJson);
      if (Array.isArray(dataMap) && dataMap.length > 0) {
        setLayout(dataMap);
      }
    }
  }, [formKey, layoutJson]);

  useEffect(() => { loadInitialConfiguration(); }, [loadInitialConfiguration]);



  const actionRegistry: {
    [key: string]
    : (formData: DynFormData,
      setFormData: React.Dispatch<React.SetStateAction<FormData>>,
      setErrors: React.Dispatch<React.SetStateAction<Errors>>) => Promise<void>
  } = {
    VALIDATE_FORM: async (currentData, _, setErr) => {
      console.log("Validating form with data:", currentData);
      const newErrors: Errors = {};
      if (!currentData.customer_name) {
        newErrors.customer_name = "Tên khách hàng là bắt buộc!";
      }
      setErr(newErrors);
      if (Object.keys(newErrors).length === 0) {
        setToast({ open: true, message: 'Form hợp lệ!', severity: 'success' });
      } else {
        setToast({ open: true, message: 'Form có lỗi, vui lòng kiểm tra lại!', severity: 'error' });
      }
    },
    VALIDATE_STEP_API: async () => {
      //await mockApi.validateStepData();
    },
    CALL_MOCK_API: async (currentData, setFd, __) => {
      setToast({ open: true, message: 'Đang gọi API...', severity: 'info' });
      //const sn = await mockApi.getSerialNumber();
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
      setErrors(prev => { const newErrors = { ...prev }; delete newErrors[fieldId]; return newErrors; });
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
  };

  const handleModalSubmit = (modalData: DynFormData, targetId?: string, action?: 'ADD_TO_TABLE') => {
    if (action === 'ADD_TO_TABLE' && targetId) {
      setFormData(prev => {
        const currentTableData = prev[targetId] || [];
        const newTableData = [...currentTableData, modalData];
        return { ...prev, [targetId]: newTableData };
      });
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
  const renderLayoutItem = (item: LayoutItem) => {
    switch (item.type) {
      case 'field':
        return (
          <Grid item xs={12} sm={item.config.grid} key={item.id}>
            <DynamicField
              fieldConfig={item.config}
              formData={formData}
              onFieldChange={handleFieldChange}
              errorText={errors[item.id]}
            />
          </Grid>
        );
      case 'tabs':
        return (
          <Grid item xs={12} key={item.id}>
            <TabsComponent
              componentId={item.id}
              componentConfig={item.config}
              formData={formData}
              onFieldChange={handleFieldChange}
              onTableChange={handleTableChange}
              errors={errors}
            />
          </Grid>
        );
      case 'table':
        return (
          <Grid item xs={12} key={item.id}>
            <DynamicTableComponent
              tableConfig={item.config}
              tableData={formData[item.id]?.value || []}
              onTableChange={handleTableChange}
            />
          </Grid>
        );
      case 'stepper':
        return (
          <Grid item xs={12} key={item.id}>
            <StepperComponent
              componentId={item.id}
              componentConfig={item.config}
              formData={formData}
              onFieldChange={handleFieldChange}
              onTableChange={handleTableChange}
              errors={errors}
              onValidateStep={validateStepFields}
              onExecuteAction={executeAction}
            />
          </Grid>
        );
      case 'modal-button':
        return (
          <Grid item xs={12} key={item.id}>
            <ModalButtonComponent
              componentConfig={item.config}
              onModalSubmit={handleModalSubmit}
            />
          </Grid>
        );
      default:
        return null;
    }
  };

  const handleOnSubmitForm = async (e: any) => {
    e.preventDefault()
    debugger
    // nếu có truyền vào thì đẩy theo fuc
    if (onSubmit) {
      onSubmit(formData)
      return
    }

    const map = {
      ...formData,
      Ma_cty: '001',
    }
    const res = await apiCommonPost(inforForm.submitUrl, map)

  }
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Paper sx={{ p: 4, margin: 'auto' }} elevation={0}>
        <Typography variant="h5" gutterBottom>{inforForm?.formName}</Typography>
        <Box component="form" onSubmit={handleOnSubmitForm} id={inforForm?.id || 'dynamic-form-id'}>
          <Grid container spacing={10}>
            {layout.length === 0 && (
              <Grid item xs={12}>
                <Typography align="center" color="text.secondary" sx={{ p: 4 }}>
                  Đang tải cấu hình...
                </Typography>
              </Grid>
            )}
            {layout.map(renderLayoutItem)}
          </Grid>
        </Box>
        <Snackbar open={toast.open} autoHideDuration={6000}
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => setToast(prev => ({ ...prev, open: false }))} severity={toast.severity} sx={{ width: '100%' }}>{toast.message}</Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
