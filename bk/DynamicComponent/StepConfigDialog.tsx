import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface StepConfigDialogProps {
    open: boolean,
    onClose: () => void,
    onSave: (newConfig: { label: string, onNextAction: string }) => void,
    currentLabel: string,
    currentAction: string,
    availableActions: string[]
}
const StepConfigDialog: React.FC<StepConfigDialogProps> = ({ open, onClose, onSave, currentLabel, currentAction, availableActions }) => {
    const [label, setLabel] = useState('');
    const [action, setAction] = useState('');
    useEffect(() => {
        if (open) {
            setLabel(currentLabel);
            setAction(currentAction);
        }
    }, [open, currentLabel, currentAction]);

    const handleSave = () => {
        onSave({ label, onNextAction: action });
        onClose();
    };
    return (<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>Chỉnh sửa Bước</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
            <TextField label="Tiêu đề Bước" value={label} onChange={(e) => setLabel(e.target.value)} />
            <FormControl fullWidth><InputLabel>Hành động khi "Tiếp theo"</InputLabel>
                <Select value={action} label='Hành động khi "Tiếp theo"'
                    onChange={(e) => setAction(e.target.value)}>
                    <MenuItem value=""><em>Không có</em></MenuItem>
                    {availableActions.map(act => (<MenuItem key={act} value={act}>{act}</MenuItem>))}
                </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Hủy</Button>
            <Button onClick={handleSave}>Lưu</Button>
        </DialogActions>
    </Dialog>
    );
};
export default StepConfigDialog