import * as yup from 'yup';
import { FormField, ValidationRule } from './types'; // Giả sử bạn đã có các type này

/**
 * Hàm helper để xây dựng một schema của Yup từ một mảng các quy tắc validation.
 * @param rules - Mảng các đối tượng quy tắc validation từ JSON.
 * @param baseType - Kiểu cơ sở của yup schema (ví dụ: 'string', 'date', 'number').
 * @returns Một schema của Yup đã được xây dựng.
 */
function buildYupSchema(rules: ValidationRule[] | undefined, baseType: string = 'mixed') {
    // Bắt đầu với một schema cơ sở. 'mixed' là an toàn nhất.
    // Bạn có thể mở rộng để truyền 'string', 'date', v.v. nếu cần.
    //@ts-ignore
    let schema: yup.AnySchema = yup[baseType as keyof typeof yup]();

    if (!rules || !Array.isArray(rules) || rules.length === 0) {
        // Nếu không có quy tắc, trả về schema nullable để không bị lỗi
        return schema.nullable();
    }
    rules.forEach(rule => {
        switch (rule.type) {
            case 'required':
                schema = schema.required(rule.message);
                break;
            case 'min':
                // Giả sử schema là string hoặc number
                if ('min' in schema) {
                    schema = (schema as yup.StringSchema | yup.NumberSchema).min(rule.value, rule.message);
                }
                break;
            case 'max':
                if ('max' in schema) {
                    let maxValue = rule.value;
                    // Xử lý trường hợp đặc biệt cho ngày tháng
                    if (rule.value === 'today') {
                        maxValue = new Date();
                    }
                    schema = (schema as yup.StringSchema | yup.NumberSchema | yup.DateSchema).max(maxValue, rule.message);
                }
                break;
            case 'email':
                if ('email' in schema) {
                    schema = (schema as yup.StringSchema).email(rule.message);
                }
                break;
            // Thêm các case khác nếu cần (ví dụ: 'matches' cho regex)
        }
    });

    return schema;
}


/**
 * Hàm chính để "hồi sinh" cấu hình form từ JSON đã được parse.
 * @param configFromJson - Mảng đối tượng được parse từ chuỗi JSON.
 * @returns Một mảng FormField[] hợp lệ với các hàm và yup schema.
 */
export function hydrateFormConfig(configFromJson: any[]): FormField[] {
    return configFromJson.map(field => {
        const hydratedField: Partial<FormField> = { ...field };
        // 1. Hồi sinh validation cơ bản
        if (field.validation) {
            // Xác định kiểu cơ sở cho yup
            const baseType = (field.type === 'date' || field.type === 'time') ? 'date' : 'string';
            hydratedField.validation = buildYupSchema(field.validation, baseType);
        }

        // 2. Hồi sinh các hàm từ chuỗi
        // CẢNH BÁO BẢO MẬT: new Function() có thể rủi ro nếu chuỗi đến từ nguồn không tin cậy.
        // Chỉ sử dụng khi bạn tin tưởng hoàn toàn vào nguồn dữ liệu JSON (ví dụ: từ chính database của bạn).
        if (field.calculatedValue?.calculate) {
            //@ts-ignore
            hydratedField.calculatedValue!.calculate = typeof field.calculatedValue.calculate === 'function' ? field.calculatedValue.calculate
                : new Function('values', field.calculatedValue.calculate);
        }

        if (field.conditionalValidation?.is) {
            //@ts-ignore
            hydratedField.conditionalValidation!.is = typeof field.conditionalValidation.is === 'function' ? field.conditionalValidation.is
                : new Function('value', field.conditionalValidation.is);
        }

        // 3. Hồi sinh validation có điều kiện (then/otherwise)
        if (field.conditionalValidation?.then) {
            const baseType = (field.type === 'date' || field.type === 'time') ? 'date' : 'string';
            hydratedField.conditionalValidation!.then = buildYupSchema(field.conditionalValidation.then, baseType);
        }
        if (field.conditionalValidation?.otherwise) {
            const baseType = (field.type === 'date' || field.type === 'time') ? 'date' : 'string';
            hydratedField.conditionalValidation!.otherwise = buildYupSchema(field.conditionalValidation.otherwise, baseType);
        }

        return hydratedField as FormField;
    });
}