import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { ButtonConfig } from "../../types/button";
import { useEffect, useState } from "react";
import { useDynamicLayout } from "../../hooks/useDynamicLayout";

const ButtonConfigDialog = () => {
    const [config, setConfig] = useState<Partial<ButtonConfig>>({});

    const { layout, editingItemId, isButtonConfigOpen, actionRegistry, setButtonConfigOpen, handleSaveConfig, findItemConfig } = useDynamicLayout()

    const onClose = () => setButtonConfigOpen(false)
    const existingConfig = findItemConfig(layout, editingItemId)

    useEffect(() => {
        if (isButtonConfigOpen && existingConfig) {
            setConfig(JSON.parse(JSON.stringify(existingConfig)));
        } else if (isButtonConfigOpen) {
            setConfig({
                label: 'Nút Mới',
                grid: 3,
                config: {
                    variant: 'contained',
                    color: 'primary'
                }
            });
        }
    }, [isButtonConfigOpen, existingConfig]);

    const handleSave = () => {
        handleSaveConfig(config);
        onClose();
    };

    const handleChange = (e: any) => {
        const { name,
            value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleConfigChange = (e: SelectChangeEvent<any>) => {
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

    if (!isButtonConfigOpen) return null;

    return (<Dialog open={isButtonConfigOpen}
        onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>Chỉnh sửa Nút Hành động</DialogTitle>
        <DialogContent sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: '16px !important'
        }}>
            <TextField name="label" label="Tiêu đề nút" value={config.label || ''}
                onChange={handleChange} />
            <FormControl fullWidth>
                <InputLabel>Hành động khi Click</InputLabel>
                <Select name="onClickAction" value={config.config?.onClickAction || ''} label="Hành động khi Click"
                    onChange={handleConfigChange}>
                    <MenuItem value="">
                        <em>Không có</em>
                    </MenuItem>{Object.keys(actionRegistry).map(action => (<MenuItem key={action} value={action}>{action}</MenuItem>))}</Select>
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
                <Select name="color" value={config.config?.color || 'primary'} label="Màu sắc"
                    onChange={handleConfigChange}>
                    <MenuItem value="primary">Primary</MenuItem>
                    <MenuItem value="secondary">Secondary</MenuItem>
                    <MenuItem value="success">Success</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
                </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button
                onClick={onClose}>Hủy</Button>
            <Button
                onClick={handleSave}>Lưu</Button>
        </DialogActions>
    </Dialog>);
};


export default ButtonConfigDialog