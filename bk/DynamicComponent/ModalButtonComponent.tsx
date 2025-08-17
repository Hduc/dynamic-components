import { ReactNode, useState } from "react";
import { DynFormData, Errors, LayoutItem, ModalFormConfig } from "./types";
import DynamicField from "./DynamicField";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, Typography } from "@mui/material";
import { Launch } from "@mui/icons-material";

interface ModalButtonComponentProps {
    componentConfig: ModalFormConfig;
    onModalSubmit: (modalData: DynFormData, targetId?: string, action?: 'ADD_TO_TABLE') => void;
}

const ModalButtonComponent: React.FC<ModalButtonComponentProps> = ({ componentConfig, onModalSubmit }) => {
    const [open, setOpen] = useState(false);
    const [modalFormData, setModalFormData] = useState<DynFormData>({});
    const [modalErrors, setModalErrors] = useState<Errors>({});

    const handleOpen = () => {
        setModalFormData({});
        setModalErrors({});
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const handleModalFieldChange = (fieldId: string, value: any) => {
        setModalFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleModalTableChange = (tableId: string, data: any[]) => {
        setModalFormData(prev => ({ ...prev, [tableId]: data }));
    };

    const handleModalSubmit = () => {
        // Basic validation can be added here if needed
        onModalSubmit(modalFormData, componentConfig.onSubmitTarget, componentConfig.onSubmitAction);
        handleClose();
    };

    // Recursive renderer for items inside the modal
    const renderModalItem = (item: LayoutItem): ReactNode => {
        switch (item.type) {
            case 'field':
                return (
                    <Grid item xs={12} sm={item.config.grid} key={item.id}>
                        <DynamicField
                            fieldConfig={item.config}
                            formData={modalFormData}
                            onFieldChange={handleModalFieldChange}
                            errorText={modalErrors[item.id]}
                        />
                    </Grid>
                );
            case 'tabs':
                // This is a simplified version for demonstration.
                // A full implementation would require passing down more props.
                return (
                    <Grid item xs={12} key={item.id}>
                        <Typography color="primary.main" sx={{ mb: 1 }}>Tab bên trong Modal (Demo)</Typography>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            {item.config.tabs.map(tab => (
                                <Box key={tab.id}>
                                    <Typography variant="h6">{tab.label}</Typography>
                                    <Grid container spacing={2} sx={{ pt: 1 }}>
                                        {tab.items.map(renderModalItem)}
                                    </Grid>
                                </Box>
                            ))}
                        </Paper>
                    </Grid>
                )
            // Other complex types like Table, Stepper can be added here
            default:
                return null;
        }
    };

    return (
        <>
            <Button variant="contained" onClick={handleOpen} endIcon={<Launch />}>
                {componentConfig.buttonLabel}
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>{componentConfig.dialogTitle}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} sx={{ pt: 2 }}>
                        {componentConfig.layout.map(renderModalItem)}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleModalSubmit} variant="contained">Lưu</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default ModalButtonComponent