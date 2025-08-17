import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { ModalFormConfig } from "./types";
import { useEffect, useState } from "react";

interface ModalButtonConfigDialogProps {
    open: boolean, onClose: () => void,
    onSave: (newConfig: Partial<ModalFormConfig>) => void,
    existingConfig: ModalFormConfig | null,
    availableTables: { id: string, label: string }[]
}

const ModalButtonConfigDialog: React.FC<ModalButtonConfigDialogProps> = ({ open, onClose, onSave, existingConfig, availableTables }) => {
    const [config, setConfig] = useState<Partial<ModalFormConfig>>({});
    useEffect(() => {
        if (open && existingConfig) {
            setConfig({ buttonLabel: existingConfig.buttonLabel, dialogTitle: existingConfig.dialogTitle, onSubmitAction: existingConfig.onSubmitAction, onSubmitTarget: existingConfig.onSubmitTarget });
        }
        else {
            setConfig({});
        }
    }, [open, existingConfig]);
    const handleSave = () => {
        onSave(config); onClose();

    };
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setConfig((prev: any) => ({ ...prev, [name]: value }));
    };
    return (<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Chỉnh sửa Nút Mở Form</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: '16px !important' }}>
            <TextField name="buttonLabel" label="Tiêu đề Nút" value={config.buttonLabel || ''} onChange={handleChange} />
            <TextField name="dialogTitle" label="Tiêu đề Form" value={config.dialogTitle || ''} onChange={handleChange} />
            <Divider />
            <Typography>Hành động sau khi Lưu</Typography>
            <FormControl fullWidth>
                <InputLabel>Hành động</InputLabel>
                <Select name="onSubmitAction" value={config.onSubmitAction || ''} label="Hành động" onChange={handleChange}>
                    <MenuItem value=""><em>Không có</em></MenuItem><MenuItem value="ADD_TO_TABLE">Thêm vào Bảng</MenuItem>
                </Select>
            </FormControl>
            {config.onSubmitAction === 'ADD_TO_TABLE' && (<FormControl fullWidth><InputLabel>Bảng mục tiêu</InputLabel>
                <Select name="onSubmitTarget" value={config.onSubmitTarget || ''} label="Bảng mục tiêu" onChange={handleChange}>
                    <MenuItem value=""><em>Chọn bảng</em>
                    </MenuItem>{availableTables.map(table => (<MenuItem key={table.id} value={table.id}>{table.label}</MenuItem>))}
                </Select>
            </FormControl>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Hủy</Button>
            <Button onClick={handleSave}>Lưu</Button>
        </DialogActions>
    </Dialog>
    );
};


export default ModalButtonConfigDialog