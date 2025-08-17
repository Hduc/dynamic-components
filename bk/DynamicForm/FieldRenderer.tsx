// src/components/DynamicForm/FieldRenderer.tsx

import React from 'react';
import {
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormHelperText,
  InputAdornment,
  IconButton,
  Slider,
  Switch,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Controller } from 'react-hook-form';
import { FieldProps } from './types';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import TableAutocomplete from '../form/TableAutocomplete';

const shouldShrink = (value: any) =>
  value !== undefined && value !== null && value !== '';

const FieldRenderer: React.FC<FieldProps> = ({ field, control, errors, readOnly }) => {
  const {
    name,
    label,
    type,
    placeholder,
    options = [],
    calculatedValue,
    defaultValue,
  } = field;

  const isFieldDisabled = readOnly || field.readOnly || !!calculatedValue;
  const errorMessage = errors[name]?.message as string | undefined;
  const [showPassword, setShowPassword] = React.useState(false);

  const renderTextField = (fieldProps: any, inputType = type) => (
    <TextField
      {...fieldProps}
      label={label}
      type={inputType}
      placeholder={placeholder}
      variant="outlined"
      fullWidth
      disabled={isFieldDisabled}
      error={!!errorMessage}
      helperText={errorMessage}
      InputLabelProps={{
        shrink: shouldShrink(fieldProps.value),
      }}
    />
  );

  switch (type) {
    case 'text':
    case 'color':
    case 'number':
    case 'datetime-local':
    case 'email':
    case 'file':
    case 'hidden':
    case 'image':
    case 'month':
    case 'radio':
    case 'range':
    case 'reset':
    case 'search':
    case 'submit':
    case 'tel':
    case 'time':
    case 'url':
    case 'week':
      return (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: controllerField }) => renderTextField(controllerField)}
        />
      );

    case 'textarea':
      return (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: controllerField }) => (
            <TextField
              {...controllerField}
              label={label}
              placeholder={placeholder}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              disabled={isFieldDisabled}
              error={!!errorMessage}
              helperText={errorMessage}
              InputLabelProps={{
                shrink: shouldShrink(controllerField.value),
              }}
            />
          )}
        />
      );

    case 'password':
      return (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: controllerField }) => (
            <TextField
              {...controllerField}
              label={label}
              placeholder={placeholder}
              variant="outlined"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              disabled={isFieldDisabled}
              error={!!errorMessage}
              helperText={errorMessage}
              InputLabelProps={{
                shrink: shouldShrink(controllerField.value),
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      );

    case 'select':
      return (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: controllerField }) => (
            <TextField
              {...controllerField}
              select
              label={label}
              variant="outlined"
              fullWidth
              disabled={isFieldDisabled}
              error={!!errorMessage}
              helperText={errorMessage}
            >
              <MenuItem value="">
                <em>-- Chọn {label.toLowerCase()} --</em>
              </MenuItem>
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      );

    case 'date':
      return (
        <Controller
          name={name}
          control={control}
          // defaultValue={defaultValue}
          render={({ field: controllerField }) => (
            <DatePicker
              label={label}
              value={controllerField.value || null}
              format="DD/MM/YYYY"
              onChange={controllerField.onChange}
              disabled={isFieldDisabled}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  error: !!errorMessage,
                  helperText: errorMessage,
                },
              }}
            />
          )}
        />
      );

    case 'radio-group':
      return (
        <FormControl component="fieldset" error={!!errorMessage} disabled={isFieldDisabled}>
          <FormLabel component="legend">{label}</FormLabel>
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field: controllerField }) => (
              <RadioGroup {...controllerField} row>
                {options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            )}
          />
          {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
        </FormControl>
      );

    case 'checkbox-group':
      return (
        <FormControl component="fieldset" error={!!errorMessage} disabled={isFieldDisabled}>
          <FormLabel component="legend">{label}</FormLabel>
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field: controllerField }) => (
              <RadioGroup {...controllerField} row>
                {options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Checkbox />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            )}
          />
          {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
        </FormControl>
      );

    case 'switch':
      return (
        <FormControlLabel
          control={
            <Controller
              name={name}
              control={control}
              defaultValue={defaultValue}
              render={({ field: controllerField }) => (
                <Switch {...controllerField} checked={!!controllerField.value} disabled={isFieldDisabled} />
              )}
            />
          }
          label={label}
        />
      );

    case 'slider':
      return (
        <FormControl fullWidth component="fieldset" disabled={isFieldDisabled}>
          <Typography gutterBottom>{label}</Typography>
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({ field: controllerField }) => (
              <Slider {...controllerField} valueLabelDisplay="auto" />
            )}
          />
          {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
        </FormControl>
      );

    case 'currency':
      return (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: controllerField }) => (
            <TextField
              {...controllerField}
              label={label}
              placeholder={placeholder}
              variant="outlined"
              fullWidth
              type="number"
              disabled={isFieldDisabled}
              error={!!errorMessage}
              helperText={errorMessage}
              InputLabelProps={{
                shrink: shouldShrink(controllerField.value),
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">VND</InputAdornment>,
              }}
            />
          )}
        />
      );

    case 'table-autocomplete':
      return (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: controllerField }) => (
            <TableAutocomplete
              {...controllerField}
              data={options}
              searchType={field.searchType}
              columns={field.columns}
              getLabel={field.getLabel}
              
              defaultValue={field.defaultValue}
            />
          )}
        />
      );

    case 'autocomplete':
      return (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field: controllerField }) => (
            <Autocomplete
              {...controllerField}
              options={options}
              onChange={(_, value) => controllerField.onChange(value)}
              value={controllerField.value || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label || ''}
                  variant="outlined"
                  size="small"
                  error={!!errorMessage}
                  helperText={errorMessage}
                />
              )}
            />
          )}
        />
      );

    default:
      return <Typography color="error">Loại control không được hỗ trợ: {type}</Typography>;
  }
};

export default FieldRenderer;
