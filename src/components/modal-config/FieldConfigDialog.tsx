import { FieldAction, FieldConfig, FieldOption } from "../../types/field";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Delete } from "@mui/icons-material";
import { useDynamicLayout } from "../../hooks/useDynamicLayout";

const FieldConfigDialog = () => {
  const { layout, editingItemId, allFieldsFlat, isConfigOpen, setConfigOpen, handleSaveConfig, findItemConfig } = useDynamicLayout()

  const existingFieldConfig = findItemConfig(layout, editingItemId) as FieldConfig | null
  const onClose = () => setConfigOpen(false)

  const [config, setConfig] = useState<Partial<FieldConfig>>({ validation: {} });

  const [staticOptions, setStaticOptions] = useState<FieldOption[]>([{
    value: '',
    label: ''
  }]);

  useEffect(() => {
    debugger
    if (isConfigOpen && existingFieldConfig) {
      const initialConfig = JSON.parse(JSON.stringify(existingFieldConfig));
      if (!initialConfig.validation) initialConfig.validation = {};
      if (!initialConfig.config) initialConfig.config = {};
      if (!initialConfig.config.onValueChange) initialConfig.config.onValueChange = [];
      setConfig(initialConfig);
      if (initialConfig.config?.options) {
        setStaticOptions(initialConfig.config.options);
      } else {
        setStaticOptions([{
          value: '',
          label: ''
        }]);
      }
    }
  }, [isConfigOpen, existingFieldConfig]);

  const handleMainChange = (e: any) => {
    const { name,
      value,
      type } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleValidationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name,
      value,
      type,
      checked } = e.target;
    setConfig(prev => {
      const newValidation = { ...(prev.validation || {}) };
      if (type === 'checkbox') {
        debugger
        //newValidation[name as keyof FieldValidation] = checked;
      } else {
        (newValidation as any)[name] = value === '' ? undefined : value;
      } return {
        ...prev,
        validation: newValidation
      };
    });
  };

  const handleSubConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name,
      value } = e.target;
    setConfig(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [name]: value
      }
    }));
  };

  const handleOptionChange = (index: number,
    e: React.ChangeEvent<HTMLInputElement>) => {
    const { name,
      value } = e.target;
    const newOptions = [...staticOptions];
    (newOptions[index] as any)[name] = value;
    setStaticOptions(newOptions);
  };

  const addOption = () => setStaticOptions([...staticOptions, { value: '', label: '' }]);

  const removeOption = (index: number) => setStaticOptions(staticOptions.filter((_, i) => i !== index));

  const handleSave = () => {
    let finalConfig = { ...config };
    if (['radio',
      'select'].includes(config.type!) && !config.config?.url) {
      finalConfig.config = {
        ...finalConfig.config,
        options: staticOptions.filter(opt => opt.value && opt.label)
      };
    }

    handleSaveConfig(finalConfig)
    onClose();
  };
  const handleActionChange = (index: number, e: any) => {
    const { name, value } = e.target;
    const newActions = [...(config.config?.onValueChange || [])];
    (newActions[index] as any)[name] = value;
    setConfig(prev => ({
      ...prev,
      config: {
        ...prev.config,
        onValueChange: newActions
      }
    }));
  };
  const addAction = () => {
    const newActions: FieldAction[] = [
      ...(config.config?.onValueChange || []),
      {
        action: 'FETCH_AND_UPDATE',
        targetField: '',
        apiUrl: '',
      }
    ];
    setConfig(prev => ({
      ...prev,
      config: {
        ...prev.config,
        onValueChange: newActions
      }
    }));
  };
  const removeAction = (index: number) => {
    const newActions = (config.config?.onValueChange || []).filter((_, i) => i !== index);
    setConfig(prev => ({
      ...prev,
      config: {
        ...prev.config,
        onValueChange: newActions
      }
    }));
  };
  if (!isConfigOpen) return null;
  return (<Dialog open={isConfigOpen}
    onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>Chỉnh sửa chi tiết trường</DialogTitle>
    <DialogContent>
      <Box component="form" sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        pt: 2
      }}>
        <TextField name="label" label="Nhãn (Label)" value={config.label || ''}
          onChange={handleMainChange} fullWidth />
        <FormControl fullWidth>
          <InputLabel>Loại trường</InputLabel>
          <Select name="type" value={config.type || 'text'} label="Loại trường"
            onChange={handleMainChange}>
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="datetime-local">Date & Time</MenuItem>
            <MenuItem value="color">Color</MenuItem>
            <MenuItem value="radio">Radio</MenuItem>
            <MenuItem value="select">Select</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Độ rộng</InputLabel>
          <Select name="grid" value={config.grid || 12} label="Độ rộng"
            onChange={handleMainChange}>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={12}>12</MenuItem>
          </Select>
        </FormControl>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle1" gutterBottom>Quy tắc xác thực (Validation)</Typography>
        <FormControlLabel control={<Checkbox name="required" checked={config.validation?.required || false}
          onChange={handleValidationChange} />} label="Bắt buộc (Required)" />{config.inputType === 'text' && (<>
            <TextField type="number" name="minLength" label="Độ dài tối thiểu" value={config.validation?.minLength || ''}
              onChange={handleValidationChange} fullWidth margin="dense" />
            <TextField type="number" name="maxLength" label="Độ dài tối đa" value={config.validation?.maxLength || ''}
              onChange={handleValidationChange} fullWidth margin="dense" />
            <TextField name="pattern" label="Mẫu Regex (vd: ^\\d+$)" value={config.validation?.pattern || ''}
              onChange={handleValidationChange} fullWidth margin="dense" />
          </>)}{config.inputType === 'number' && (<>
            <TextField type="number" name="minValue" label="Giá trị tối thiểu" value={config.validation?.minValue || ''}
              onChange={handleValidationChange} fullWidth margin="dense" />
            <TextField type="number" name="maxValue" label="Giá trị tối đa" value={config.validation?.maxValue || ''}
              onChange={handleValidationChange} fullWidth margin="dense" />
          </>)}{(config.inputType === 'radio' || config.inputType === 'select') && (<>
            <Divider sx={{ my: 1 }} />
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Cấu hình lựa chọn</Typography>{staticOptions.map((opt,
                index) => (<Box key={index} sx={{
                  display: 'flex',
                  gap: 1,
                  mb: 1,
                  alignItems: 'center'
                }}>
                  <TextField size="small" name="value" label="Value" value={opt.value}
                    onChange={(e) => handleOptionChange(index,
                      e as any)} />
                  <TextField size="small" name="label" label="Label" value={opt.label}
                    onChange={(e) => handleOptionChange(index,
                      e as any)} sx={{ flexGrow: 1 }} />
                  <IconButton
                    onClick={() => removeOption(index)} color="error" size="small">
                    <Delete />
                  </IconButton>
                </Box>))}<Button
                  onClick={addOption} size="small">Thêm lựa chọn</Button>
            </Paper>
          </>)}
          {config.inputType === 'select' && (<Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Hoặc tải từ API</Typography>
            <TextField name="url" label="URL API (vd: /api/provinces)" value={config.config?.url || ''}
              onChange={handleSubConfigChange} fullWidth margin="dense" helperText="Để trống nếu dùng lựa chọn tĩnh ở trên" />
            <TextField name="valueField" label="Trường cho Value (vd: id)" value={config.config?.valueField || ''}
              onChange={handleSubConfigChange} fullWidth margin="dense" />
            <TextField name="labelField" label="Trường cho Label (vd: name)" value={config.config?.labelField || ''}
              onChange={handleSubConfigChange} fullWidth margin="dense" />
            <FormControl fullWidth margin="dense">
              <InputLabel>Phụ thuộc vào trường</InputLabel>
              <Select name="dependsOn" value={config.dependsOn || ''} label="Phụ thuộc vào trường"
                onChange={handleMainChange as any}>
                <MenuItem value="">
                  <em>Không phụ thuộc</em>
                </MenuItem>{allFieldsFlat.filter(f => f.id !== config.id).map(f => <MenuItem key={f.id} value={f.id}>{f.label} ({f.id})</MenuItem>)}</Select>
            </FormControl>
          </Paper>)}{(config.inputType === 'date' || config.inputType === 'datetime-local') && (<>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" gutterBottom>Giá trị Mặc định</Typography>
            <TextField name="defaultValue" label="Biểu thức giá trị mặc định" value={config.config?.defaultValue || ''}
              onChange={handleSubConfigChange} fullWidth margin="dense" helperText="Dùng 'now',  'now-10d' (10 ngày trước),  'now+2h' (2 giờ sau)." />
          </>)}
        <Divider sx={{ my: 1 }} />
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Hành động khi thay đổi giá trị</Typography>{(config.config?.onValueChange || []).map((action,
            index) => (<Box key={index} sx={{
              display: 'flex',
              gap: 1,
              mb: 1,
              alignItems: 'center',
              border: '1px solid #ddd',
              p: 1,
              borderRadius: 1
            }}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Trường mục tiêu</InputLabel>
                <Select name="targetField" value={action.targetField} label="Trường mục tiêu"
                  onChange={(e) => handleActionChange(index,
                    e)}>
                  <MenuItem value="">
                    <em>Chọn trường</em>
                  </MenuItem>{allFieldsFlat.filter(f => f.id !== config.id).map(f => <MenuItem key={f.id} value={f.id}>{f.label} ({f.id})</MenuItem>)}</Select>
              </FormControl>
              <TextField name="apiUrl" label="API URL" value={action.apiUrl}
                onChange={(e) => handleActionChange(index,
                  e)} fullWidth margin="dense" helperText="Dùng {value} làm placeholder" />
              <IconButton
                onClick={() => removeAction(index)} color="error">
                <Delete />
              </IconButton>
            </Box>))}<Button
              onClick={addAction} size="small">Thêm hành động</Button>
        </Paper>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={onClose}>Hủy</Button>
      <Button
        onClick={handleSave} variant="contained">Lưu</Button>
    </DialogActions>
  </Dialog>);
};

export default FieldConfigDialog