import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { AddComponentContext, LayoutItem } from "./types";

interface AddComponentDialogProps {
    open: boolean,
    onClose: () => void,
    onSelect: (type: LayoutItem['type']) => void,
    context: AddComponentContext | null
}
const AddComponentDialog: React.FC<AddComponentDialogProps> = ({ open, onClose, onSelect, context }) => {
    const availableTypes: { type: LayoutItem['type'], label: string }[] = [
        { type: 'field', label: 'Trường dữ liệu' },
        { type: 'button', label: 'Nút hành động' },
        { type: 'table', label: 'Bảng dữ liệu' },
    ];

    if (context?.parentType === 'root') {
        availableTypes.push({ type: 'tabs', label: 'Nhóm Tab' });
        availableTypes.push({ type: 'stepper', label: 'Nhóm Stepper' });
        availableTypes.push({ type: 'modal-button', label: 'Nút Mở Form (Modal)' });
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Chọn loại thành phần muốn thêm</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
                {availableTypes.map(item => (
                    <Button key={item.type} variant="outlined" onClick={() => { onSelect(item.type); onClose(); }}>
                        {item.label}
                    </Button>
                ))}
            </DialogContent>
        </Dialog>
    );
};
export default AddComponentDialog