import React, { useCallback, useEffect } from "react";
import { Layout } from "../../types";
import { Alert, Box, Button, CircularProgress, Grid, Paper, Snackbar, Typography } from "@mui/material";
import {  useDynamicLayout } from "../../hooks/useDynamicLayout";
import { AddCircleOutline, AutoAwesome, Replay, Save } from "@mui/icons-material";
import AddComponentDialog from "../modal-config/AddComponentDialog";
import AIFormDialog from "../modal-config/AIFormDialog";
import FieldConfigDialog from "../modal-config/FieldConfigDialog";
import StepConfigDialog from "../modal-config/StepConfigDialog";
import TabConfigDialog from "../modal-config/TabConfigDialog";
import ButtonConfigDialog from "../modal-config/ButtonConfigDialog";
import ConfigurableWrapper from "../controls/ConfigurableWrapper";
import LayoutItem from "./LayoutItem";
import DynamicLayoutContext from "./DynamicLayoutContext";

interface Props {
  id?: string
  inLayout?: Layout;
  data?: any[]
}

const LayoutRenderer: React.FC<Props> = ({ inLayout }) => {
  const dynamicLayout = useDynamicLayout();

  const loadInitialConfiguration = useCallback(async () => {
    if (inLayout) {
      dynamicLayout.setLayout(inLayout);
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
    <DynamicLayoutContext.Provider value={dynamicLayout}>
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
              onClick={() => dynamicLayout.setAiDialogOpen(true)}>Tạo ằng AbI</Button>
            <Button variant="outlined" startIcon={dynamicLayout.isSaving ? <CircularProgress size={20} /> : <Save />}
              onClick={dynamicLayout.handleSaveConfiguration} disabled={dynamicLayout.isSaving}>{dynamicLayout.isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}</Button>
            <Button variant="outlined" startIcon={<Replay />}
              onClick={loadInitialConfiguration}>Tải lại</Button>
          </Box>

          <Typography variant="h5" gutterBottom>Bố cục Form</Typography>
          <Box component="form"
            onSubmit={(e) => e.preventDefault()}>
            <Grid container spacing={3}>
              {dynamicLayout.layout.length === 0 && <Grid sx={{ xs: 12 }}>
                <Typography align="center" color="text.secondary" sx={{ p: 4 }}>Đang tải cấu hình...</Typography>
              </Grid>}

              {dynamicLayout.layout.map((item, index, arr) => <ConfigurableWrapper type={item.type} id={item.id} index={index} length={arr.length}>
                <LayoutItem config={item.config} />
              </ConfigurableWrapper>)}

              <Grid sx={{ xs: 12 }}>
                <Button fullWidth startIcon={<AddCircleOutline />}
                  onClick={() => dynamicLayout.handleOpenAddComponentDialog({ parentId: 'root', parentType: 'root' })}
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
              <Grid sx={{ xs: 12, mt: 4 }}>
                <Button type="submit" variant="contained" color="primary" size="large"
                  onClick={() => alert('Dữ liệu form chính:\n' + JSON.stringify(dynamicLayout.formData, null, 2))}>Gửi dữ liệu</Button>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ mt: 5, p: 2, backgroundColor: '#eee', borderRadius: 1 }}>
            <Typography variant="h6">Dữ liệu Form hiện tại (JSON)</Typography>
            <pre>{JSON.stringify(dynamicLayout.formData, null, 2)}</pre>
          </Box>
        </Paper>

        <AddComponentDialog />

        <AIFormDialog />

        <FieldConfigDialog />

        <TabConfigDialog />

        <StepConfigDialog />

        <ButtonConfigDialog />

        <Snackbar open={dynamicLayout.toast.open} autoHideDuration={6000} onClose={() => dynamicLayout.setToast(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => dynamicLayout.setToast(prev => ({ ...prev, open: false }))} severity={dynamicLayout.toast.severity} sx={{ width: '100%' }}>{dynamicLayout.toast.message}</Alert>
        </Snackbar>
      </Box>
    </DynamicLayoutContext.Provider>
  );
}

export default LayoutRenderer;
