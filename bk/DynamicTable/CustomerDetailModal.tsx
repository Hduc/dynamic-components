import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from "react";
import DynamicComponent from "../DynamicComponent";
import { formatCell } from "./formatCell";
import ViewDynamicComponent from "../DynamicComponent/ViewDynamicForm";

interface CustomerDetailModalProps {
    open: boolean;
    formId:string,
    layoutJson?:string,
    columnHeaders: any[],
    data: Partial<any>;
    onClose: () => void;
    onSave: (obj: any) => void;
    onSwitchToEdit: () => void;
    isView: boolean
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ formId,layoutJson,open, onClose, onSave, data, columnHeaders, isView, onSwitchToEdit }) => {

    if (!data) return null;

    const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Typography variant="body1" fontWeight="medium">{value}</Typography>
        </Grid>
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogContent sx={{px:5,py:10}}>
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton>
                {isView ? (
                    <Grid container spacing={15} sx={{px:5,py:10}}>
                        {columnHeaders && columnHeaders.map(he => (
                             <DetailItem label={he.name} value={formatCell(data[he.key], he.type)} />
                        ))}
                       
                    </Grid>) :
                    (
                        <ViewDynamicComponent  formKey={formId} layoutJson={layoutJson} />
                    )}
            </DialogContent>
            <DialogActions>
                {isView ? (
                    <>
                        <Button onClick={onClose}>Đóng</Button>
                        <Button onClick={onSwitchToEdit} variant="contained"  startIcon={<EditIcon />}>Chỉnh sửa</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={onClose}>Hủy</Button>
                        <Button  variant="contained" type="submit" form={formId}>Lưu</Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CustomerDetailModal