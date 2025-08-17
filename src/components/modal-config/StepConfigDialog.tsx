import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDynamicLayout } from "../../hooks/useDynamicLayout";
const StepConfigDialog = () => {

    const { isStepConfigOpen, actionRegistry, editingStepInfo, setStepConfigOpen, handleSaveStepConfig } = useDynamicLayout()
    const currentLabel = editingStepInfo?.currentLabel || ''
    const currentAction = editingStepInfo?.currentAction || ''
    const [label, setLabel] = useState('');
    const [action, setAction] = useState('');

    const onClose = () => setStepConfigOpen(false)
    useEffect(() => {
        if (isStepConfigOpen) {
            setLabel(currentLabel);
            setAction(currentAction);
        }
    }, [isStepConfigOpen, currentLabel, currentAction]);
    const handleSave = () => {
        handleSaveStepConfig({ label, onNextAction: action });
        onClose();
    };
    return (<Dialog open={isStepConfigOpen}
        onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>Chỉnh sửa Bước</DialogTitle>
        <DialogContent sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: '16px !important'
        }}>
            <TextField label="Tiêu đề Bước" value={label}
                onChange={(e) => setLabel(e.target.value)} />
            <FormControl fullWidth>
                <InputLabel>Hành động khi "Tiếp theo"</InputLabel>
                <Select value={action} label='Hành động khi "Tiếp theo"'
                    onChange={(e) => setAction(e.target.value)}>
                    <MenuItem value="">
                        <em>Không có</em>
                    </MenuItem>{Object.keys(actionRegistry).map(act => (<MenuItem key={act} value={act}>{act}</MenuItem>))}</Select>
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

export default StepConfigDialog