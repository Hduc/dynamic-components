import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import { Autocomplete, Button, FormControl, IconButton, InputAdornment, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { FieldOption, TableColumn, TableConfig } from "./types";
import { useEffect, useState } from "react";
import { apiCommonGet } from "src/apis/apiCommon";
import { evaluateExpression } from "./functionCommon";

interface DynamicTableComponentProps {
    tableConfig: TableConfig;
    tableData: any[];
    onTableChange: (tableId: string, data: any[], type?: string) => void;
}


const DynamicTableComponent: React.FC<DynamicTableComponentProps> = ({ tableConfig, tableData, onTableChange }) => {
    const [localColumns, setLocalColumns] = useState<TableColumn[]>(tableConfig.columns);
    const [dynamicOptions, setDynamicOptions] = useState<{ [key: string]: FieldOption[] }>({});
    useEffect(() => {
        const fetchAllOptions = async () => {
            const fetches: Promise<void>[] = [];
            const newOptions: { [key: string]: FieldOption[] } = {};

            localColumns.forEach(col => {
                if (col.type === 'select' && col.config?.url) {
                    fetches.push(
                        (async () => {
                            if (col.config?.url === '') {
                                const res = await apiCommonGet(col.config?.url);
                                if (res.success && Array.isArray(res.data))
                                    newOptions[col.id] = res.data;
                            }
                        })()
                    );
                }
            });

            await Promise.all(fetches);
            setDynamicOptions(newOptions);
        };

        if (localColumns.length > 0) {
            fetchAllOptions();
        }
    }, [localColumns]);

    const handleCellChange = (rowIndex: number, columnId: string, value: any) => {
        const newTableData = JSON.parse(JSON.stringify(tableData || []));
        const updatedRow = newTableData[rowIndex];
        updatedRow[columnId] = value;

        // Re-evaluate all formulas in the row based on the new value
        localColumns.forEach(col => {
            if (col.defaultValue && /{.*}/.test(col.defaultValue)) {
                updatedRow[col.id] = evaluateExpression(col.defaultValue, updatedRow);
            }
        });

        newTableData[rowIndex] = updatedRow;
        onTableChange(tableConfig.id, newTableData);
    };

    const addRow = () => {
        const newRow = tableConfig.columns.reduce((acc, col) => ({ ...acc, [col.id]: '' }), {});
        onTableChange(tableConfig.id, [...(tableData || []), newRow], tableConfig.tableType);
    };

    const deleteRow = (rowIndex: number) => {
        const newTableData = (tableData || []).filter((_, index) => index !== rowIndex);
        onTableChange(tableConfig.id, newTableData, tableConfig.tableType);
    };

    const renderCellInput = (row: any, rowIndex: number, col: TableColumn) => {
        const value = row[col.id] || '';
        switch (col.type) {
            case 'select':
                return (<FormControl variant="standard" fullWidth>
                    <Select value={value} onChange={(e) => handleCellChange(rowIndex, col.id, e.target.value)}>
                        {(col.config?.options || []).map((opt: any) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </Select>
                </FormControl>);
                // const selectedValue = row.value || null;
                // const valueField = fieldConfig.config?.valueField || 'value';
                // const labelFieldConfig = fieldConfig.config?.labelField || 'label';
                // const getLabel = (option: any) => {
                //     if (!option) return '';
                //     if (labelFieldConfig.includes('{')) {
                //         return labelFieldConfig.replace(/{(.*?)}/g, (_, key) => option[key] ?? '');
                //     }
                //     return option[labelFieldConfig] ?? '';
                // };

                // const selectedOption =
                //     options.find((opt) => opt[valueField] === selectedValue) || null;

                // return (
                //     <Autocomplete
                //         options={options}
                //         getOptionLabel={getLabel}
                //         value={selectedOption}
                //         onChange={(event, newValue) => {
                //             onFieldChange &&
                //                 onFieldChange(
                //                     fieldConfig.id,
                //                     newValue ? newValue[valueField] : ''
                //                 );
                //         }}
                //         loading={loading}
                //         disabled={isDependentAndParentUnselected || loading}
                //         isOptionEqualToValue={(option, value) =>
                //             option[valueField] === value[valueField]
                //         }
                //         renderInput={(params) => (
                //             <TextField
                //                 {...params}
                //                 label={fieldConfig.label}
                //                 required={fieldConfig.validation?.required}
                //                 error={!!errorText}
                //                 helperText={
                //                     errorText || fieldConfig.config?.helperText
                //                 }
                //                 InputProps={{
                //                     ...params.InputProps,
                //                     endAdornment: (
                //                         <>
                //                             {loading ? (
                //                                 <CircularProgress
                //                                     color="inherit"
                //                                     size={20}
                //                                 />
                //                             ) : null}
                //                             {params.InputProps.endAdornment}
                //                         </>
                //                     ),
                //                 }}
                //             />
                //         )}
                //     />
                // );
            case 'currency':
                return (<TextField variant="standard"
                    type="number" value={value}
                    onChange={(e) => handleCellChange(rowIndex, col.id, e.target.value)}
                    fullWidth
                    InputProps={{ endAdornment: <InputAdornment position="end">VND</InputAdornment> }} />);
            case 'number':
            case 'text':
            case 'date':
            default:
                return (<TextField variant="standard" type={col.type} value={value}
                    onChange={(e) => handleCellChange(rowIndex, col.id, e.target.value)}
                    fullWidth InputLabelProps={col.type === 'date' ? { shrink: true } : {}} />);
        }
    };

    useEffect(() => {
        console.log('tableData', tableData)
    }, [tableData])

    return (<Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>{tableConfig.label}</Typography>
        <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>{tableConfig.columns.map((col: any) => <TableCell key={col.id}
                        sx={{
                            width: col.width || 'auto',           // chiều rộng
                            backgroundColor: col.bgColor || "#f5f5f5", // màu nền
                            color: col.textColor || "#64748B",       // màu chữ
                            fontWeight: "bold",                    // chữ đậm cho header
                            whiteSpace: 'nowrap'
                        }}>
                        {col.label}
                    </TableCell>)}
                        <TableCell align="right"
                            sx={{
                                backgroundColor: "#f5f5f5",
                                fontWeight: "bold",
                                whiteSpace: 'nowrap'
                            }}>
                            Hành động
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(tableData || []).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>{tableConfig.columns.map((col: any) => (
                            <TableCell key={col.id}>{renderCellInput(row, rowIndex, col)}</TableCell>))}
                            <TableCell align="right">
                                <IconButton size="small" onClick={() => deleteRow(rowIndex)} color="error">
                                    <Delete fontSize="inherit" />
                                </IconButton>
                            </TableCell>
                        </TableRow>))}
                </TableBody>
            </Table>
        </TableContainer>
        <Button startIcon={<Add />} onClick={addRow} sx={{ mt: 2 }}>Thêm dòng</Button>
    </Paper>);
};


export default DynamicTableComponent