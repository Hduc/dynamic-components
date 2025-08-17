import { useEffect, useState } from "react";
import { ButtonConfig } from "./types";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";

interface ButtonConfigDialogProps {
    open: boolean,
    onClose: () => void,
    onSave: (config: ButtonConfig) => void,
    existingConfig: ButtonConfig | null,
    availableActions: string[]
}
const ButtonConfigDialog: React.FC<ButtonConfigDialogProps> = ({ open, onClose, onSave, existingConfig, availableActions }) => {
    const [config, setConfig] = useState<Partial<ButtonConfig>>({});
    useEffect(() => {
        if (open && existingConfig) {
            setConfig(JSON.parse(JSON.stringify(existingConfig)));
        }
        else if (open) {
            setConfig({ label: 'Nút Mới', grid: 3, config: { variant: 'contained', color: 'primary' } });
        }
    }, [open, existingConfig]);
    const handleSave = () => {
        onSave(config as ButtonConfig)
        onClose();
    };
    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };
    const handleConfigChange = (e: SelectChangeEvent<any>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, config: { ...prev.config, [name]: value } }));
    };
    if (!open) return null;
    return (<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>Chỉnh sửa Nút Hành động</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
            <TextField name="label" label="Tiêu đề nút" value={config.label || ''}
                onChange={handleChange} />
            <FormControl fullWidth>
                <InputLabel>Hành động khi Click</InputLabel>
                <Select name="onClickAction"
                    value={config.config?.onClickAction || ''}
                    label="Hành động khi Click" onChange={handleConfigChange}>
                    <MenuItem value=""><em>Không có</em></MenuItem>
                    {availableActions.map(action => (<MenuItem key={action} value={action}>{action}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Kiểu nút (Variant)</InputLabel>
                <Select name="variant" value={config.config?.variant || 'contained'} label="Kiểu nút (Variant)"
                    onChange={handleConfigChange}>
                    <MenuItem value="contained">Contained</MenuItem>
                    <MenuItem value="outlined">Outlined</MenuItem>
                    <MenuItem value="text">Text</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Màu sắc</InputLabel>
                <Select name="color" value={config.config?.color || 'primary'} label="Màu sắc" onChange={handleConfigChange}>
                    <MenuItem value="primary">Primary</MenuItem>
                    <MenuItem value="secondary">Secondary</MenuItem>
                    <MenuItem value="success">Success</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
                </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Hủy</Button>
            <Button onClick={handleSave}>Lưu</Button>
        </DialogActions>
    </Dialog>);
};
export default ButtonConfigDialog