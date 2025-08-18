import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useDynamicLayout } from "../../hooks/useDynamicLayout";
import LayoutItem from "./LayoutItem";
import ConfigurableWrapper from "../controls/ConfigurableWrapper";

interface Props {
  formKey?: string;
  layoutJson?: any
  data?: any
  onSubmit?: (obj: any) => void
}

const LayoutView: React.FC<Props> = ({ formKey, layoutJson, data, onSubmit }) => {
  const [inforForm, setInforForm] = useState<Partial<any>>({})
  const { layout, setLayout } = useDynamicLayout()
  const loadInitialConfiguration = useCallback(async () => {
    if (layoutJson) {
      const dataMap = typeof layoutJson == 'string' ? JSON.parse(layoutJson) : layoutJson;
      setLayout(dataMap)
      return
    }
    // if (!formKey) return;
    // const savedLayout = await getFormById(formKey);
    // if (savedLayout.success) {
    //   const obj = savedLayout.data;
    //   setInforForm({ ...obj, layoutJson: '' })
    //   const dataMap = JSON.parse(obj.layoutJson);
    //   if (Array.isArray(dataMap) && dataMap.length > 0) {
    //     setLayout(dataMap);
    //   }
    // }
  }, [formKey, layoutJson]);

  useEffect(() => { loadInitialConfiguration(); }, [loadInitialConfiguration]);
  const handleOnSubmitForm = async (e: any) => {
    e.preventDefault()
    debugger
    // nếu có truyền vào thì đẩy theo fuc
    // if (onSubmit) {
    //   onSubmit(formData)
    //   return
    // }

    // const map = {
    //   ...formData,
    //   Ma_cty: '001',
    // }
    // const res = await apiCommonPost(inforForm.submitUrl, map)

  }
  return (
    <Box component="form"
      onSubmit={(e) => e.preventDefault()}>
      <Grid container spacing={3}>
        {layout.length === 0 && <Grid sx={{ xs: 12 }}>
          <Typography align="center" color="text.secondary" sx={{ p: 4 }}>Đang tải cấu hình...</Typography>
        </Grid>}
        {layout.map((item, index, arr) => <ConfigurableWrapper type={item.type} id={item.id} index={index} length={arr.length}>
              <LayoutItem config={item.config} />
            </ConfigurableWrapper>)}
      </Grid>
    </Box>
  );
}

export default LayoutView;
