import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDynamicLayout } from "../../hooks/useDynamicLayout";

const TabConfigDialog = () => {
    const { isTableConfigOpen, editingTabInfo, setTableConfigOpen, handleSaveConfig } = useDynamicLayout()
    const currentLabel = editingTabInfo?.currentLabel || ''

    const onClose = () => setTableConfigOpen(false)

    const [label, setLabel] = useState('');
    useEffect(() => {
        if (isTableConfigOpen) {
            setLabel(currentLabel);
        }
    }, [isTableConfigOpen, currentLabel]);

    const handleSave = () => {
        handleSaveConfig(label);
        onClose();
    };

    return (<Dialog open={isTableConfigOpen}
        onClose={onClose}>
        <DialogTitle>Chỉnh sửa tiêu đề Tab</DialogTitle>
        <DialogContent>
            <TextField autoFocus margin="dense" label="Tiêu đề Tab" type="text" fullWidth variant="standard" value={label}
                onChange={(e) => setLabel(e.target.value)} />
        </DialogContent>
        <DialogActions>
            <Button
                onClick={onClose}>Hủy</Button>
            <Button
                onClick={handleSave}>Lưu</Button>
        </DialogActions>
    </Dialog>);
};
export default TabConfigDialog