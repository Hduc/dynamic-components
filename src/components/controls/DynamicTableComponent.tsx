import React,
{
    useState,
    useEffect
} from 'react';
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    Typography,
    Paper,
    CircularProgress,
    InputAdornment,
    TableContainer,
    Table,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    IconButton,
    Button
} from '@mui/material';
import { TableColumn, TableConfig } from '../../types/table';
import { FieldOption } from '../../types/field';
import { DynFormData } from '../../types'
import { mockApi } from '../../config/mockApi';
import { evaluateExpression } from '../common/fuc_common';
import { Add, Delete } from '@mui/icons-material';

interface DynamicTableComponentProps {
    tableConfig: TableConfig;
    tableData: any[];

    onTableChange: (tableId: string,
        data: any[]) => void;
}

const DynamicTableComponent: React.FC<DynamicTableComponentProps> = ({ tableConfig,
    tableData,
    onTableChange }) => {
    const [localColumns,
        setLocalColumns] = useState<TableColumn[]>(tableConfig.columns);
    const [loading,
        setLoading] = useState(false);
    const [dynamicOptions,
        setDynamicOptions] = useState<{ [key: string]: FieldOption[] }>({});

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            if (!tableConfig.columnsApiUrl && !tableConfig.dataApiUrl) {
                setLocalColumns(tableConfig.columns);
                return;
            }
            setLoading(true);
            try {
                let columns = tableConfig.columns;
                if (tableConfig.columnsApiUrl) {
                    if (tableConfig.columnsApiUrl === '/api/products/columns') {
                        columns = await mockApi.getProductsColumns();
                    }
                }
                if (isMounted) setLocalColumns(columns);

                if (tableConfig.dataApiUrl) {
                    let data = [];
                    if (tableConfig.dataApiUrl === '/api/products/data') {
                        data = await mockApi.getProductsData();
                    }
                    if (isMounted)
                        onTableChange(tableConfig.id,
                            data);
                }
            } catch (error) {
                console.error("Failed to load table data:",
                    error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    },
        [tableConfig.id,
        tableConfig.columnsApiUrl,
        tableConfig.dataApiUrl,
        tableConfig.columns,
            onTableChange]);

    useEffect(() => {
        const fetchAllOptions = async () => {
            const fetches: Promise<void>[] = [];
            const newOptions: { [key: string]: FieldOption[] } = {};

            localColumns.forEach(col => {
                if (col.type === 'select' && col.config?.url) {
                    fetches.push(
                        (async () => {
                            if (col.config?.url === '/api/customers') {
                                const data = await mockApi.getCustomers();
                                newOptions[col.id] = data.map(d => ({
                                    value: d.id,
                                    label: d.name
                                }));
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
    },
        [localColumns]);

    const handleCellChange = (rowIndex: number,
        columnId: string,
        value: any) => {
        const newTableData = JSON.parse(JSON.stringify(tableData || []));
        const updatedRow = newTableData[rowIndex];
        updatedRow[columnId] = value;

        // Re-evaluate all formulas in the row basedon the new value
        localColumns.forEach(col => {
            if (col.defaultValue && /{.*}/.test(col.defaultValue)) {
                updatedRow[col.id] = evaluateExpression(col.defaultValue, updatedRow);
            }
        });

        newTableData[rowIndex] = updatedRow;

        onTableChange(tableConfig.id, newTableData);
    };

    const addRow = () => {
        const newRow: DynFormData = {};
        // First pass for non-formula defaults
        localColumns.forEach(col => {
            if (col.defaultValue && !/{.*}/.test(col.defaultValue)) {
                newRow[col.id] = col.defaultValue;
            } else {
                newRow[col.id] = '';
                // Initialize other fields
            }
        });

        // Second pass for formulas
        localColumns.forEach(col => {
            if (col.defaultValue && /{.*}/.test(col.defaultValue)) {
                newRow[col.id] = evaluateExpression(col.defaultValue,
                    newRow);
            }
        });


        onTableChange(tableConfig.id,
            [...(tableData || []),
                newRow]);
    };

    const deleteRow = (rowIndex: number) => {
        const newTableData = tableData.filter((_,
            index) => index !== rowIndex);

        onTableChange(tableConfig.id,
            newTableData);
    };

    const renderCellInput = (row: any,
        rowIndex: number,
        col: TableColumn) => {
        const value = row[col.id] || '';
        switch (col.type) {
            case 'select': const options = col.config?.url ? dynamicOptions[col.id] : col.config?.options;
                return (<FormControl variant="standard" fullWidth>
                    <Select value={value}
                        onChange={(e) => handleCellChange(rowIndex,
                            col.id,
                            e.target.value)}>{(options || []).map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}</Select>
                </FormControl>);
            case 'currency': return (<TextField variant="standard" type="number" value={value}
                onChange={(e) => handleCellChange(rowIndex,
                    col.id,
                    e.target.value)} fullWidth InputProps={{ endAdornment: <InputAdornment position="end">VND</InputAdornment> }} />);
            case 'number': case 'text': case 'date': default: return (<TextField variant="standard" type={col.type} value={value}
                onChange={(e) => handleCellChange(rowIndex,
                    col.id,
                    e.target.value)} fullWidth InputLabelProps={col.type === 'date' ? { shrink: true } : {}} />);
        }
    };

    if (loading) {
        return (
            <Paper variant="outlined" sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 150
            }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Đang tải dữ liệu bảng...</Typography>
            </Paper>
        );
    }

    const visibleColumns = localColumns.filter(c => c.visible !== false);
    return (<Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>{tableConfig.label}</Typography>
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>{visibleColumns.map(col => <TableCell key={col.id} sx={{
                        backgroundColor: col.backgroundColor,
                        color: col.color
                    }}>{col.label}</TableCell>)}<TableCell align="right">Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>{(tableData || []).map((row,
                    rowIndex) => (<TableRow key={rowIndex}>{visibleColumns.map(col => (<TableCell key={col.id} sx={{
                        backgroundColor: col.backgroundColor,
                        color: col.color
                    }}>{renderCellInput(row,
                        rowIndex,
                        col)}</TableCell>))}
                        <TableCell align="right">
                            <IconButton size="small"
                                onClick={() => deleteRow(rowIndex)} color="error">
                                <Delete fontSize="inherit" />
                            </IconButton>
                        </TableCell>
                    </TableRow>))}</TableBody>
            </Table>
        </TableContainer>
        <Button startIcon={<Add />}
            onClick={addRow} sx={{ mt: 2 }}>Thêm dòng</Button>
    </Paper>);
}

export default DynamicTableComponent