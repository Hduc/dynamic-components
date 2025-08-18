import { Autocomplete, CircularProgress, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { FieldConfig, FieldOption } from "../../types/field";
import { useEffect, useState } from "react";
import { mockApi } from "../../config/mockApi";
import { useDynamicLayout } from "../../hooks/useDynamicLayout";

const DynamicField:React.FC<FieldConfig> = ({ id, label, inputType, config, validation, dependsOn }) => {
    const { formData, errors, handleFieldChangeAndActions } = useDynamicLayout()

    const [options, setOptions] = useState<FieldOption[]>([]);
    const [loading, setLoading] = useState(false);
    const dependentFieldValue = dependsOn ? formData[dependsOn] : null;

    const isDependentAndParentUnselected = !!dependsOn && !dependentFieldValue;
    const errorText = errors[id]

    useEffect(() => {
        if (inputType !== 'select' || !config?.url) {
            setOptions(config?.options || []);
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
                if (config?.url === '/api/customers') data = await mockApi.getCustomers();
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
    }, [inputType, config, dependentFieldValue, isDependentAndParentUnselected]);

    const handleChange = (event: any) => {
        const { value, type } = event.target;
        const finalValue = (type === 'checkbox' && 'checked' in event.target) ? (event.target as HTMLInputElement).checked : value;

        handleFieldChangeAndActions(id, finalValue);
    };

    const commonProps = {
        label: label,
        value: formData[id] || '',

        onChange: handleChange,
        required: validation?.required,
        error: !!errorText,
        helperText: errorText || config?.helperText,
        InputLabelProps: { shrink: true }
    };

    switch (inputType) {
        case 'text':
        case 'number':
        case 'color':
        case 'datetime-local':
            return <TextField fullWidth type={inputType} {...commonProps} />;
        case 'date':
            return <TextField fullWidth type="date" {...commonProps} />;
        case 'radio':
            return (<FormControl component="fieldset"
                required={validation?.required}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>{label}</Typography>
                <RadioGroup row name={id} value={formData[id] || ''}
                    onChange={handleChange}>
                    {(config?.options || []).map((opt: any) => <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />)}
                </RadioGroup>
                {errorText && <FormHelperText error>{errorText}</FormHelperText>}
            </FormControl>);
        case 'select':
            const selectedValue = formData[id] || null;
            const valueField = config?.valueField || 'value';
            const labelField = config?.labelField || 'label';
            const selectedOption = options.find((opt: any) => opt[valueField] === selectedValue) || null;
            return (
                <Autocomplete
                    options={options}
                    getOptionLabel={(option) => option[labelField] || ''}
                    value={selectedOption}
                    onChange={(event, newValue) => { handleFieldChangeAndActions(id, newValue ? newValue[valueField] : ''); }}
                    loading={loading}
                    disabled={isDependentAndParentUnselected || loading}
                    isOptionEqualToValue={(option, value) => option[valueField] === value[valueField]}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            required={validation?.required}
                            error={!!errorText}
                            helperText={errorText || config?.helperText}
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
        default: return <Typography color="error">Loại trường không xác định: {inputType}</Typography>;
    }
};

export default DynamicField