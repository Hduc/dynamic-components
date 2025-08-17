import { useState } from "react";
import React from "react";
import { Box, Button, Checkbox, Drawer, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Select, Slider, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ViewDynamicComponent from "../DynamicComponent/ViewDynamicForm";

interface FilterSidebarProps {
    formId: string,
    layoutJson?: string,
    open: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    onReset: () => void;
    initialFilters: any;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ formId, layoutJson, open, onClose, onApply, onReset, initialFilters }) => {
    const [localFilters, setLocalFilters] = useState<Partial<any>>(initialFilters);

    React.useEffect(() => {
        setLocalFilters(initialFilters);
    }, [initialFilters]);

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const handleReset = () => {
        setLocalFilters({});
        onReset();
    };

    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <Box sx={{ width: 320, padding: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" component="h2">Bộ lọc</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Box>
                <Box sx={{ px: 2, py: 5, overflowY: 'auto', flexGrow: 1 }}>
                    <ViewDynamicComponent formKey={formId} layoutJson={layoutJson} data={localFilters} />
                </Box>
                <Box sx={{ p: 5, borderTop: 1, borderColor: 'divider', backgroundColor: 'grey.50' }}>
                    <Stack direction="row" justifyContent="space-between">
                        <Button variant="outlined" onClick={handleReset}>Đặt lại</Button>
                        <Button variant="contained" onClick={handleApply} type="submit" form={formId}>Áp dụng</Button>
                    </Stack>
                </Box>
            </Box>
        </Drawer>
    );
};

export default FilterSidebar