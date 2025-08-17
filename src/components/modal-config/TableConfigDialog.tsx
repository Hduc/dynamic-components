import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { TableColumn, TableColumnOption, TableConfig } from "../../types/table";
import { Add, ArrowDownward, ArrowUpward, Delete } from "@mui/icons-material";

const TableConfigDialog: React.FC<{
    open: boolean,
    onClose: () => void,
    onSave: (config: TableConfig) => void,
    existingTableConfig: TableConfig | null
}> = ({ open,
    onClose,
    onSave,
    existingTableConfig }) => {
        const [config,
            setConfig] = useState<Partial<TableConfig>>({
                label: '',
                columns: []
            });
        useEffect(() => {
            if (open && existingTableConfig) {
                setConfig(JSON.parse(JSON.stringify(existingTableConfig)));
            }
        },
            [open,
                existingTableConfig]);
        const handleChange = (field: keyof TableConfig,
            value: any) => {
            setConfig(prev => ({
                ...prev,
                [field]: value
            }));
        };
        const handleColumnChange = (index: number,
            field: keyof TableColumn,
            value: any) => {
            const newColumns = [...(config.columns || [])];
            const column = newColumns[index];
            if (field === 'visible') {
                (column as any)[field] = value;
            } else {
                (column as any)[field] = value;
            } if (field === 'type' && value === 'select' && !newColumns[index].config) {
                newColumns[index].config = {
                    options: [{
                        value: '',
                        label: ''
                    }]
                };
            } setConfig(prev => ({
                ...prev,
                columns: newColumns
            }));
        };
        const handleColumnConfigChange = (colIndex: number,
            field: string,
            value: any) => {
            const newColumns = [...(config.columns || [])];
            if (!newColumns[colIndex].config) {
                newColumns[colIndex].config = {};
            } (newColumns[colIndex].config as any)[field] = value;
            setConfig(prev => ({
                ...prev,
                columns: newColumns
            }));
        };
        const handleColumnOptionChange = (colIndex: number,
            optIndex: number,
            field: keyof TableColumnOption,
            value: string) => {
            const newColumns = [...(config.columns || [])];
            if (newColumns[colIndex]?.config?.options) {
                (newColumns[colIndex].config!.options![optIndex] as any)[field] = value;
                setConfig(prev => ({
                    ...prev,
                    columns: newColumns
                }));
            }
        };
        const addColumnOption = (colIndex: number) => {
            const newColumns = [...(config.columns || [])];
            if (newColumns[colIndex]?.config?.options) {
                newColumns[colIndex].config!.options!.push({
                    value: '',
                    label: ''
                });
                setConfig(prev => ({
                    ...prev,
                    columns: newColumns
                }));
            }
        };
        const removeColumnOption = (colIndex: number,
            optIndex: number) => {
            const newColumns = [...(config.columns || [])];
            if (newColumns[colIndex]?.config?.options) {
                newColumns[colIndex].config!.options = newColumns[colIndex].config!.options!.filter((_,
                    i) => i !== optIndex);
                setConfig(prev => ({
                    ...prev,
                    columns: newColumns
                }));
            }
        };
        const addColumn = () => {
            const newId = `col_${Date.now()}`;
            setConfig(prev => ({
                ...prev,
                columns: [...(prev.columns || []),
                {
                    id: newId,
                    label: 'Cột mới',
                    type: 'text',
                    visible: true,
                    defaultValue: ''
                }]
            }));
        };
        const removeColumn = (index: number) => {
            setConfig(prev => ({
                ...prev,
                columns: (prev.columns || []).filter((_,
                    i) => i !== index)
            }));
        };
        const handleMoveColumn = (index: number,
            direction: 'up' | 'down') => {
            const newColumns = [...(config.columns || [])];
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= newColumns.length) return;[newColumns[index],
            newColumns[newIndex]] = [newColumns[newIndex],
            newColumns[index]];
            setConfig(prev => ({
                ...prev,
                columns: newColumns
            }));
        };
        if (!open) return null;
        return (<Dialog open={open}
            onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Chỉnh sửa Bảng</DialogTitle>
            <DialogContent>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    pt: 2
                }}>
                    <TextField label="Tên bảng" value={config.label || ''}
                        onChange={(e) => handleChange('label',
                            e.target.value)} fullWidth />
                    <Divider />
                    <Typography variant="h6">Các cột (Định nghĩa thủ công)</Typography>{(config.columns || []).map((col,
                        index) => (<Paper key={index} variant="outlined" sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center'
                            }}>
                                <TextField label="ID Cột" value={col.id} disabled sx={{ flex: 1 }} />
                                <TextField label="Tên Cột" value={col.label}
                                    onChange={(e) => handleColumnChange(index,
                                        'label',
                                        e.target.value)} sx={{ flex: 2 }} />
                                <FormControl fullWidth sx={{ flex: 1 }}>
                                    <InputLabel>Kiểu dữ liệu</InputLabel>
                                    <Select value={col.type} label="Kiểu dữ liệu"
                                        onChange={(e) => handleColumnChange(index,
                                            'type',
                                            e.target.value)}>
                                        <MenuItem value="text">Text</MenuItem>
                                        <MenuItem value="number">Number</MenuItem>
                                        <MenuItem value="date">Date</MenuItem>
                                        <MenuItem value="currency">Tiền tệ</MenuItem>
                                        <MenuItem value="select">Danh mục (Select)</MenuItem>
                                    </Select>
                                </FormControl>
                                <IconButton
                                    onClick={() => handleMoveColumn(index, 'up')} disabled={index === 0}>
                                    <ArrowUpward />
                                </IconButton>
                                <IconButton
                                    onClick={() => handleMoveColumn(index, 'down')} disabled={index === (config.columns || []).length - 1}>
                                    <ArrowDownward />
                                </IconButton>
                                <IconButton
                                    onClick={() => removeColumn(index)} color="error">
                                    <Delete />
                                </IconButton>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid sx={{ xs: 6 }} >
                                    <TextField label="Giá trị Mặc định" value={col.defaultValue || ''}
                                        onChange={(e) => handleColumnChange(index,
                                            'defaultValue',
                                            e.target.value)} fullWidth margin="dense" helperText="Dùng giá trị tĩnh hoặc công thức,  vd: {so_luong}*{don_gia}" />
                                </Grid>
                                <Grid sx={{ xs: 3 }} >
                                    <TextField label="Màu chữ" value={col.color || ''}
                                        onChange={(e) => handleColumnChange(index,
                                            'color',
                                            e.target.value)} fullWidth margin="dense" />
                                </Grid>
                                <Grid sx={{ xs: 3 }} >
                                    <TextField label="Màu nền" value={col.backgroundColor || ''}
                                        onChange={(e) => handleColumnChange(index,
                                            'backgroundColor',
                                            e.target.value)} fullWidth margin="dense" />
                                </Grid>
                            </Grid>
                            <FormControlLabel control={<Checkbox checked={col.visible !== false}
                                onChange={(e) => handleColumnChange(index,
                                    'visible',
                                    e.target.checked)} />} label="Hiện" />{col.type === 'select' && (<Box sx={{
                                        pl: 2,
                                        borderLeft: '2px solid',
                                        borderColor: 'divider'
                                    }}>
                                        <Typography variant="subtitle2" gutterBottom>Các lựa chọn cho danh mục</Typography>
                                        <TextField label="API tải lựa chọn" value={col.config?.url || ''}
                                            onChange={(e) => handleColumnConfigChange(index,
                                                'url',
                                                e.target.value)} fullWidth margin="dense" helperText="Để trống để dùng các lựa chọn tĩnh bên dưới." />{col.config?.options?.map((opt,
                                                    optIndex) => (<Box key={optIndex} sx={{
                                                        display: 'flex',
                                                        gap: 1,
                                                        mb: 1,
                                                        alignItems: 'center'
                                                    }}>
                                                        <TextField size="small" label="Value" value={opt.value}
                                                            onChange={(e) => handleColumnOptionChange(index,
                                                                optIndex,
                                                                'value',
                                                                e.target.value)} />
                                                        <TextField size="small" label="Label" value={opt.label}
                                                            onChange={(e) => handleColumnOptionChange(index,
                                                                optIndex,
                                                                'label',
                                                                e.target.value)} sx={{ flexGrow: 1 }} />
                                                        <IconButton
                                                            onClick={() => removeColumnOption(index,
                                                                optIndex)} color="error" size="small">
                                                            <Delete />
                                                        </IconButton>
                                                    </Box>))}<Button
                                                        onClick={() => addColumnOption(index)} size="small">Thêm lựa chọn</Button>
                                    </Box>)}</Paper>))}<Button
                                        onClick={addColumn} startIcon={<Add />}>Thêm cột</Button>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6">Tải dữ liệu động</Typography>
                    <TextField label="API tải Cột (Columns)" value={config.columnsApiUrl || ''}
                        onChange={(e) => handleChange('columnsApiUrl',
                            e.target.value)} fullWidth margin="dense" helperText="Để trống nếu muốn định nghĩa cột thủ công ở trên." />
                    <TextField label="API tải Dữ liệu (Data)" value={config.dataApiUrl || ''}
                        onChange={(e) => handleChange('dataApiUrl',
                            e.target.value)} fullWidth margin="dense" />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}>Hủy</Button>
                <Button
                    onClick={() =>
                        onSave(config as TableConfig)} variant="contained">Lưu</Button>
            </DialogActions>
        </Dialog>);
    };