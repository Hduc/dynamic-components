import React, { useCallback, useEffect } from "react";
import { IDynamicForm, Layout } from "../../types";
import { Alert, Box, Button, CircularProgress, Grid, IconButton, Paper, Snackbar, Step, StepLabel, Stepper, Tab, Tabs, Typography } from "@mui/material";
import { componentRegistry } from "../../config/componentRegistry";
import LayoutItem from "./LayoutItem";
import { useDynamicLayout } from "../../hooks/useDynamicLayout";
import { AddCircleOutline, AutoAwesome, Replay, Save } from "@mui/icons-material";
import AddComponentDialog from "../modal-config/AddComponentDialog";
import AIFormDialog from "../modal-config/AIFormDialog";
import FieldConfigDialog from "../modal-config/FieldConfigDialog";
import { FieldConfig } from "../../types/field";
import { TableConfig } from "../../types/table";
import StepConfigDialog from "../modal-config/StepConfigDialog";
import TabConfigDialog from "../modal-config/TabConfigDialog";
import ButtonConfigDialog from "../modal-config/ButtonConfigDialog";

interface Props {
  id?: string
  inLayout?: Layout;
  data?: any[]
}

const LayoutRenderer: React.FC<Props> = ({ inLayout }) => {
  const {
    layout,
    formData,
    toast,
    isSaving,
    
    setLayout,
    setAiDialogOpen,
    setToast,
    handleSaveConfiguration,
    handleOpenAddComponentDialog,
  } = useDynamicLayout()

  const loadInitialConfiguration = useCallback(async () => {
    if (inLayout) {
      setLayout(inLayout);
      return
    }

    //if (!id) return
    // //const savedLayout = await getFormById(id);
    // if (savedLayout.success) {
    //   const obj = savedLayout.data as IDynamicForm
    //   setInfoForm(obj)
    //   const dataMap = JSON.parse(obj.layoutJson)
    //   if (Array.isArray(dataMap) && dataMap.length > 0) {
    //     setLayout(dataMap);
    //     setToast({ open: true, message: 'Đã tải cấu hình đã lưu.', severity: 'info' });
    //   }
    // }
  }, []);

  useEffect(() => {
    loadInitialConfiguration();
  }, [loadInitialConfiguration]);


  return (
    <Box sx={{
      p: 3,
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <Paper sx={{
        p: 4,
        maxWidth: 1100,
        margin: 'auto'
      }}>
        <Typography variant="h4" component="h1" gutterBottom>Trình tạo Form Thông minh (TypeScript)</Typography>
        <Box sx={{
          mb: 4,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <Button variant="contained" startIcon={<AutoAwesome />}
            onClick={() => setAiDialogOpen(true)}>Tạo bằng AI</Button>
          <Button variant="outlined" startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSaveConfiguration} disabled={isSaving}>{isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}</Button>
          <Button variant="outlined" startIcon={<Replay />}
            onClick={loadInitialConfiguration}>Tải lại</Button>
        </Box>

        <Typography variant="h5" gutterBottom>Bố cục Form</Typography>
        <Box component="form"
          onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={3}>
            {layout.length === 0 && <Grid sx={{ xs: 12 }}>
              <Typography align="center" color="text.secondary" sx={{ p: 4 }}>Đang tải cấu hình...</Typography>
            </Grid>}

            {layout.map((item, index, arr) => <LayoutItem Component={componentRegistry[item.type]} item={item} index={index} length={arr.length} />)}

            <Grid sx={{ xs: 12 }}>
              <Button fullWidth startIcon={<AddCircleOutline />}
                onClick={() => handleOpenAddComponentDialog({ parentId: 'root', parentType: 'root' })}
                sx={{
                  mt: 2,
                  p: 3,
                  borderStyle: 'dashed',
                  borderWidth: '2px',
                  color: 'text.secondary',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}>
                Thêm thành phần
              </Button>
            </Grid>
            <Grid sx={{
              xs: 12,
              mt: 4
            }}>
              <Button type="submit" variant="contained" color="primary" size="large"
                onClick={() => alert('Dữ liệu form chính:\n' + JSON.stringify(formData, null, 2))}>Gửi dữ liệu</Button>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{
          mt: 5,
          p: 2,
          backgroundColor: '#eee',
          borderRadius: 1
        }}>
          <Typography variant="h6">Dữ liệu Form hiện tại (JSON)</Typography>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </Box>
      </Paper>

      <AddComponentDialog />

      <AIFormDialog />

      <FieldConfigDialog />

      <TabConfigDialog />

      <StepConfigDialog />

      <ButtonConfigDialog />

      <Snackbar open={toast.open} autoHideDuration={6000} onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToast(prev => ({ ...prev, open: false }))} severity={toast.severity} sx={{ width: '100%' }}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default LayoutRenderer;
