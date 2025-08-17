import React,
{
  useState,
  useEffect,
  useCallback,
  FC,
  ReactNode
} from 'react';
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Divider,
  InputAdornment,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  SelectChangeEvent,
  ButtonProps,
  Autocomplete
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
import ReplayIcon from '@mui/icons-material/Replay';
import LaunchIcon from '@mui/icons-material/Launch';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// --- ĐỊNH NGHĨA CÁC INTERFACE TYPESCRIPT ---

// Cấu trúc dữ liệu chung
type DynFormData = { [key: string]: any };
type Errors = { [key: string]: string };
type AddComponentContext = {
  parentId: string;
  parentType: 'root' | 'tab' | 'step';
  tabIndex?: number;
  stepIndex?: number;
};

// --- Interfaces cho Field ---
interface FieldAction {
  action?: string// 'FETCH_AND_UPDATE';
  targetField?: string
  apiUrl: string;
  // e.g.,/api/customers/{value}
  targets?: {
    sourceKey: string;
    // Key from API response. Use '.' for direct response.
    destinationField: string;
    // ID of the form field to update.
  }[];
}
interface FieldOption {
  value: string | number;
  label: string;
  [key: string]: any;
}
interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
}
interface ExtraFieldConfig {
  helperText?: string;
  options?: FieldOption[];
  url?: string;
  valueField?: string;
  labelField?: string;
  defaultValue?: string;  // e.g.,'now','now-10d','now+2h'
  variant?: string
  color?: string

  onValueChange?: FieldAction[];
}
interface FieldConfig {
  id: string;
  type: 'text' | 'number' | 'date' | 'datetime-local' | 'color' | 'radio' | 'select';
  label: string;
  grid: number;
  validation?: FieldValidation;
  config?: ExtraFieldConfig;
  dependsOn?: string;
}

// --- Interfaces cho Table ---
interface TableColumnOption {
  value: string | number;
  label: string;
}
interface TableColumn {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'select';
  visible?: boolean;
  defaultValue?: string;
  color?: string;
  backgroundColor?: string;
  config?: {
    options?: TableColumnOption[];
    url?: string;
  }
}
interface TableConfig {
  id: string;
  label: string;
  columns: TableColumn[];
  columnsApiUrl?: string;
  dataApiUrl?: string;
}

// --- Interface cho Button ---
interface ButtonConfig {
  id?: string;
  label?: string;
  grid?: number;
  config?: {
    variant?: ButtonProps['variant'];
    color?: ButtonProps['color'];
    onClickAction?: string;
    // Tên của action trong actionRegistry
  };
}


// --- Interfaces cho các thành phần Layout phức tạp ---
interface TabItem {
  id: string;
  label: string;
  items: LayoutItem[];
}
interface TabsConfig {
  tabs: TabItem[];
}
interface StepItem {
  id: string;
  label: string;
  items: LayoutItem[];

  onNextAction?: string;
}
interface StepperConfig {
  steps: StepItem[];
}
interface ModalFormConfig {
  buttonLabel: string;
  dialogTitle: string;
  layout: LayoutItem[];

  onSubmitAction?: string //'ADD_TO_TABLE';

  onSubmitTarget?: string;
  // ID của bảng mục tiêu
}

type LayoutItemConfig = FieldConfig | TableConfig | TabsConfig | StepperConfig | ModalFormConfig | ButtonConfig;

interface BaseLayoutItem<T extends 'field' | 'table' | 'tabs' | 'stepper' | 'modal-button' | 'button',
  C extends LayoutItemConfig> {
  id: string;
  type: T;
  config: C;
}

type FieldLayoutItem = BaseLayoutItem<'field',
  FieldConfig>;
type TableLayoutItem = BaseLayoutItem<'table',
  TableConfig>;
type TabsLayoutItem = BaseLayoutItem<'tabs',
  TabsConfig>;
type StepperLayoutItem = BaseLayoutItem<'stepper',
  StepperConfig>;
type ModalButtonLayoutItem = BaseLayoutItem<'modal-button',
  ModalFormConfig>;
type ButtonLayoutItem = BaseLayoutItem<'button',
  ButtonConfig>;

type LayoutItem = FieldLayoutItem | TableLayoutItem | TabsLayoutItem | StepperLayoutItem | ModalButtonLayoutItem | ButtonLayoutItem;

// --- Interfaces cho Props của Component ---
interface ConfigurableWrapperProps {
  children: ReactNode;

  onEdit?: () => void;

  onDelete?: () => void;
  type: string;

  onMoveUp?: () => void;

  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}
interface DynamicFieldProps {
  fieldConfig: FieldConfig;
  formData: DynFormData;

  onFieldChange: (fieldId: string,
    value: any) => void;
  errorText?: string;
}
interface DynamicTableComponentProps {
  tableConfig: TableConfig;
  tableData: any[];

  onTableChange: (tableId: string,
    data: any[]) => void;
}
interface DynamicButtonProps {
  componentConfig: ButtonConfig;

  onAction: (actionName: string) => void;
}
interface TabsComponentProps {
  componentId: string;
  componentConfig: TabsConfig;
  formData: DynFormData;
  errors: Errors;

  onFieldChange: (fieldId: string,
    value: any) => void;

  onTableChange: (tableId: string,
    data: any[]) => void;

  onAddTab: (tabsComponentId: string) => void;

  onOpenConfig: (itemId: string) => void;

  onOpenTableConfig: (itemId: string) => void;

  onDeleteItem: (itemId: string) => void;

  onOpenTabConfig: (componentId: string,
    tabId: string) => void;

  onOpenAddComponentDialog: (context: AddComponentContext) => void;

  onMoveItem: (itemId: string,
    direction: 'up' | 'down') => void;
}
interface StepperComponentProps {
  componentId: string;
  componentConfig: StepperConfig;
  formData: DynFormData;
  errors: Errors;

  onFieldChange: (fieldId: string,
    value: any) => void;

  onTableChange: (tableId: string,
    data: any[]) => void;

  onAddStep: (stepperComponentId: string) => void;

  onOpenConfig: (itemId: string) => void;

  onOpenTableConfig: (itemId: string) => void;

  onDeleteItem: (itemId: string) => void;

  onValidateStep: (itemsToValidate: LayoutItem[]) => Errors;

  onOpenStepConfig: (componentId: string,
    stepId: string) => void;

  onExecuteAction: (actionName: string) => Promise<void>;

  onMoveItem: (itemId: string,
    direction: 'up' | 'down') => void;

  onOpenAddComponentDialog: (context: AddComponentContext) => void;
}
interface ModalButtonComponentProps {
  componentConfig: ModalFormConfig;

  onModalSubmit: (modalData: DynFormData,
    targetId?: string,
    action?: string) => void;// 'ADD_TO_TABLE'
}

// --- MOCK API (Giả lập API) ---
const mockApi = {
  getSerialNumber: async (): Promise<string> => {
    console.log("API: Fetching serial number...");
    await new Promise(r => setTimeout(r,
      600));
    return `SN-${Date.now()}`;
  },
  getCustomers: async (): Promise<any[]> => {
    console.log("API: Fetching customers...");
    await new Promise(r => setTimeout(r,
      300));
    return [
      { id: 'cust1', name: 'Công ty A', address: '123 Đường B,Quận C' }, { id: 'cust2', name: 'Công ty B', address: '456 Đường D,Quận E' }];
  },
  getCustomerById: async (customerId: string): Promise<any | null> => {
    console.log(`API: Fetching customer object for ${customerId}`);
    await new Promise(r => setTimeout(r,
      250));
    const customers = [{ id: 'cust1', name: 'Công ty A', address: '123 Đường B,Quận C,TP.HCM' }, { id: 'cust2', name: 'Công ty B', address: '456 Đường D,Quận F,Hà Nội' }];
    return customers.find(c => c.id === customerId) || null;
  },
  validateStepData: async (): Promise<void> => {
    console.log("API: Validating step data...");
    await new Promise(r => setTimeout(r,
      1500));
    if (Math.random() > 0.4) {
      console.log("API: Step data is valid.");
      return Promise.resolve();
    } else {
      console.error("API: Step data validation failed!");
      throw new Error("Dữ liệu không hợp lệ từ phía server!");
    }
  },
  getProductsColumns: async (): Promise<TableColumn[]> => {
    console.log("API: Fetching product columns...");
    await new Promise(r => setTimeout(r,
      700));
    return [{
      id: 'product_id',
      label: 'Mã SP',
      type: 'text'
    },
    {
      id: 'product_name',
      label: 'Tên Sản phẩm',
      type: 'text'
    },
    {
      id: 'quantity_on_hand',
      label: 'Tồn kho',
      type: 'number'
    },];
  },
  getProductsData: async (): Promise<any[]> => {
    console.log("API: Fetching product data...");
    await new Promise(r => setTimeout(r,
      1200));
    return [{
      product_id: 'LP-01',
      product_name: 'Laptop Pro',
      quantity_on_hand: 55
    },
    {
      product_id: 'MS-05',
      product_name: 'Mouse Wireless',
      quantity_on_hand: 250
    },
    {
      product_id: 'KB-12',
      product_name: 'Keyboard Mechanical',
      quantity_on_hand: 120
    },];
  },
  getFormConfiguration: async (id: number): Promise<LayoutItem[] | null> => {
    console.log(`API: Getting form config for id: ${id}`);
    await new Promise(r => setTimeout(r,
      800));
    const savedConfig = localStorage.getItem(`form_config_${id}`);
    if (savedConfig) {
      return JSON.parse(savedConfig);
    } return null;
  },
  saveFormConfiguration: async (id: number,
    layout: LayoutItem[]): Promise<{
      success: boolean,
      message: string
    }> => {
    console.log(`API: Saving form config for id: ${id}`);
    await new Promise(r => setTimeout(r,
      1000));
    localStorage.setItem(`form_config_${id}`,
      JSON.stringify(layout));
    if (Math.random() > 0.9) {
      throw new Error("Lỗi mạng ngẫu nhiên!");
    } return {
      success: true,
      message: 'Lưu cấu hình thành công!'
    };
  }
};

// --- HÀM TIỆN ÍCH ---
const parseDateExpression = (expression: string, type: 'date' | 'datetime-local'): string => {
  const now = new Date();
  const regex = /now\s*([+-])?\s*(\d+)?\s*([dhm])?/;
  const match = expression.toLowerCase().match(regex);

  if (!match) return '';
  // Invalid expression

  const operator = match[1];
  const value = parseInt(match[2],
    10);
  const unit = match[3];

  if (operator && !isNaN(value) && unit) {
    switch (unit) {
      case 'd':
        now.setDate(now.getDate() + (operator === '+' ? value : -value));
        break;
      case 'h':
        now.setHours(now.getHours() + (operator === '+' ? value : -value));
        break;
      case 'm':
        now.setMinutes(now.getMinutes() + (operator === '+' ? value : -value));
        break;
    }
  }

  // Adjust for local timezone offset to get correct local time string
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - timezoneOffset);

  if (type === 'date') {
    return localDate.toISOString().split('T')[0];
  }

  if (type === 'datetime-local') {
    return localDate.toISOString().slice(0,
      16);
  }

  return '';
};

const evaluateExpression = (expression: string,
  rowContext: DynFormData): string => {
  if (!expression) return '';

  const placeholderRegex = /{(\w+)}/g;

  const replacedExpr = expression.replace(placeholderRegex,
    (match,
      key) => {
      const value = rowContext[key];
      return value !== undefined && value !== null ? String(value) : '0';
    });

  const mathRegex = /^[0-9+\-*/().\s]+$/;
  if (mathRegex.test(replacedExpr)) {
    try {
      // Using a safer evaluation method than eval()
      const result = new Function(`return ${replacedExpr}`)();
      return String(result);
    } catch (e) {
      console.error("Error evaluating math expression:",
        e);
      return replacedExpr;
      // Return the expression with numbers if evaluation fails
    }
  }

  return replacedExpr.replace(/0/g,
    '');
};


// --- CÁC COMPONENT CON ---
const ConfigurableWrapper: FC<ConfigurableWrapperProps> = ({ children,
  onEdit,
  onDelete,
  type,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast }) => (<Box sx={{
    position: 'relative', '&:hover .component-actions': { opacity: 1 }, p: 1, border: '1px dashed transparent', '&:hover': { borderColor: 'action.hover', backgroundColor: 'rgba(0,0,0,0.02)' },
    borderRadius: 1
  }}>{children}<Box className="component-actions" sx={{
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0,
    transition: 'opacity 0.2s',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: '4px',
    p: '2px',
    boxShadow: 1,
    zIndex: 10
  }}>
      <IconButton size="small"
        onClick={onMoveUp} disabled={isFirst} title="Di chuyển lên">
        <ArrowUpwardIcon fontSize="inherit" />
      </IconButton>
      <IconButton size="small"
        onClick={onMoveDown} disabled={isLast} title="Di chuyển xuống">
        <ArrowDownwardIcon fontSize="inherit" />
      </IconButton>{onEdit && <IconButton size="small"
        onClick={onEdit} title={`Chỉnh sửa ${type}`}>
        <SettingsIcon fontSize="inherit" />
      </IconButton>}{onDelete && <IconButton size="small" color="error"
        onClick={onDelete} title={`Xóa ${type}`}>
        <DeleteIcon fontSize="inherit" />
      </IconButton>}</Box>
  </Box>);
const DynamicField: FC<DynamicFieldProps> = ({ fieldConfig,
  formData,
  onFieldChange,
  errorText }) => {
  const [options,
    setOptions] = useState<FieldOption[]>([]);
  const [loading,
    setLoading] = useState(false);
  const dependentFieldValue = fieldConfig.dependsOn ? formData[fieldConfig.dependsOn] : null;
  const isDependentAndParentUnselected = !!fieldConfig.dependsOn && !dependentFieldValue;
  useEffect(() => {
    if (fieldConfig.type !== 'select' || !fieldConfig.config?.url) {
      setOptions(fieldConfig.config?.options || []);
      return;
    }
    if (isDependentAndParentUnselected) {
      setOptions([]);
      return;
    }
    let isActive = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        let data;
        if (fieldConfig.config?.url === '/api/customers') data = await mockApi.getCustomers();
        if (isActive && data) setOptions(data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu cho Select:",
          error);
      }
      finally {
        if (isActive) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isActive = false;
    };
  },
    [fieldConfig.type,
    fieldConfig.config,
      dependentFieldValue,
      isDependentAndParentUnselected]);
  const handleChange = (event: any) => {
    const { value,
      type } = event.target;
    const finalValue = (type === 'checkbox' && 'checked' in event.target) ? (event.target as HTMLInputElement).checked : value;

    onFieldChange(fieldConfig.id,
      finalValue);
  };
  const commonProps = {
    label: fieldConfig.label,
    value: formData[fieldConfig.id] || '',

    onChange: handleChange,
    required: fieldConfig.validation?.required,
    error: !!errorText,
    helperText: errorText || fieldConfig.config?.helperText,
    InputLabelProps: { shrink: true }
  };
  switch (fieldConfig.type) {
    case 'text': case 'number': case 'color': case 'datetime-local': return <TextField fullWidth type={fieldConfig.type} {...commonProps} />;
    case 'date': return <TextField fullWidth type="date" {...commonProps} />;
    case 'radio': return (<FormControl component="fieldset" required={fieldConfig.validation?.required}>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>{fieldConfig.label}</Typography>
      <RadioGroup row name={fieldConfig.id} value={formData[fieldConfig.id] || ''}
        onChange={handleChange}>{(fieldConfig.config?.options || []).map(opt => <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />)}</RadioGroup>{errorText && <FormHelperText error>{errorText}</FormHelperText>}</FormControl>);
    case 'select':
      const selectedValue = formData[fieldConfig.id] || null;
      const valueField = fieldConfig.config?.valueField || 'value';
      const labelField = fieldConfig.config?.labelField || 'label';
      const selectedOption = options.find(opt => opt[valueField] === selectedValue) || null;
      return (
        <Autocomplete
          options={options}
          getOptionLabel={(option) => option[labelField] || ''}
          value={selectedOption}

          onChange={(event,
            newValue) => {

            onFieldChange(fieldConfig.id,
              newValue ? newValue[valueField] : '');
          }}
          loading={loading}
          disabled={isDependentAndParentUnselected || loading}
          isOptionEqualToValue={(option,
            value) => option[valueField] === value[valueField]}
          renderInput={(params) => (
            <TextField
              {...params}
              label={fieldConfig.label}
              required={fieldConfig.validation?.required}
              error={!!errorText}
              helperText={errorText || fieldConfig.config?.helperText}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      );
    default: return <Typography color="error">Loại trường không xác định: {fieldConfig.type}</Typography>;
  }
};
const DynamicTableComponent: FC<DynamicTableComponentProps> = ({ tableConfig,
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
        updatedRow[col.id] = evaluateExpression(col.defaultValue,
          updatedRow);
      }
    });

    newTableData[rowIndex] = updatedRow;

    onTableChange(tableConfig.id,
      newTableData);
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
            col)}</TableCell>))}<TableCell align="right">
              <IconButton size="small"
                onClick={() => deleteRow(rowIndex)} color="error">
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </TableCell>
          </TableRow>))}</TableBody>
      </Table>
    </TableContainer>
    <Button startIcon={<AddIcon />}
      onClick={addRow} sx={{ mt: 2 }}>Thêm dòng</Button>
  </Paper>);
};
const DynamicButton: FC<DynamicButtonProps> = ({ componentConfig,
  onAction }) => {
  const { label, config } = componentConfig;
  if(!config) return null;
  const handleClick = () => {
    if (config.onClickAction) {

      onAction(config.onClickAction);
    }
  };
  return (
    <Button
      variant={config.variant || 'contained'}
      color={config.color || 'primary'}

      onClick={handleClick}
      fullWidth
    >
      {label}
    </Button>
  );
};

const TabsComponent: FC<TabsComponentProps> = ({ componentId,
  componentConfig,
  formData,
  onFieldChange,
  onTableChange,
  onAddTab,
  onOpenConfig,
  onDeleteItem,
  onOpenTableConfig,
  errors,
  onOpenTabConfig,
  onOpenAddComponentDialog,
  onMoveItem }) => {
  const [activeTab,
    setActiveTab] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent,
    newValue: number) => setActiveTab(newValue);
  const renderLayoutItem = (item: LayoutItem,
    index: number,
    array: LayoutItem[]) => {
    switch (item.type) {
      case 'field': return (<Grid sx={{ xs: 3, sm: item.config.grid }} key={item.id}>
        <ConfigurableWrapper type="trường"
          onEdit={() =>
            onOpenConfig(item.id)}
          onDelete={() =>
            onDeleteItem(item.id)}
          onMoveUp={() =>
            onMoveItem(item.id,
              'up')}
          onMoveDown={() =>
            onMoveItem(item.id,
              'down')} isFirst={index === 0} isLast={index === array.length - 1}>
          <DynamicField fieldConfig={item.config} formData={formData}
            onFieldChange={onFieldChange} errorText={errors[item.id]} />
        </ConfigurableWrapper>
      </Grid>);
      case 'table': return (<Grid sx={{ xs: 12 }} key={item.id}>
        <ConfigurableWrapper type="bảng"
          onEdit={() =>
            onOpenTableConfig(item.id)}
          onDelete={() =>
            onDeleteItem(item.id)}
          onMoveUp={() =>
            onMoveItem(item.id,
              'up')}
          onMoveDown={() =>
            onMoveItem(item.id,
              'down')} isFirst={index === 0} isLast={index === array.length - 1}>
          <DynamicTableComponent tableConfig={item.config} tableData={formData[item.id] || []}
            onTableChange={onTableChange} />
        </ConfigurableWrapper>
      </Grid>);
      default: return null;
    }
  };
  return (<Paper variant="outlined">
    <Box sx={{
      borderBottom: 1,
      borderColor: 'divider',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Tabs value={activeTab}
        onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ flexGrow: 1 }}>{componentConfig.tabs.map(tab => <Tab key={tab.id} label={<Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>{tab.label}<IconButton size="small" sx={{ p: 0.5 }}
          onClick={(e) => {
            e.stopPropagation();

            onOpenTabConfig(componentId,
              tab.id);
          }} title="Chỉnh sửa tên tab">
            <SettingsIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Box>} />)}</Tabs>
      <IconButton
        onClick={() =>
          onAddTab(componentId)} color="primary" title="Thêm Tab mới" sx={{
            mr: 1,
            ml: 1
          }}>
        <AddCircleOutlineIcon />
      </IconButton>
    </Box>{componentConfig.tabs.map((tab,
      index) => (<Box role="tabpanel" hidden={activeTab !== index} key={tab.id} sx={{ p: 3 }}>{activeTab === index && (<Grid container spacing={3}>{tab.items.map((item,
        idx,
        arr) => renderLayoutItem(item,
          idx,
          arr))}<Grid sx={{ xs: 12 }} >
          <Button variant="outlined" size="small" startIcon={<AddIcon />}
            onClick={() =>
              onOpenAddComponentDialog({
                parentId: componentId,
                parentType: 'tab',
                tabIndex: index
              })} sx={{ mt: 2 }}>Thêm thành phần vào Tab</Button>
        </Grid>
      </Grid>)}</Box>))}</Paper>);
};

const StepperComponent: FC<StepperComponentProps> = ({ componentId,
  componentConfig,
  formData,
  onFieldChange,
  onTableChange,
  onAddStep,
  onOpenConfig,
  onDeleteItem,
  onOpenTableConfig,
  errors,
  onValidateStep,
  onOpenStepConfig,
  onExecuteAction,
  onMoveItem,
  onOpenAddComponentDialog }) => {
  const [activeStep,
    setActiveStep] = useState(0);
  const [isStepLoading,
    setStepLoading] = useState(false);
  const steps = componentConfig.steps || [];

  const handleNext = async () => {
    const currentStep = steps[activeStep];
    const stepErrors =
      onValidateStep(currentStep.items);
    if (Object.keys(stepErrors).length > 0) {
      return;
    }

    if (currentStep.onNextAction) {
      setStepLoading(true);
      try {
        await
          onExecuteAction(currentStep.onNextAction);
        setActiveStep((prev) => prev + 1);
      } catch (error) {
        // Error toast is handled by the caller (App component)
      } finally {
        setStepLoading(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
  const renderLayoutItem = (item: LayoutItem,
    index: number,
    array: LayoutItem[]) => {
    switch (item.type) {
      case 'field': return (<Grid sx={{ xs: 12, sm: item.config.grid }} key={item.id}>
        <ConfigurableWrapper type="trường"
          onEdit={() =>
            onOpenConfig(item.id)}
          onDelete={() =>
            onDeleteItem(item.id)}
          onMoveUp={() =>
            onMoveItem(item.id,
              'up')}
          onMoveDown={() =>
            onMoveItem(item.id,
              'down')} isFirst={index === 0} isLast={index === array.length - 1}>
          <DynamicField fieldConfig={item.config} formData={formData}
            onFieldChange={onFieldChange} errorText={errors[item.id]} />
        </ConfigurableWrapper>
      </Grid>);
      case 'table': return (<Grid sx={{ xs: 12 }} key={item.id}>
        <ConfigurableWrapper type="bảng"
          onEdit={() =>
            onOpenTableConfig(item.id)}
          onDelete={() =>
            onDeleteItem(item.id)}
          onMoveUp={() =>
            onMoveItem(item.id,
              'up')}
          onMoveDown={() =>
            onMoveItem(item.id,
              'down')} isFirst={index === 0} isLast={index === array.length - 1}>
          <DynamicTableComponent tableConfig={item.config} tableData={formData[item.id] || []}
            onTableChange={onTableChange} />
        </ConfigurableWrapper>
      </Grid>);
      default: return null;
    }
  };

  return (<Paper variant="outlined">
    <Box sx={{ p: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel>{steps.map((step) => (<Step key={step.id}>
        <StepLabel>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>{step.label}<IconButton size="small" sx={{ p: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();

              onOpenStepConfig(componentId,
                step.id);
            }} title="Chỉnh sửa bước">
              <SettingsIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Box>
        </StepLabel>
      </Step>))}</Stepper>
      <Box sx={{ mt: 4 }}>{activeStep === steps.length ? (<Box>
        <Typography>Tất cả các bước đã hoàn thành!</Typography>
      </Box>) : (<Box>
        <Grid container spacing={3}>{steps[activeStep].items.map((item,
          idx,
          arr) => renderLayoutItem(item,
            idx,
            arr))}<Grid sx={{ xs: 12 }} >
            <Button variant="outlined" size="small" startIcon={<AddIcon />}
              onClick={() =>
                onOpenAddComponentDialog({
                  parentId: componentId,
                  parentType: 'step',
                  stepIndex: activeStep
                })} sx={{ mt: 2 }}>Thêm thành phần vào Bước</Button>
          </Grid>
        </Grid>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          pt: 4
        }}>
          <Button color="inherit" disabled={activeStep === 0 || isStepLoading}
            onClick={handleBack} sx={{ mr: 1 }}>Quay lại</Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button
            onClick={handleNext} disabled={isStepLoading} startIcon={isStepLoading ? <CircularProgress size={20} /> : null}>
            {isStepLoading ? 'Đang xử lý...' : (activeStep === steps.length - 1 ? 'Hoàn thành' : 'Tiếp theo')}
          </Button>
        </Box>
      </Box>)}
      </Box>
    </Box>
    <Box sx={{
      p: 1,
      display: 'flex',
      justifyContent: 'center',
      borderTop: '1px solid',
      borderColor: 'divider'
    }}>
      <Button
        onClick={() => onAddStep(componentId)} color="primary" startIcon={<AddCircleOutlineIcon />} size="small">Thêm Bước</Button>
    </Box>
  </Paper>);
};

const ModalButtonComponent: FC<ModalButtonComponentProps> = ({
  componentConfig,
  onModalSubmit }) => {
  const [open, setOpen] = useState(false);
  const [modalFormData, setModalFormData] = useState<DynFormData>({});
  const [modalErrors, setModalErrors] = useState<Errors>({});

  const handleOpen = () => {
    setModalFormData({});
    setModalErrors({});
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleModalFieldChange = (fieldId: string,
    value: any) => {
    setModalFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleModalSubmit = () => {
    // Basic validation can be added here if needed

    onModalSubmit(modalFormData,
      componentConfig.onSubmitTarget,
      componentConfig.onSubmitAction);
    handleClose();
  };

  // Recursive renderer for items inside the modal
  const renderModalItem = (item: LayoutItem): ReactNode => {
    switch (item.type) {
      case 'field':
        return (
          <Grid sx={{ xs: 12, sm: item.config.grid }} key={item.id}>
            <DynamicField
              fieldConfig={item.config}
              formData={modalFormData}

              onFieldChange={handleModalFieldChange}
              errorText={modalErrors[item.id]}
            />
          </Grid>
        );
      case 'tabs':
        return (
          <Grid sx={{ xs: 12 }} key={item.id}>
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
      default:
        return null;
    }
  };

  return (
    <>
      <Button variant="contained"
        onClick={handleOpen} endIcon={<LaunchIcon />}>
        {componentConfig.buttonLabel}
      </Button>
      <Dialog open={open}
        onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{componentConfig.dialogTitle}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ pt: 2 }}>
            {componentConfig.layout.map(renderModalItem)}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}>Hủy</Button>
          <Button
            onClick={handleModalSubmit} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// --- Dialogs ---
const AddComponentDialog: FC<{
  open: boolean,
  onClose: () => void,
  onSelect: (type: LayoutItem['type']) => void,
  context: AddComponentContext | null
}> = ({ open,
  onClose,
  onSelect,
  context }) => {
    const availableTypes: {
      type: LayoutItem['type'],
      label: string
    }[] = [
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

    if (context?.parentType === 'root') {
      availableTypes.push({
        type: 'tabs',
        label: 'Nhóm Tab'
      });
      availableTypes.push({
        type: 'stepper',
        label: 'Nhóm Stepper'
      });
      availableTypes.push({
        type: 'modal-button',
        label: 'Nút Mở Form (Modal)'
      });
    }

    return (
      <Dialog open={open}
        onClose={onClose}>
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

                onSelect(item.type);

                onClose();
              }}>
              {item.label}
            </Button>
          ))}
        </DialogContent>
      </Dialog>
    );
  };
const AIFormDialog: FC<{
  open: boolean,
  onClose: () => void,
  onGenerate: (items: LayoutItem[]) => void
}> = ({ open,
  onClose,
  onGenerate }) => {
    const [aiPrompt,
      setAiPrompt] = useState('Một form đăng ký sự kiện có họ tên,email, số điện thoại và số người tham dự.');
    const [isGenerating,
      setIsGenerating] = useState(false);
    const [aiError,
      setAiError] = useState('');
    const handleGenerate = async () => {
      if (!aiPrompt) {
        setAiError("Vui lòng nhập mô tả.");
        return;
      } setIsGenerating(true);
      setAiError('');
      const systemPrompt = `Dựa trên yêu cầu của người dùng, hãy tạo một mảng JSON chỉ chứa các đối tượng cấu hình cho các trường (field) của một biểu mẫu web.
        KHÔNG tạo tab hay bảng.
        Yêu cầu người dùng: "${aiPrompt}" 
        QUY TẮC: 
        - Chỉ tạo các đối tượng có type: 'field'. - Mỗi đối tượng PHẢI tuân thủ theo JSON Schema. 
        - 'id': duy nhất,
        snake_case, tiếng Anh. - 'label': tiếng Việt có dấu. - 'type': "text", "number",        "date", "radio", "select". - 'grid': 6 hoặc 12. - 'config.options': Nếu type là 'radio'/'select',
        cung cấp lựa chọn. - 'config.valueField'/'labelField': đặt là 'value'/'label' cho options.`;
      const payload = {
        contents: [{
          role: "user",
          parts: [{ text: systemPrompt }]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                type: { type: "STRING" },
                label: { type: "STRING" },
                grid: { type: "INTEGER" },
                validation: {
                  type: "OBJECT",
                  properties: { required: { type: "BOOLEAN" } }
                },
                config: {
                  type: "OBJECT",
                  properties: {
                    options: {
                      type: "ARRAY",
                      items: {
                        type: "OBJECT",
                        properties: {
                          value: { type: "STRING" },
                          label: { type: "STRING" }
                        }
                      }
                    },
                    valueField: { type: "STRING" },
                    labelField: { type: "STRING" }
                  }
                }
              },
              required: ["id",
                "type",
                "label",
                "grid"]
            }
          }
        }
      };
      try {
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        if (!response.ok) throw new Error(`Lỗi API: ${response.status}`);
        const result = await response.json();
        if (result.candidates?.[0]) {
          const generatedFields = JSON.parse(result.candidates[0].content.parts[0].text);
          const layoutItems: FieldLayoutItem[] = generatedFields.map((field: FieldConfig) => ({
            id: field.id,
            type: 'field',
            config: field
          }));

          onGenerate(layoutItems);

          onClose();
        } else {
          throw new Error("Phản hồi từ AI không hợp lệ.");
        }
      } catch (error: any) {
        setAiError(error.message);
      } finally {
        setIsGenerating(false);
      }
    };
    return (<Dialog open={open}
      onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <AutoAwesomeIcon color="primary" /> Tạo Form bằng AI</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Mô tả form bạn muốn tạo,
          AI sẽ tạo ra các trường dữ liệu tương ứng.</Typography>
        <TextField fullWidth multiline rows={3} variant="outlined" label="Mô tả form..." value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)} disabled={isGenerating} />{aiError && <Alert severity="error" sx={{ mt: 2 }}>{aiError}</Alert>}</DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleGenerate} variant="contained" disabled={isGenerating} startIcon={isGenerating ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}>{isGenerating ? 'Đang tạo...' : 'Tạo Form'}</Button>
      </DialogActions>
    </Dialog>);
  };
const FieldConfigDialog: FC<{
  open: boolean,
  onClose: () => void,
  onSave: (config: FieldConfig) => void,
  existingFieldConfig: FieldConfig | null,
  allFields: {
    id: string,
    label: string
  }[]
}> = ({ open,
  onClose,
  onSave,
  existingFieldConfig,
  allFields }) => {
    const [config, setConfig] = useState<Partial<FieldConfig>>({ validation: {} });
    const [staticOptions, setStaticOptions] = useState<FieldOption[]>([{
      value: '',
      label: ''
    }]);
    useEffect(() => {
      if (open && existingFieldConfig) {
        const initialConfig = JSON.parse(JSON.stringify(existingFieldConfig));
        if (!initialConfig.validation) initialConfig.validation = {};
        if (!initialConfig.config) initialConfig.config = {};
        if (!initialConfig.config.onValueChange) initialConfig.config.onValueChange = [];
        setConfig(initialConfig);
        if (initialConfig.config?.options) {
          setStaticOptions(initialConfig.config.options);
        } else {
          setStaticOptions([{
            value: '',
            label: ''
          }]);
        }
      }
    },
      [open,
        existingFieldConfig]);
    const handleMainChange = (e: any) => {
      const { name,
        value,
        type } = e.target;
      setConfig(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    };
    const handleValidationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name,
        value,
        type,
        checked } = e.target;
      setConfig(prev => {
        const newValidation = { ...(prev.validation || {}) };
        if (type === 'checkbox') {
          debugger
          //newValidation[name as keyof FieldValidation] = checked;
        } else {
          (newValidation as any)[name] = value === '' ? undefined : value;
        } return {
          ...prev,
          validation: newValidation
        };
      });
    };
    const handleSubConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name,
        value } = e.target;
      setConfig(prev => ({
        ...prev,
        config: {
          ...prev.config,
          [name]: value
        }
      }));
    };
    const handleOptionChange = (index: number,
      e: React.ChangeEvent<HTMLInputElement>) => {
      const { name,
        value } = e.target;
      const newOptions = [...staticOptions];
      (newOptions[index] as any)[name] = value;
      setStaticOptions(newOptions);
    };
    const addOption = () => setStaticOptions([...staticOptions,
    {
      value: '',
      label: ''
    }]);
    const removeOption = (index: number) => setStaticOptions(staticOptions.filter((_,
      i) => i !== index));
    const handleSave = () => {
      let finalConfig = { ...config };
      if (['radio',
        'select'].includes(config.type!) && !config.config?.url) {
        finalConfig.config = {
          ...finalConfig.config,
          options: staticOptions.filter(opt => opt.value && opt.label)
        };
      }
      onSave(finalConfig as FieldConfig);

      onClose();
    };
    const handleActionChange = (index: number,
      e: any) => {
      const { name,
        value } = e.target;
      const newActions = [...(config.config?.onValueChange || [])];
      (newActions[index] as any)[name] = value;
      setConfig(prev => ({
        ...prev,
        config: {
          ...prev.config,
          onValueChange: newActions
        }
      }));
    };
    const addAction = () => {
      const newActions: FieldAction[] = [
        ...(config.config?.onValueChange || []),
        {
          action: 'FETCH_AND_UPDATE',
          targetField: '',
          apiUrl: '',
        }
      ];
      setConfig(prev => ({
        ...prev,
        config: {
          ...prev.config,
          onValueChange: newActions
        }
      }));
    };
    const removeAction = (index: number) => {
      const newActions = (config.config?.onValueChange || []).filter((_,
        i) => i !== index);
      setConfig(prev => ({
        ...prev,
        config: {
          ...prev.config,
          onValueChange: newActions
        }
      }));
    };
    if (!open) return null;
    return (<Dialog open={open}
      onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chỉnh sửa chi tiết trường</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pt: 2
        }}>
          <TextField name="label" label="Nhãn (Label)" value={config.label || ''}
            onChange={handleMainChange} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Loại trường</InputLabel>
            <Select name="type" value={config.type || 'text'} label="Loại trường"
              onChange={handleMainChange}>
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="datetime-local">Date & Time</MenuItem>
              <MenuItem value="color">Color</MenuItem>
              <MenuItem value="radio">Radio</MenuItem>
              <MenuItem value="select">Select</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Độ rộng</InputLabel>
            <Select name="grid" value={config.grid || 12} label="Độ rộng"
              onChange={handleMainChange}>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={12}>12</MenuItem>
            </Select>
          </FormControl>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle1" gutterBottom>Quy tắc xác thực (Validation)</Typography>
          <FormControlLabel control={<Checkbox name="required" checked={config.validation?.required || false}
            onChange={handleValidationChange} />} label="Bắt buộc (Required)" />{config.type === 'text' && (<>
              <TextField type="number" name="minLength" label="Độ dài tối thiểu" value={config.validation?.minLength || ''}
                onChange={handleValidationChange} fullWidth margin="dense" />
              <TextField type="number" name="maxLength" label="Độ dài tối đa" value={config.validation?.maxLength || ''}
                onChange={handleValidationChange} fullWidth margin="dense" />
              <TextField name="pattern" label="Mẫu Regex (vd: ^\\d+$)" value={config.validation?.pattern || ''}
                onChange={handleValidationChange} fullWidth margin="dense" />
            </>)}{config.type === 'number' && (<>
              <TextField type="number" name="minValue" label="Giá trị tối thiểu" value={config.validation?.minValue || ''}
                onChange={handleValidationChange} fullWidth margin="dense" />
              <TextField type="number" name="maxValue" label="Giá trị tối đa" value={config.validation?.maxValue || ''}
                onChange={handleValidationChange} fullWidth margin="dense" />
            </>)}{(config.type === 'radio' || config.type === 'select') && (<>
              <Divider sx={{ my: 1 }} />
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Cấu hình lựa chọn</Typography>{staticOptions.map((opt,
                  index) => (<Box key={index} sx={{
                    display: 'flex',
                    gap: 1,
                    mb: 1,
                    alignItems: 'center'
                  }}>
                    <TextField size="small" name="value" label="Value" value={opt.value}
                      onChange={(e) => handleOptionChange(index,
                        e as any)} />
                    <TextField size="small" name="label" label="Label" value={opt.label}
                      onChange={(e) => handleOptionChange(index,
                        e as any)} sx={{ flexGrow: 1 }} />
                    <IconButton
                      onClick={() => removeOption(index)} color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>))}<Button
                    onClick={addOption} size="small">Thêm lựa chọn</Button>
              </Paper>
            </>)}{config.type === 'select' && (<Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Hoặc tải từ API</Typography>
              <TextField name="url" label="URL API (vd: /api/provinces)" value={config.config?.url || ''}
                onChange={handleSubConfigChange} fullWidth margin="dense" helperText="Để trống nếu dùng lựa chọn tĩnh ở trên" />
              <TextField name="valueField" label="Trường cho Value (vd: id)" value={config.config?.valueField || ''}
                onChange={handleSubConfigChange} fullWidth margin="dense" />
              <TextField name="labelField" label="Trường cho Label (vd: name)" value={config.config?.labelField || ''}
                onChange={handleSubConfigChange} fullWidth margin="dense" />
              <FormControl fullWidth margin="dense">
                <InputLabel>Phụ thuộc vào trường</InputLabel>
                <Select name="dependsOn" value={config.dependsOn || ''} label="Phụ thuộc vào trường"
                  onChange={handleMainChange as any}>
                  <MenuItem value="">
                    <em>Không phụ thuộc</em>
                  </MenuItem>{allFields.filter(f => f.id !== config.id).map(f => <MenuItem key={f.id} value={f.id}>{f.label} ({f.id})</MenuItem>)}</Select>
              </FormControl>
            </Paper>)}{(config.type === 'date' || config.type === 'datetime-local') && (<>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" gutterBottom>Giá trị Mặc định</Typography>
              <TextField name="defaultValue" label="Biểu thức giá trị mặc định" value={config.config?.defaultValue || ''}
                onChange={handleSubConfigChange} fullWidth margin="dense" helperText="Dùng 'now',
'now-10d' (10 ngày trước),
'now+2h' (2 giờ sau)." />
            </>)}<Divider sx={{ my: 1 }} />
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Hành động khi thay đổi giá trị</Typography>{(config.config?.onValueChange || []).map((action,
              index) => (<Box key={index} sx={{
                display: 'flex',
                gap: 1,
                mb: 1,
                alignItems: 'center',
                border: '1px solid #ddd',
                p: 1,
                borderRadius: 1
              }}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Trường mục tiêu</InputLabel>
                  <Select name="targetField" value={action.targetField} label="Trường mục tiêu"
                    onChange={(e) => handleActionChange(index,
                      e)}>
                    <MenuItem value="">
                      <em>Chọn trường</em>
                    </MenuItem>{allFields.filter(f => f.id !== config.id).map(f => <MenuItem key={f.id} value={f.id}>{f.label} ({f.id})</MenuItem>)}</Select>
                </FormControl>
                <TextField name="apiUrl" label="API URL" value={action.apiUrl}
                  onChange={(e) => handleActionChange(index,
                    e)} fullWidth margin="dense" helperText="Dùng {value} làm placeholder" />
                <IconButton
                  onClick={() => removeAction(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>))}<Button
                onClick={addAction} size="small">Thêm hành động</Button>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleSave} variant="contained">Lưu</Button>
      </DialogActions>
    </Dialog>);
  };
const TableConfigDialog: FC<{
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
                  onClick={() => handleMoveColumn(index,
                    'up')} disabled={index === 0}>
                  <ArrowUpwardIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleMoveColumn(index,
                    'down')} disabled={index === (config.columns || []).length - 1}>
                  <ArrowDownwardIcon />
                </IconButton>
                <IconButton
                  onClick={() => removeColumn(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid sx={{ xs: 6 }} >
                  <TextField label="Giá trị Mặc định" value={col.defaultValue || ''}
                    onChange={(e) => handleColumnChange(index,
                      'defaultValue',
                      e.target.value)} fullWidth margin="dense" helperText="Dùng giá trị tĩnh hoặc công thức,
vd: {so_luong}*{don_gia}" />
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
                              <DeleteIcon />
                            </IconButton>
                          </Box>))}<Button
                            onClick={() => addColumnOption(index)} size="small">Thêm lựa chọn</Button>
                  </Box>)}</Paper>))}<Button
                    onClick={addColumn} startIcon={<AddIcon />}>Thêm cột</Button>
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
const TabConfigDialog: FC<{
  open: boolean,
  onClose: () => void,
  onSave: (newLabel: string) => void,
  currentLabel: string
}> = ({ open,
  onClose,
  onSave,
  currentLabel }) => {
    const [label,
      setLabel] = useState('');
    useEffect(() => {
      if (open) {
        setLabel(currentLabel);
      }
    },
      [open,
        currentLabel]);
    const handleSave = () => {

      onSave(label);

      onClose();
    };
    return (<Dialog open={open}
      onClose={onClose}>
      <DialogTitle>Chỉnh sửa tiêu đề Tab</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" label="Tiêu đề Tab" type="text" fullWidth variant="standard" value={label}
          onChange={(e) => setLabel(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleSave}>Lưu</Button>
      </DialogActions>
    </Dialog>);
  };
const StepConfigDialog: FC<{
  open: boolean,
  onClose: () => void,
  onSave: (newConfig: {
    label: string,
    onNextAction: string
  }) => void,
  currentLabel: string,
  currentAction: string,
  availableActions: string[]
}> = ({ open,
  onClose,
  onSave,
  currentLabel,
  currentAction,
  availableActions }) => {
    const [label,
      setLabel] = useState('');
    const [action,
      setAction] = useState('');
    useEffect(() => {
      if (open) {
        setLabel(currentLabel);
        setAction(currentAction);
      }
    },
      [open,
        currentLabel,
        currentAction]);
    const handleSave = () => {

      onSave({
        label,
        onNextAction: action
      });

      onClose();
    };
    return (<Dialog open={open}
      onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Chỉnh sửa Bước</DialogTitle>
      <DialogContent sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        pt: '16px !important'
      }}>
        <TextField label="Tiêu đề Bước" value={label}
          onChange={(e) => setLabel(e.target.value)} />
        <FormControl fullWidth>
          <InputLabel>Hành động khi "Tiếp theo"</InputLabel>
          <Select value={action} label='Hành động khi "Tiếp theo"'
            onChange={(e) => setAction(e.target.value)}>
            <MenuItem value="">
              <em>Không có</em>
            </MenuItem>{availableActions.map(act => (<MenuItem key={act} value={act}>{act}</MenuItem>))}</Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleSave}>Lưu</Button>
      </DialogActions>
    </Dialog>);
  };
const ModalButtonConfigDialog: FC<{
  open: boolean,
  onClose: () => void,
  onSave: (newConfig: Partial<ModalFormConfig>) => void,
  existingConfig: ModalFormConfig | null,
  availableTables: {
    id: string,
    label: string
  }[]
}> = ({ open,
  onClose,
  onSave,
  existingConfig,
  availableTables }) => {
    const [config,
      setConfig] = useState<Partial<ModalFormConfig>>({});
    useEffect(() => {
      if (open && existingConfig) {
        setConfig({
          buttonLabel: existingConfig.buttonLabel,
          dialogTitle: existingConfig.dialogTitle,
          onSubmitAction: existingConfig.onSubmitAction,
          onSubmitTarget: existingConfig.onSubmitTarget
        });
      } else {
        setConfig({});
      }
    },
      [open,
        existingConfig]);
    const handleSave = () => {

      onSave(config);

      onClose();
    };
    const handleChange = (e: any) => {
      const { name,
        value } = e.target;
      setConfig(prev => ({
        ...prev,
        [name]: value
      }));
    };
    return (<Dialog open={open}
      onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chỉnh sửa Nút Mở Form</DialogTitle>
      <DialogContent sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        pt: '16px !important'
      }}>
        <TextField name="buttonLabel" label="Tiêu đề Nút" value={config.buttonLabel || ''}
          onChange={handleChange} />
        <TextField name="dialogTitle" label="Tiêu đề Form" value={config.dialogTitle || ''}
          onChange={handleChange} />
        <Divider />
        <Typography>Hành động sau khi Lưu</Typography>
        <FormControl fullWidth>
          <InputLabel>Hành động</InputLabel>
          <Select name="onSubmitAction" value={config.onSubmitAction || ''} label="Hành động"
            onChange={handleChange}>
            <MenuItem value="">
              <em>Không có</em>
            </MenuItem>
            <MenuItem value="ADD_TO_TABLE">Thêm vào Bảng</MenuItem>
          </Select>
        </FormControl>{config.onSubmitAction === 'ADD_TO_TABLE' && (<FormControl fullWidth>
          <InputLabel>Bảng mục tiêu</InputLabel>
          <Select name="onSubmitTarget" value={config.onSubmitTarget || ''} label="Bảng mục tiêu"
            onChange={handleChange}>
            <MenuItem value="">
              <em>Chọn bảng</em>
            </MenuItem>{availableTables.map(table => (<MenuItem key={table.id} value={table.id}>{table.label}</MenuItem>))}</Select>
        </FormControl>)}</DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleSave}>Lưu</Button>
      </DialogActions>
    </Dialog>);
  };
const ButtonConfigDialog: FC<{
  open: boolean,
  onClose: () => void,
  onSave: (config: ButtonConfig) => void,
  existingConfig: ButtonConfig | null,
  availableActions: string[]
}> = ({ open,
  onClose,
  onSave,
  existingConfig,
  availableActions }) => {
    const [config,
      setConfig] = useState<Partial<ButtonConfig>>({});
    useEffect(() => {
      if (open && existingConfig) {
        setConfig(JSON.parse(JSON.stringify(existingConfig)));
      } else if (open) {
        setConfig({
          label: 'Nút Mới',
          grid: 3,
          config: {
            variant: 'contained',
            color: 'primary'
          }
        });
      }
    },
      [open,
        existingConfig]);
    const handleSave = () => {

      onSave(config as ButtonConfig);

      onClose();
    };
    const handleChange = (e: any) => {
      const { name,
        value } = e.target;
      setConfig(prev => ({
        ...prev,
        [name]: value
      }));
    };
    const handleConfigChange = (e: SelectChangeEvent<any>) => {
      const { name,
        value } = e.target;
      setConfig(prev => ({
        ...prev,
        config: {
          ...prev.config,
          [name]: value
        }
      }));
    };
    if (!open) return null;
    return (<Dialog open={open}
      onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Chỉnh sửa Nút Hành động</DialogTitle>
      <DialogContent sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        pt: '16px !important'
      }}>
        <TextField name="label" label="Tiêu đề nút" value={config.label || ''}
          onChange={handleChange} />
        <FormControl fullWidth>
          <InputLabel>Hành động khi Click</InputLabel>
          <Select name="onClickAction" value={config.config?.onClickAction || ''} label="Hành động khi Click"
            onChange={handleConfigChange}>
            <MenuItem value="">
              <em>Không có</em>
            </MenuItem>{availableActions.map(action => (<MenuItem key={action} value={action}>{action}</MenuItem>))}</Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Kiểu nút (Variant)</InputLabel>
          <Select name="variant" value={config.config?.variant || 'contained'} label="Kiểu nút (Variant)"
            onChange={handleConfigChange}>
            <MenuItem value="contained">Contained</MenuItem>
            <MenuItem value="outlined">Outlined</MenuItem>
            <MenuItem value="text">Text</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Màu sắc</InputLabel>
          <Select name="color" value={config.config?.color || 'primary'} label="Màu sắc"
            onChange={handleConfigChange}>
            <MenuItem value="primary">Primary</MenuItem>
            <MenuItem value="secondary">Secondary</MenuItem>
            <MenuItem value="success">Success</MenuItem>
            <MenuItem value="error">Error</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleSave}>Lưu</Button>
      </DialogActions>
    </Dialog>);
  };

// --- COMPONENT CHÍNH ---
export default function App() {
  const [layout,
    setLayout] = useState<LayoutItem[]>([]);
  const [formData,
    setFormData] = useState<DynFormData>({});
  const [errors,
    setErrors] = useState<Errors>({});
  const [isAddComponentOpen,
    setAddComponentOpen] = useState(false);
  const [addComponentContext,
    setAddComponentContext] = useState<AddComponentContext | null>(null);
  const [isAiDialogOpen,
    setAiDialogOpen] = useState(false);
  const [isConfigOpen,
    setConfigOpen] = useState(false);
  const [isTableConfigOpen,
    setTableConfigOpen] = useState(false);
  const [isTabConfigOpen,
    setTabConfigOpen] = useState(false);
  const [isStepConfigOpen,
    setStepConfigOpen] = useState(false);
  const [isModalButtonConfigOpen,
    setModalButtonConfigOpen] = useState(false);
  const [isButtonConfigOpen,
    setButtonConfigOpen] = useState(false);
  const [editingItemId,
    setEditingItemId] = useState<string | null>(null);
  const [editingTabInfo,
    setEditingTabInfo] = useState<{
      componentId: string;
      tabId: string;
      currentLabel: string
    } | null>(null);
  const [editingStepInfo,
    setEditingStepInfo] = useState<{
      componentId: string;
      stepId: string;
      currentLabel: string,
      currentAction: string
    } | null>(null);
  const [allFieldsFlat,
    setAllFieldsFlat] = useState<{
      id: string,
      label: string
    }[]>([]);
  const [allTables,
    setAllTables] = useState<{
      id: string,
      label: string
    }[]>([]);
  const [isSaving,
    setIsSaving] = useState(false);
  const [toast,
    setToast] = useState({
      open: false,
      message: '',
      severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

  const actionRegistry: {
    [key: string]: (formData: DynFormData,
      setFormData: React.Dispatch<React.SetStateAction<DynFormData>>,
      setErrors: React.Dispatch<React.SetStateAction<Errors>>) => Promise<void>
  } = {
    VALIDATE_FORM: async (currentData,
      _,
      setErr) => {
      console.log("Validating form with data:",
        currentData);
      const newErrors: Errors = {};
      if (!currentData.customer_name) {
        newErrors.customer_name = "Tên khách hàng là bắt buộc!";
      }
      setErr(newErrors);
      if (Object.keys(newErrors).length === 0) {
        setToast({
          open: true,
          message: 'Form hợp lệ!',
          severity: 'success'
        });
      } else {
        setToast({
          open: true,
          message: 'Form có lỗi,vui lòng kiểm tra lại!', severity: 'error'
        });
      }
    },
    VALIDATE_STEP_API: async () => {
      await mockApi.validateStepData();
    },
    CALL_MOCK_API: async (currentData,
      setFd,
      __) => {
      setToast({
        open: true,
        message: 'Đang gọi API...',
        severity: 'info'
      });
      const sn = await mockApi.getSerialNumber();
      setFd(prev => ({
        ...prev,
        serial_number: sn
      }));
      setToast({
        open: true,
        message: `Lấy số SN mới thành công: ${sn}`,
        severity: 'success'
      });
    }
  };

  const validateStepFields = (itemsToValidate: LayoutItem[]): Errors => {
    const stepErrors: Errors = {};
    const fieldConfigs = itemsToValidate.filter((i): i is FieldLayoutItem => i.type === 'field').map(i => i.config);

    fieldConfigs.forEach(fieldConfig => {
      const value = formData[fieldConfig.id];
      const validationRules = fieldConfig.validation || {};
      let hasError = false;

      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldConfig.id];
        return newErrors;
      });

      if (validationRules.required && (value === undefined || value === null || value === '')) {
        stepErrors[fieldConfig.id] = 'Trường này là bắt buộc.';
        hasError = true;
      }
      if (value && !hasError) {
        if (validationRules.minLength && String(value).length < validationRules.minLength) {
          stepErrors[fieldConfig.id] = `Phải có ít nhất ${validationRules.minLength} ký tự.`;
        }
        if (validationRules.maxLength && String(value).length > validationRules.maxLength) {
          stepErrors[fieldConfig.id] = `Không được vượt quá ${validationRules.maxLength} ký tự.`;
        }
        if (validationRules.minValue !== undefined && Number(value) < validationRules.minValue) {
          stepErrors[fieldConfig.id] = `Giá trị phải lớn hơn hoặc bằng ${validationRules.minValue}.`;
        }
        if (validationRules.maxValue !== undefined && Number(value) > validationRules.maxValue) {
          stepErrors[fieldConfig.id] = `Giá trị phải nhỏ hơn hoặc bằng ${validationRules.maxValue}.`;
        }
        if (validationRules.pattern) {
          try {
            const regex = new RegExp(validationRules.pattern);
            if (!regex.test(String(value))) {
              stepErrors[fieldConfig.id] = `Giá trị không khớp với định dạng yêu cầu.`;
            }
          } catch (e) {
            console.error("Invalid regex pattern:",
              validationRules.pattern);
          }
        }
      }
    });

    if (Object.keys(stepErrors).length > 0) {
      setErrors(prev => ({
        ...prev,
        ...stepErrors
      }));
    }
    return stepErrors;
  };

  const loadInitialConfiguration = useCallback(async () => {
    try {
      const savedLayout = await mockApi.getFormConfiguration(1);
      if (savedLayout && savedLayout.length > 0) {
        setLayout(savedLayout);
      } else {
        const demoLayout: LayoutItem[] = [
          {
            id: 'invoice_details',
            type: 'table',
            config: {
              id: 'invoice_details',
              label: 'Hóa đơn chi tiết (với công thức)',
              columns: [
                {
                  id: 'item_name',
                  label: 'Tên mặt hàng',
                  type: 'text',
                  visible: true
                },
                {
                  id: 'quantity',
                  label: 'Số lượng',
                  type: 'number',
                  visible: true,
                  defaultValue: '1'
                },
                {
                  id: 'unit_price',
                  label: 'Đơn giá',
                  type: 'currency',
                  visible: true,
                  defaultValue: '0'
                },
                {
                  id: 'total',
                  label: 'Thành tiền',
                  type: 'currency',
                  visible: true,
                  defaultValue: '{quantity}*{unit_price}'
                },
                {
                  id: 'notes',
                  label: 'Ghi chú',
                  type: 'text',
                  visible: false,
                  defaultValue: 'Hàng bán'
                },
              ]
            }
          },
        ];
        setLayout(demoLayout);
      }
    } catch (error) {
      console.error("Failed to load configuration:",
        error);
      setToast({
        open: true,
        message: 'Không thể tải cấu hình.',
        severity: 'error'
      });
    }
  },
    []);

  useEffect(() => {
    const processDefaultValues = (items: LayoutItem[],
      initialData: DynFormData): DynFormData => {
      let data = { ...initialData };
      items.forEach(item => {
        if (item.type === 'field') {
          const { id,
            type,
            config } = item.config;
          if ((type === 'date' || type === 'datetime-local') && config?.defaultValue && data[id] === undefined) {
            const val = parseDateExpression(config.defaultValue,
              type);
            if (val) data[id] = val;
          }
        } else if (item.type === 'tabs') {
          item.config.tabs.forEach(tab => {
            data = processDefaultValues(tab.items,
              data);
          });
        } else if (item.type === 'stepper') {
          item.config.steps.forEach(step => {
            data = processDefaultValues(step.items,
              data);
          });
        } else if (item.type === 'modal-button') {
          data = processDefaultValues(item.config.layout,
            data);
        }
      });
      return data;
    };

    let initialFormData: DynFormData = {};
    layout.forEach(item => {
      if (item.type === 'table') {
        initialFormData[item.config.id] = [];
      }
    });
    initialFormData = processDefaultValues(layout,
      initialFormData);
    setFormData(initialFormData);

  },
    [layout]);

  useEffect(() => {
    loadInitialConfiguration();
  },
    [loadInitialConfiguration]);

  useEffect(() => {
    const flattenLayout = (items: LayoutItem[]): {
      fields: {
        id: string,
        label: string
      }[],
      tables: {
        id: string,
        label: string
      }[]
    } => {
      let fields: {
        id: string,
        label: string
      }[] = [];
      let tables: {
        id: string,
        label: string
      }[] = [];
      for (const item of items) {
        if (item.type === 'field') fields.push({
          id: item.config.id,
          label: item.config.label
        });
        else if (item.type === 'table') tables.push({
          id: item.config.id,
          label: item.config.label
        });
        else if (item.type === 'tabs') {
          const nested = item.config.tabs.map(tab => flattenLayout(tab.items));
          nested.forEach(n => {
            fields = fields.concat(n.fields);
            tables = tables.concat(n.tables);
          })
        }
        else if (item.type === 'stepper') {
          const nested = item.config.steps.map(step => flattenLayout(step.items));
          nested.forEach(n => {
            fields = fields.concat(n.fields);
            tables = tables.concat(n.tables);
          })
        }
      }
      return {
        fields,
        tables
      };
    };
    const { fields,
      tables } = flattenLayout(layout);
    setAllFieldsFlat(fields);
    setAllTables(tables);
  },
    [layout]);

  const findItemConfig = (items: LayoutItem[],
    id: string | null): LayoutItemConfig | null => {
    if (!id) return null;
    for (const item of items) {
      if (item.id === id) return item.config;
      if (item.type === 'tabs') {
        for (const tab of item.config.tabs) {
          const found = findItemConfig(tab.items,
            id);
          if (found) return found;
        }
      } if (item.type === 'stepper') {
        for (const step of item.config.steps) {
          const found = findItemConfig(step.items,
            id);
          if (found) return found;
        }
      } if (item.type === 'modal-button') {
        const found = findItemConfig(item.config.layout,
          id);
        if (found) return found;
      }
    } return null;
  };
  const findLayoutItem = (items: LayoutItem[],
    id: string): LayoutItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.type === 'tabs') {
        for (const tab of item.config.tabs) {
          const found = findLayoutItem(tab.items,
            id);
          if (found) return found;
        }
      } if (item.type === 'stepper') {
        for (const step of item.config.steps) {
          const found = findLayoutItem(step.items,
            id);
          if (found) return found;
        }
      } if (item.type === 'modal-button') {
        const found = findLayoutItem(item.config.layout,
          id);
        if (found) return found;
      }
    } return null;
  };
  const handleFieldChangeAndActions = (fieldId: string,
    value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }

    const fieldLayoutItem = findLayoutItem(layout,
      fieldId) as FieldLayoutItem | null;

    if (!fieldLayoutItem || !fieldLayoutItem.config.config?.onValueChange) {
      return;
    }

    fieldLayoutItem.config.config.onValueChange.forEach(action => {
      if (action.action === 'FETCH_AND_UPDATE') {
        if (!value) {
          const updates: DynFormData = {};
          action.targets && action.targets.forEach(target => {
            updates[target.destinationField] = '';
          });
          setFormData(prev => ({
            ...prev,
            ...updates
          }));
          return;
        }
        const apiUrl = action.apiUrl.replace('{value}',
          encodeURIComponent(value));

        const executeApiCall = async () => {
          try {
            let responseData: any;
            if (apiUrl.startsWith('/api/customer/')) {
              const customerId = apiUrl.split('/').pop();
              if (customerId) {
                responseData = await mockApi.getCustomerById(customerId);
              }
            } else {
              console.warn(`API call for ${apiUrl} is not mocked.`);
              return;
            }

            if (responseData) {
              const updates: DynFormData = {};
              action.targets && action.targets.forEach(target => {
                const sourceValue = target.sourceKey === '.' ? responseData : responseData[target.sourceKey];
                if (sourceValue !== undefined) {
                  updates[target.destinationField] = sourceValue;
                }
              });
              setFormData(prev => ({
                ...prev,
                ...updates
              }));
            }
          } catch (err) {
            console.error(`Action failed for API call to ${apiUrl}`,
              err);
            setToast({
              open: true,
              message: 'Lỗi khi tải dữ liệu động.',
              severity: 'error'
            });
          }
        };

        executeApiCall();
      }
    });
  };
  const handleTableChange = (tableId: string,
    data: any[]) => setFormData(prev => ({
      ...prev,
      [tableId]: data
    }));
  const addComponent = (type: LayoutItem['type']) => {
    if (!addComponentContext) return;

    const { parentId,
      parentType,
      tabIndex,
      stepIndex } = addComponentContext;
    let newComponent: LayoutItem;
    const id = `${type}_${Date.now()}`;

    switch (type) {
      case 'field': newComponent = {
        id,
        type: 'field',
        config: {
          id,
          type: 'text',
          label: 'Trường mới',
          grid: 12,
          validation: { required: false },
          config: {}
        }
      };
        break;
      case 'table': newComponent = {
        id,
        type: 'table',
        config: {
          id,
          label: 'Bảng mới',
          columns: [{
            id: 'col1',
            label: 'Cột 1',
            type: 'text',
            visible: true
          }]
        }
      };
        setFormData(prev => ({
          ...prev,
          [id]: []
        }));
        break;
      case 'button': newComponent = {
        id,
        type: 'button',
        config: {
          id,
          label: 'Nút hành động',
          grid: 3,
          config: {
            variant: 'contained',
            color: 'primary',
            onClickAction: ''
          }
        }
      };
        break;
      case 'tabs': newComponent = {
        id,
        type: 'tabs',
        config: {
          tabs: [{
            id: `tab_${Date.now()}`,
            label: 'Tab 1',
            items: []
          }]
        }
      };
        break;
      case 'stepper': newComponent = {
        id,
        type: 'stepper',
        config: {
          steps: [{
            id: `step_${Date.now()}`,
            label: 'Bước 1',
            items: []
          }]
        }
      };
        break;
      case 'modal-button': newComponent = {
        id,
        type: 'modal-button',
        config: {
          buttonLabel: 'Mở Form',
          dialogTitle: 'Form trong Dialog',
          layout: [{
            id: `modal_field_${Date.now()}`,
            type: 'field',
            config: {
              id: `modal_field_${Date.now()}`,
              type: 'text',
              label: 'Dữ liệu mới',
              grid: 12,
              validation: { required: true }
            }
          }]
        }
      };
        break;
      default: return;
    }

    if (parentType === 'root') {
      setLayout(prev => [...prev, newComponent]);
    } else {
      setLayout(prevLayout => {
        const newLayout = JSON.parse(JSON.stringify(prevLayout));
        const parentComponent = findLayoutItem(newLayout,
          parentId);
        if (parentComponent) {
          if (parentComponent.type === 'tabs' && tabIndex !== undefined) {
            parentComponent.config.tabs[tabIndex].items.push(newComponent);
          } else if (parentComponent.type === 'stepper' && stepIndex !== undefined) {
            parentComponent.config.steps[stepIndex].items.push(newComponent);
          }
        }
        return newLayout;
      });
    }
    setAddComponentOpen(false);
    setAddComponentContext(null);
  };
  const handleAiGenerate = (generatedItems: LayoutItem[]) => {
    setLayout(generatedItems);
    setFormData({});
  };
  const findAndModifyLayout = (items: LayoutItem[],
    id: string,
    callback: (item: LayoutItem) => LayoutItem | null): LayoutItem[] => items.map(item => {
      if (item.id === id) return callback(item);
      if (item.type === 'tabs') {
        const newTabs = item.config.tabs.map(tab => ({
          ...tab,
          items: findAndModifyLayout(tab.items,
            id,
            callback)
        }));
        return {
          ...item,
          config: {
            ...item.config,
            tabs: newTabs
          }
        };
      } if (item.type === 'stepper') {
        const newSteps = item.config.steps.map(step => ({
          ...step,
          items: findAndModifyLayout(step.items,
            id,
            callback)
        }));
        return {
          ...item,
          config: {
            ...item.config,
            steps: newSteps
          }
        };
      } if (item.type === 'modal-button') {
        const newLayout = findAndModifyLayout(item.config.layout,
          id,
          callback);
        return {
          ...item,
          config: {
            ...item.config,
            layout: newLayout
          }
        };
      } return item;
    }).filter((item): item is LayoutItem => item !== null);
  const handleDeleteItem = (itemIdToDelete: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành phần này?')) {
      setLayout(prevLayout => findAndModifyLayout(prevLayout,
        itemIdToDelete,
        () => null));
      const newFormData = { ...formData };
      delete newFormData[itemIdToDelete];
      setFormData(newFormData);
    }
  };
  const handleOpenConfig = (itemId: string) => {
    setEditingItemId(itemId);
    setConfigOpen(true);
  };
  const handleOpenTableConfig = (itemId: string) => {
    setEditingItemId(itemId);
    setTableConfigOpen(true);
  };
  const handleOpenModalButtonConfig = (itemId: string) => {
    setEditingItemId(itemId);
    setModalButtonConfigOpen(true);
  };
  const handleOpenButtonConfig = (itemId: string) => {
    setEditingItemId(itemId);
    setButtonConfigOpen(true);
  };
  const handleSaveConfig = (updatedConfig: any) => {
    setLayout(prevLayout => findAndModifyLayout(prevLayout,
      editingItemId!,
      (item) => ({
        ...item,
        config: updatedConfig
      })));
    setConfigOpen(false);
    setTableConfigOpen(false);
    setModalButtonConfigOpen(false);
    setButtonConfigOpen(false);
    setEditingItemId(null);
  };
  const handleSaveModalButtonConfig = (updatedConfig: any) => {
    setLayout(prevLayout => findAndModifyLayout(prevLayout,
      editingItemId!,
      (item) => ({
        ...item,
        config: {
          ...(item.config as ModalFormConfig),
          ...updatedConfig
        }
      })));
    setModalButtonConfigOpen(false);
    setEditingItemId(null);
  };
  const handleOpenAddComponentDialog = (context: AddComponentContext) => {
    setAddComponentContext(context);
    setAddComponentOpen(true);
  };
  const addTabToTabsComponent = (tabsComponentId: string) => {
    setLayout(prevLayout => {
      const newLayout = JSON.parse(JSON.stringify(prevLayout));
      const tabsComponent = newLayout.find((c: any): c is TabsLayoutItem => c.id === tabsComponentId);
      if (tabsComponent) tabsComponent.config.tabs.push({
        id: `tab_${Date.now()}`,
        label: `Tab ${tabsComponent.config.tabs.length + 1}`,
        items: []
      });
      return newLayout;
    });
  };
  const addStepToStepperComponent = (stepperComponentId: string) => {
    setLayout(prevLayout => {
      const newLayout = JSON.parse(JSON.stringify(prevLayout));
      const stepperComponent = newLayout.find((c: any): c is StepperLayoutItem => c.id === stepperComponentId);
      if (stepperComponent) stepperComponent.config.steps.push({
        id: `step_${Date.now()}`,
        label: `Bước ${stepperComponent.config.steps.length + 1}`,
        items: []
      });
      return newLayout;
    });
  };

  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    try {
      const response = await mockApi.saveFormConfiguration(1,
        layout);
      setToast({
        open: true,
        message: response.message,
        severity: 'success'
      });
    } catch (error: any) {
      setToast({
        open: true,
        message: error.message || 'Lưu cấu hình thất bại.',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleOpenTabConfig = (componentId: string,
    tabId: string) => {
    const tabsComponent = layout.find(c => c.id === componentId) as TabsLayoutItem | undefined;
    if (tabsComponent) {
      const tab = tabsComponent.config.tabs.find(t => t.id === tabId);
      if (tab) {
        setEditingTabInfo({
          componentId,
          tabId,
          currentLabel: tab.label
        });
        setTabConfigOpen(true);
      }
    }
  };
  const handleSaveTabConfig = (newLabel: string) => {
    if (!editingTabInfo) return;
    const { componentId,
      tabId } = editingTabInfo;
    setLayout(prevLayout => {
      const newLayout = JSON.parse(JSON.stringify(prevLayout));
      const tabsComponent = newLayout.find((c: LayoutItem): c is TabsLayoutItem => c.id === componentId);
      if (tabsComponent) {
        const tabToUpdate = tabsComponent.config.tabs.find((t: TabItem) => t.id === tabId);
        if (tabToUpdate) {
          tabToUpdate.label = newLabel;
        }
      } return newLayout;
    });
    setTabConfigOpen(false);
    setEditingTabInfo(null);
  };
  const handleOpenStepConfig = (componentId: string,
    stepId: string) => {
    const stepperComponent = layout.find(c => c.id === componentId) as StepperLayoutItem | undefined;
    if (stepperComponent) {
      const step = stepperComponent.config.steps.find(s => s.id === stepId);
      if (step) {
        setEditingStepInfo({
          componentId,
          stepId,
          currentLabel: step.label,
          currentAction: step.onNextAction || ''
        });
        setStepConfigOpen(true);
      }
    }
  };
  const handleSaveStepConfig = (newConfig: {
    label: string,
    onNextAction: string
  }) => {
    if (!editingStepInfo) return;
    const { componentId,
      stepId } = editingStepInfo;
    setLayout(prevLayout => {
      const newLayout = JSON.parse(JSON.stringify(prevLayout));
      const stepperComponent = newLayout.find((c: LayoutItem): c is StepperLayoutItem => c.id === componentId);
      if (stepperComponent) {
        const stepToUpdate = stepperComponent.config.steps.find((s: StepItem) => s.id === stepId);
        if (stepToUpdate) {
          stepToUpdate.label = newConfig.label;
          stepToUpdate.onNextAction = newConfig.onNextAction;
        }
      } return newLayout;
    });
    setStepConfigOpen(false);
    setEditingStepInfo(null);
  };
  const handleModalSubmit = (modalData: DynFormData,
    targetId?: string,
    action?: string) => {
    console.log("Modal submitted:",
      {
        modalData,
        targetId,
        action
      });
    if (action === 'ADD_TO_TABLE' && targetId) {
      setFormData(prev => {
        const currentTableData = prev[targetId] || [];
        const newTableData = [...currentTableData,
          modalData];
        return {
          ...prev,
          [targetId]: newTableData
        };
      });
      setToast({
        open: true,
        message: 'Đã thêm dữ liệu vào bảng thành công!',
        severity: 'success'
      });
    }
  };
  const executeAction = async (actionName: string) => {
    const action = actionRegistry[actionName];
    if (action) {
      try {
        await action(formData,
          setFormData,
          setErrors);
      } catch (error: any) {
        console.error(`Action "${actionName}" failed:`,
          error);
        setToast({
          open: true,
          message: error.message || `Hành động "${actionName}" thất bại!`,
          severity: 'error'
        });
        throw error;
        // Re-throw to be caught by the caller (e.g.,StepperComponent)
      }
    } else {
      console.warn(`Action "${actionName}" not found in registry.`);
      setToast({
        open: true,
        message: `Hành động "${actionName}" không tồn tại!`,
        severity: 'warning'
      });
      throw new Error("Action not found");
    }
  };

  const handleMoveItem = (itemId: string,
    direction: 'up' | 'down') => {
    const findAndReorder = (items: LayoutItem[]): LayoutItem[] => {
      const index = items.findIndex(i => i.id === itemId);
      if (index !== -1) {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= items.length) return items;
        const newItems = [...items];
        [newItems[index],
        newItems[newIndex]] = [newItems[newIndex],
        newItems[index]];
        return newItems;
      }

      return items.map(item => {
        if (item.type === 'tabs') {
          const newTabs = item.config.tabs.map(tab => ({
            ...tab,
            items: findAndReorder(tab.items)
          }));
          return {
            ...item,
            config: {
              ...item.config,
              tabs: newTabs
            }
          };
        }
        if (item.type === 'stepper') {
          const newSteps = item.config.steps.map(step => ({
            ...step,
            items: findAndReorder(step.items)
          }));
          return {
            ...item,
            config: {
              ...item.config,
              steps: newSteps
            }
          };
        }
        return item;
      });
    };
    setLayout(prevLayout => findAndReorder(prevLayout));
  };

  const renderLayoutItem = (item: LayoutItem,
    index: number,
    array: LayoutItem[]) => {
    const commonProps = {

      onMoveUp: () => handleMoveItem(item.id,
        'up'),

      onMoveDown: () => handleMoveItem(item.id,
        'down'),
      isFirst: index === 0,
      isLast: index === array.length - 1
    };
    switch (item.type) {
      case 'field': return (<Grid sx={{
        xs: 12,
        sm: item.config.grid
      }} key={item.id}>
        <ConfigurableWrapper type="trường"
          onEdit={() => handleOpenConfig(item.id)}
          onDelete={() => handleDeleteItem(item.id)} {...commonProps}>
          <DynamicField fieldConfig={item.config} formData={formData}
            onFieldChange={handleFieldChangeAndActions} errorText={errors[item.id]} />
        </ConfigurableWrapper>
      </Grid>);
      case 'tabs': return (<Grid sx={{ xs: 12 }} key={item.id}>
        <ConfigurableWrapper type="tab"
          onDelete={() => handleDeleteItem(item.id)} {...commonProps}>
          <TabsComponent componentId={item.id} componentConfig={item.config} formData={formData}
            onFieldChange={handleFieldChangeAndActions}
            onTableChange={handleTableChange}
            onAddTab={addTabToTabsComponent}
            onOpenConfig={handleOpenConfig}
            onDeleteItem={handleDeleteItem}
            onOpenTableConfig={handleOpenTableConfig}
            onOpenTabConfig={handleOpenTabConfig}
            onOpenAddComponentDialog={handleOpenAddComponentDialog} errors={errors}
            onMoveItem={handleMoveItem} />
        </ConfigurableWrapper>
      </Grid>);
      case 'table': return (<Grid sx={{ xs: 12 }} key={item.id}>
        <ConfigurableWrapper type="bảng"
          onEdit={() => handleOpenTableConfig(item.id)}
          onDelete={() => handleDeleteItem(item.id)} {...commonProps}>
          <DynamicTableComponent tableConfig={item.config} tableData={formData[item.id] || []}
            onTableChange={handleTableChange} />
        </ConfigurableWrapper>
      </Grid>);
      case 'stepper': return (<Grid sx={{ xs: 12 }} key={item.id}>
        <ConfigurableWrapper type="stepper"
          onDelete={() => handleDeleteItem(item.id)} {...commonProps}>
          <StepperComponent
            componentId={item.id}
            componentConfig={item.config}
            formData={formData}
            onFieldChange={handleFieldChangeAndActions}
            onTableChange={handleTableChange}
            onAddStep={addStepToStepperComponent}
            onOpenConfig={handleOpenConfig}
            onDeleteItem={handleDeleteItem}
            onOpenTableConfig={handleOpenTableConfig} errors={errors}
            onValidateStep={validateStepFields}
            onOpenStepConfig={handleOpenStepConfig}
            onExecuteAction={executeAction}
            onMoveItem={handleMoveItem}
            onOpenAddComponentDialog={handleOpenAddComponentDialog} />
        </ConfigurableWrapper>
      </Grid>);
      case 'modal-button': return (<Grid sx={{ xs: 12 }} key={item.id}>
        <ConfigurableWrapper type="nút modal"
          onEdit={() => handleOpenModalButtonConfig(item.id)}
          onDelete={() => handleDeleteItem(item.id)} {...commonProps}>
          <ModalButtonComponent componentConfig={item.config}
            onModalSubmit={handleModalSubmit} />
        </ConfigurableWrapper>
      </Grid>);
      case 'button': return (<Grid sx={{
        xs: 12,
        sm: item.config.grid || 12
      }} key={item.id}>
        <ConfigurableWrapper type="nút hành động"
          onEdit={() => handleOpenButtonConfig(item.id)}
          onDelete={() => handleDeleteItem(item.id)} {...commonProps}>
          <DynamicButton componentConfig={item.config}
            onAction={executeAction} />
        </ConfigurableWrapper>
      </Grid>);
      default: return null;
    }
  };

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
          <Button variant="contained" startIcon={<AutoAwesomeIcon />}
            onClick={() => setAiDialogOpen(true)}>Tạo bằng AI</Button>
          <Button variant="outlined" startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSaveConfiguration} disabled={isSaving}>{isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}</Button>
          <Button variant="outlined" startIcon={<ReplayIcon />}
            onClick={loadInitialConfiguration}>Tải lại</Button>
        </Box>
        <Paper elevation={2} sx={{
          p: 2,
          mb: 4,
          backgroundColor: 'info.lighter'
        }}>
          <Typography variant="h6" sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <InfoIcon color="info" /> Form Demo với các quy tắc động</Typography>
          <Typography component="div" variant="body2" sx={{ mt: 1 }}>
            <ul>
              <li>
                <b>Bảng Kho Hàng:</b> Tự động tải cấu trúc cột và dữ liệu từ API khi form được hiển thị.</li>
            </ul>
          </Typography>
        </Paper>
        <Typography variant="h5" gutterBottom>Bố cục Form</Typography>
        <Box component="form"
          onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={3}>
            {layout.length === 0 && <Grid sx={{ xs: 12 }}>
              <Typography align="center" color="text.secondary" sx={{ p: 4 }}>Đang tải cấu hình...</Typography>
            </Grid>}
            {layout.map((item,
              index,
              arr) => renderLayoutItem(item,
                index,
                arr))}
            <Grid sx={{ xs: 12 }}>
              <Button fullWidth startIcon={<AddCircleOutlineIcon />}

                onClick={() => handleOpenAddComponentDialog({
                  parentId: 'root',
                  parentType: 'root'
                })}
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
                onClick={() => alert('Dữ liệu form chính:\n' + JSON.stringify(formData,
                  null,
                  2))}>Gửi dữ liệu</Button>
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
          <pre>{JSON.stringify(formData,
            null,
            2)}</pre>
        </Box>
      </Paper>
      <AddComponentDialog open={isAddComponentOpen}
        onClose={() => setAddComponentOpen(false)}
        onSelect={addComponent} context={addComponentContext} />
      <AIFormDialog open={isAiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        onGenerate={handleAiGenerate} />
      <FieldConfigDialog open={isConfigOpen}
        onClose={() => setConfigOpen(false)}
        onSave={handleSaveConfig as any} existingFieldConfig={findItemConfig(layout,
          editingItemId) as FieldConfig | null} allFields={allFieldsFlat} />
      <TableConfigDialog open={isTableConfigOpen}
        onClose={() => setTableConfigOpen(false)}
        onSave={handleSaveConfig as any} existingTableConfig={findItemConfig(layout,
          editingItemId) as TableConfig | null} />
      <TabConfigDialog open={isTabConfigOpen}
        onClose={() => setTabConfigOpen(false)}
        onSave={handleSaveTabConfig} currentLabel={editingTabInfo?.currentLabel || ''} />
      <StepConfigDialog open={isStepConfigOpen}
        onClose={() => setStepConfigOpen(false)}
        onSave={handleSaveStepConfig} currentLabel={editingStepInfo?.currentLabel || ''} currentAction={editingStepInfo?.currentAction || ''} availableActions={Object.keys(actionRegistry)} />
      <ModalButtonConfigDialog open={isModalButtonConfigOpen}
        onClose={() => setModalButtonConfigOpen(false)}
        onSave={handleSaveModalButtonConfig} existingConfig={findItemConfig(layout,
          editingItemId) as ModalFormConfig | null} availableTables={allTables} />
      <ButtonConfigDialog open={isButtonConfigOpen}
        onClose={() => setButtonConfigOpen(false)}
        onSave={handleSaveConfig as any} existingConfig={findItemConfig(layout,
          editingItemId) as ButtonConfig | null} availableActions={Object.keys(actionRegistry)} />
      <Snackbar open={toast.open} autoHideDuration={6000}
        onClose={() => setToast(prev => ({
          ...prev,
          open: false
        }))} anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}>
        <Alert
          onClose={() => setToast(prev => ({
            ...prev,
            open: false
          }))} severity={toast.severity} sx={{ width: '100%' }}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}
