import { Autocomplete, CircularProgress, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DynFormData, FieldConfig, FieldOption } from "./types";
import { apiCommonGet } from "src/apis/apiCommon";

interface DynamicFieldProps {
    fieldConfig: FieldConfig;
    formData: DynFormData;
    onFieldChange?: (fieldId: string, value: any) => void;
    errorText?: string;
}

const DynamicField: React.FC<DynamicFieldProps> = ({ fieldConfig, formData, onFieldChange, errorText }) => {
    const [options, setOptions] = useState<FieldOption[]>([]);
    const [loading, setLoading] = useState(false);
    const dependentFieldValue = fieldConfig.dependsOn ? formData[fieldConfig.dependsOn] : null;
    const isDependentAndParentUnselected = fieldConfig.dependsOn && !dependentFieldValue;

    useEffect(() => {
        if (fieldConfig.type !== 'select' || !fieldConfig.config?.url) { setOptions(fieldConfig.config?.options || []); return; }
        if (isDependentAndParentUnselected) { setOptions([]); return; }
        let isActive = true;
        const fetchData = async () => {
            setLoading(true);
            try {
                let data;
                if (fieldConfig?.config?.url && fieldConfig?.config?.url !== '') {
                    const rs = await apiCommonGet(fieldConfig?.config?.url);
                    data = rs.data
                }
                if (isActive && data) setOptions(data);
            } catch (error) { console.error("Lỗi tải dữ liệu cho Select:", error); }
            finally { if (isActive) setLoading(false); }
        };
        fetchData();
        return () => { isActive = false; };
    }, [fieldConfig.type, fieldConfig.config, fieldConfig.dependsOn, dependentFieldValue, isDependentAndParentUnselected]);

    const handleChange = (event: any) => {
        const { value, type, checked } = event.target;
        const finalValue = (type === 'checkbox' && 'checked' in event.target)
            ? checked : value;
        onFieldChange && onFieldChange(fieldConfig.id, finalValue);
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
        case 'text':
        case 'number':
        case 'color':
        case 'datetime-local':
            return <TextField fullWidth type={fieldConfig.type} {...commonProps} />;
        case 'date':
            return <TextField fullWidth type="date" {...commonProps} />;
        case 'radio':
            return (<FormControl component="fieldset" required={fieldConfig.validation?.required}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>{fieldConfig.label}</Typography>
                <RadioGroup row
                    name={fieldConfig.id} value={formData[fieldConfig.id] || ''}
                    onChange={handleChange}>
                    {(fieldConfig.config?.options || []).map(opt =>
                        <FormControlLabel
                            key={opt.value}
                            value={opt.value}
                            control={<Radio />}
                            label={opt.label} />)}
                </RadioGroup>
                {errorText &&
                    <FormHelperText error>
                        {errorText}
                    </FormHelperText>}
            </FormControl>);
        case 'select':
            const selectedValue = formData[fieldConfig.id] || null;
            const valueField = fieldConfig.config?.valueField || 'value';
            const labelFieldConfig = fieldConfig.config?.labelField || 'label';
            const getLabel = (option: any) => {
                if (!option) return '';
                if (labelFieldConfig.includes('{')) {
                    return labelFieldConfig.replace(/{(.*?)}/g, (_, key) => option[key] ?? '');
                }
                return option[labelFieldConfig] ?? '';
            };

            const selectedOption =
                options.find((opt) => opt[valueField] === selectedValue) || null;

            return (
                <Autocomplete
                    options={options}
                    getOptionLabel={getLabel}
                    value={selectedOption}
                    onChange={(event, newValue) => {
                        onFieldChange &&
                            onFieldChange(
                                fieldConfig.id,
                                newValue ? newValue[valueField] : ''
                            );
                    }}
                    loading={loading}
                    disabled={isDependentAndParentUnselected || loading}
                    isOptionEqualToValue={(option, value) =>
                        option[valueField] === value[valueField]
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={fieldConfig.label}
                            required={fieldConfig.validation?.required}
                            error={!!errorText}
                            helperText={
                                errorText || fieldConfig.config?.helperText
                            }
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loading ? (
                                            <CircularProgress
                                                color="inherit"
                                                size={20}
                                            />
                                        ) : null}
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
export default DynamicField