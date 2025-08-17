import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface TabConfigDialogProps {
    open: boolean,
    onClose: () => void,
    onSave: (newLabel: string) => void,
    onDelete: () => void
    currentLabel: string
}
const TabConfigDialog: React.FC<TabConfigDialogProps> = ({ open, onClose, onSave, onDelete, currentLabel }) => {
    const [label, setLabel] = useState('');
    useEffect(() => {
        if (open) {
            setLabel(currentLabel);
        }
    }, [open, currentLabel]);
    const handleSave = () => {
        onSave(label);
        onClose();
    };
    return (<Dialog open={open} onClose={onClose}>
        <DialogTitle>Chỉnh sửa tiêu đề Tab</DialogTitle>
        <DialogContent>
            <TextField autoFocus margin="dense" label="Tiêu đề Tab" type="text" fullWidth variant="standard" value={label}
                onChange={(e: any) => setLabel(e.target.value)} />
        </DialogContent>
        <DialogActions>
            <Button onClick={onDelete} color="error">Xóa</Button>
            <Button onClick={onClose}>Hủy</Button>
            <Button onClick={handleSave}>Lưu</Button>
        </DialogActions>
    </Dialog>
    );
};
export default TabConfigDialog