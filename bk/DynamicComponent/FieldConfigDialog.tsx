import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FieldAction, FieldConfig, FieldOption } from "./types";
import ChooseField from "./FieldConfigs/ChooseField";
import TextConfig from "./FieldConfigs/TextCofig";
import NumberConfig from "./FieldConfigs/NumberConfig";
import DateTimeLocalConfig from "./FieldConfigs/DatetimeLocalConfig";
import SelectRadioCheckboxConfig from "./FieldConfigs/SelectRadioCheckboxConfig";
import { Delete } from "@mui/icons-material";

interface FieldConfigDialogProps {
    open: boolean,
    onClose: () => void,
    onSave: (config: FieldConfig) => void,
    existingFieldConfig: FieldConfig | null,
    allFields: { id: string, label: string }[]
}
const FieldConfigDialog: React.FC<FieldConfigDialogProps> = ({ open, onClose, onSave, existingFieldConfig, allFields }) => {
    const [config, setConfig] = useState<Partial<FieldConfig>>({ validation: {} });
    const [staticOptions, setStaticOptions] = useState<FieldOption[]>([{ value: '', label: '' }]);
    useEffect(() => {
        if (open && existingFieldConfig) {
            const initialConfig = JSON.parse(JSON.stringify(existingFieldConfig));
            if (!initialConfig.validation) initialConfig.validation = {};
            setConfig(initialConfig);
            if (initialConfig.config?.options) {
                setStaticOptions(initialConfig.config.options);
            }
            else {
                setStaticOptions([{ value: '', label: '' }]);
            }
        }
    }, [open, existingFieldConfig]);

    const handleMainChange = (e: any) => {
        const { name, value, type } = e.target;
        setConfig(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const handleValidationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => {
            const newValidation = { ...(prev.validation || {}) };
            if (type === 'checkbox') {
                //@ts-ignore
                newValidation[name as keyof FieldValidation] = checked;
            }
            else {
                (newValidation as any)[name] = value === '' ? undefined : value;
            }
            return { ...prev, validation: newValidation };
        });
    };

    const handleSubConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, config: { ...prev.config, [name]: value } }));
    };
    const handleOptionChange = (index: number, e: any) => {
        const { name, value } = e.target;
        const newOptions = [...staticOptions];
        newOptions[index][name] = value;
        setStaticOptions(newOptions);
    };
    const addOption = () => setStaticOptions([...staticOptions, { value: '', label: '' }]);
    const removeOption = (index: number) => setStaticOptions(staticOptions.filter((_, i) => i !== index));
    const handleSave = () => {

        let finalConfig = { ...config };
        if (['radio', 'checkbox', 'select'].includes(config.type!) && !config.config?.url) {
            finalConfig.config = {
                ...finalConfig.config,
                options: staticOptions.filter(opt => opt.value && opt.label)
            };
        }
        onSave(finalConfig as FieldConfig);
        onClose();
    };
    const handleActionChange = (index: number, e: any) => {
        const { name, value } = e.target;
        const newActions = [...(config.config?.onValueChange || [])];
        (newActions[index] as any)[name] = value;
        setConfig(prev => ({ ...prev, config: { ...prev.config, onValueChange: newActions } }));
    };
    const addAction = () => {
        const newActions:FieldAction[]  = [...(config.config?.onValueChange || []), {
            action: 'FETCH_AND_UPDATE',
            targetField: '',
            apiUrl: ''
        }];
        setConfig(prev => ({ ...prev, config: { ...prev.config, onValueChange: newActions } }));
    };

    const removeAction = (index: number) => {
        const newActions = (config.config?.onValueChange || []).filter((_, i) => i !== index);
        setConfig(prev => ({ ...prev, config: { ...prev.config, onValueChange: newActions } }));
    };
    if (!open) return null;
    return (<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Chỉnh sửa chi tiết trường</DialogTitle>
        <DialogContent>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 10, pt: 10 }}>
                <TextField name="label" label="Nhãn (Label)" value={config.label || ''} onChange={handleMainChange} fullWidth />
                <TextField name="id" label="Id" value={config.id || ''} onChange={handleMainChange} fullWidth />
                <ChooseField value={config.type} onChange={handleMainChange} />
                <FormControl fullWidth>
                    <InputLabel>Độ rộng</InputLabel>
                    <Select name="grid" value={config.grid || 12} label="Độ rộng" onChange={handleMainChange}>
                        {Array.from({ length: 12 }, (_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                {i + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Divider sx={{ mt: 10 }} >Quy tắc xác thực (Validation)</Divider>
                <FormControlLabel control={<Checkbox name="required" checked={config.validation?.required || false} onChange={handleValidationChange} />} label="Bắt buộc (Required)" />

                {config.type === 'text' && (<TextConfig validation={config.validation} onChange={handleValidationChange} />)}

                {config.type === 'number' && (<NumberConfig validation={config.validation} onChange={handleValidationChange} />)}

                {(config.type === 'radio' || config.type === 'checkbox' || config.type === 'select') && (<SelectRadioCheckboxConfig
                    addOption={addOption}
                    removeOption={removeOption}
                    mainChange={handleMainChange}
                    onChange={handleOptionChange}
                    subConfigChange={handleSubConfigChange}
                    options={staticOptions}
                    config={config.config}
                    dependsOn={config.dependsOn}
                    allFields={allFields}
                    id={config.id}
                />)}
                {(config.type === 'date' || config.type === 'datetime-local') && (<DateTimeLocalConfig defaultValue={config.config?.defaultValue || ''} onChange={handleSubConfigChange} />)}
                <Divider sx={{ my: 1 }} />
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Hành động khi thay đổi giá trị</Typography>
                    {(config.config?.onValueChange || []).map((action, index) => (<Box key={index}
                        sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center', border: '1px solid #ddd', p: 1, borderRadius: 1 }}>
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Trường mục tiêu</InputLabel>
                            <Select name="targetField" value={action.targetField} label="Trường mục tiêu" onChange={(e) => handleActionChange(index, e)}>
                                <MenuItem value=""><em>Chọn trường</em></MenuItem>
                                {allFields.filter(f => f.id !== config.id).map(f => <MenuItem key={f.id} value={f.id}>{f.label} ({f.id})</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField name="apiUrl" label="API URL" value={action.apiUrl} onChange={(e) => handleActionChange(index, e)} fullWidth margin="dense" helperText="Dùng {value} làm placeholder" />
                        <IconButton onClick={() => removeAction(index)} color="error"><Delete /></IconButton>
                    </Box>))}
                    <Button onClick={addAction} size="small">Thêm hành động</Button>
                </Paper>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Hủy</Button>
            <Button onClick={handleSave} variant="contained">Lưu</Button>
        </DialogActions>
    </Dialog>);
};
export default FieldConfigDialog

