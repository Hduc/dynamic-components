import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { LayoutItem } from "../../types";
import { useDynamicLayout } from "../../hooks/useDynamicLayout";

const AddComponentDialog = () => {
    const { isAddComponentOpen, setAddComponentOpen, addComponent, addComponentContext } = useDynamicLayout()

    const availableTypes: { type: LayoutItem['type'], label: string }[] = [
        {
            type: 'field',
            label: 'Trường dữ liệu'
        },
        {
            type: 'button',
            label: 'Nút hành động'
        },
        {
            type: 'table',
            label: 'Bảng dữ liệu'
        },
    ];

    if (addComponentContext?.parentType === 'root') {
        availableTypes.push({
            type: 'tabs',
            label: 'Nhóm Tab'
        });
        availableTypes.push({
            type: 'stepper',
            label: 'Nhóm Stepper'
        });
    }
    console.log('isAddComponentOpen', isAddComponentOpen)
    return (
        <Dialog open={isAddComponentOpen}
            onClose={() => setAddComponentOpen(false)}>
            <DialogTitle>Chọn loại thành phần muốn thêm</DialogTitle>
            <DialogContent sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                pt: '16px !important'
            }}>
                {availableTypes.map(item => (
                    <Button key={item.type} variant="outlined"
                        onClick={() => {
                            addComponent(item.type);
                            setAddComponentOpen(false);
                        }}>
                        {item.label}
                    </Button>
                ))}
            </DialogContent>
        </Dialog>
    );
};

export default AddComponentDialog