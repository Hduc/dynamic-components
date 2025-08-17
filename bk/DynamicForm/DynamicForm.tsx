// src/components/DynamicForm/DynamicForm.tsx

import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Grid } from '@mui/material';
import FieldRenderer from './FieldRenderer';
import { DynamicFormProps, FormField } from './types';

// Hàm helper để tạo validation schema từ config
const createValidationSchema = (fields: FormField[]) => {
  const shape = fields.reduce((acc, field) => {
    let fieldSchema = field.validation;

    // Xử lý validation có điều kiện
    if (field.conditionalValidation) {
      const { dependentField, is, then, otherwise } = field.conditionalValidation;
      fieldSchema = yup.mixed().when(dependentField, {
        is,
        then: () => then,
        otherwise: () => otherwise || field.validation || yup.mixed(),
      });
    }

    if (fieldSchema) {
      acc[field.name] = fieldSchema;
    }
    return acc;
  }, {} as Record<string, yup.AnySchema>);
  return yup.object().shape(shape);
};

// Component nội bộ để xử lý logic tính toán
const CalculatedFieldLogic = ({ control, setValue, getValues, formConfig }: any) => {
    const calculatedFields = formConfig.filter((f: FormField) => f.calculatedValue);
    
    // Lắng nghe tất cả các trường có thể là nguồn
    const allSourceFields = [...new Set(calculatedFields.flatMap((f: FormField) => f.calculatedValue!.sourceFields))] as string[];
    const watchedValues = useWatch({ control, name: allSourceFields });

    useEffect(() => {
        const sourceValuesMap = allSourceFields.reduce((acc, fieldName, index) => {
            acc[fieldName] = watchedValues[index];
            return acc;
        }, {} as Record<string, any>);

        calculatedFields.forEach((field: FormField) => {
            const { name, calculatedValue } = field;
            if (calculatedValue) {
                const newValue = calculatedValue.calculate(sourceValuesMap);
                const currentValue = getValues(name); // Lấy giá trị hiện tại

                // FIX: Chỉ gọi setValue nếu giá trị thực sự thay đổi để ngắt vòng lặp
                if (newValue !== currentValue) {
                    setValue(name, newValue, { shouldValidate: true });
                }
            }
        });
    // FIX: Sử dụng JSON.stringify để so sánh sâu giá trị của mảng dependency,
    // tránh việc re-run không cần thiết do thay đổi tham chiếu.
    }, [JSON.stringify(watchedValues), calculatedFields, setValue, getValues]);

    return null; // Component này không render gì cả
};


const DynamicForm = React.forwardRef<any, DynamicFormProps>(
  ({ formConfig, initialValues, onSubmit,idForm, isReadOnly = false }, ref) => {
    const validationSchema = createValidationSchema(formConfig);
    
    const {
      control,
      handleSubmit,
      reset,
      setValue,
      getValues, // Lấy hàm getValues từ useForm
      formState: { errors },
    } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: initialValues || {},
      mode: 'onChange'
    });

    React.useImperativeHandle(ref, () => ({
        submit: () => handleSubmit(onSubmit)(),
        reset: (values?: Record<string, any>) => reset(values)
    }));
    
    // Bọc trong thẻ form để nút submit bên ngoài hoạt động
    return (
      <form id={idForm} onSubmit={handleSubmit(onSubmit)}>
        {/* Thêm component logic để xử lý tính toán */}
        <CalculatedFieldLogic
            control={control}
            setValue={setValue}
            getValues={getValues}
            formConfig={formConfig}
        />

        <Grid container rowSpacing={12} columnSpacing={{ xs: 4, sm: 8, md: 12 }} sx={{ padding: 5 }}>
          {formConfig.map((field) => (
            <Grid item xs={12} {...(field.grid || {})} key={field.name}>
              <FieldRenderer
                field={field}
                control={control}
                errors={errors}
                readOnly={isReadOnly}
              />
            </Grid>
          ))}
        </Grid>
      </form>
    );
  }
);

export default DynamicForm;
