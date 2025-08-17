import { Autocomplete, CircularProgress, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { FieldConfig, FieldOption } from "../../types/field";
import { DynFormData } from '../../types'
import { useEffect, useState } from "react";
import { mockApi } from "../../config/mockApi";

interface DynamicFieldProps {
    fieldConfig: FieldConfig;
    formData: DynFormData;
    onFieldChange: (fieldId: string, value: any) => void;
    errorText?: string;
}

const DynamicField: React.FC<DynamicFieldProps> = ({
    fieldConfig,
    formData,
    onFieldChange,
    errorText
}) => {
    const [options, setOptions] = useState<FieldOption[]>([]);
    const [loading, setLoading] = useState(false);
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
    }, [fieldConfig.type, fieldConfig.config, dependentFieldValue, isDependentAndParentUnselected]);

    const handleChange = (event: any) => {
        const { value, type } = event.target;
        const finalValue = (type === 'checkbox' && 'checked' in event.target) ? (event.target as HTMLInputElement).checked : value;

        onFieldChange(fieldConfig.id, finalValue);
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
            return (<FormControl component="fieldset"
                required={fieldConfig.validation?.required}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>{fieldConfig.label}</Typography>
                <RadioGroup row name={fieldConfig.id} value={formData[fieldConfig.id] || ''}
                    onChange={handleChange}>
                    {(fieldConfig.config?.options || []).map((opt: any) => <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />)}
                </RadioGroup>
                {errorText && <FormHelperText error>{errorText}</FormHelperText>}
            </FormControl>);
        case 'select':
            const selectedValue = formData[fieldConfig.id] || null;
            const valueField = fieldConfig.config?.valueField || 'value';
            const labelField = fieldConfig.config?.labelField || 'label';
            const selectedOption = options.find((opt: any) => opt[valueField] === selectedValue) || null;
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
                    isOptionEqualToValue={(option, value) => option[valueField] === value[valueField]}
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

export default DynamicField