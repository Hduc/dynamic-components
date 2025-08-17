import { DynFormData } from "./types";

export function calculateFormula(formula: string, data: Partial<any>) {
    if (!formula) return null;

    // Thay thế biến {var} bằng giá trị từ data
    const replaced = formula.replace(/\{(.*?)\}/g, (_, key) => {
        return data[key] ?? 0; // Nếu không có key thì trả về 0
    });

    try {
        // Tính toán công thức
        return Function(`"use strict"; return (${replaced})`)();
    } catch (e) {
        console.error("Lỗi khi tính công thức:", e);
        return null;
    }
}

export const parseDateExpression = (expression: string, type: 'date' | 'datetime-local'): string => {
    const now = new Date();
    const regex = /now\s*([+-])?\s*(\d+)?\s*([dhm])?/;
    const match = expression.toLowerCase().match(regex);

    if (!match) return ''; // Invalid expression

    const operator = match[1];
    const value = parseInt(match[2], 10);
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
        return localDate.toISOString().slice(0, 16);
    }

    return '';
};

export const evaluateExpression = (expression: string, rowContext: DynFormData): string => {
    if (!expression) return '';

    const placeholderRegex = /{(\w+)}/g;

    const replacedExpr = expression.replace(placeholderRegex, (match, key) => {
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
            console.error("Error evaluating math expression:", e);
            return replacedExpr; // Return the expression with numbers if evaluation fails
        }
    }

    return replacedExpr.replace(/0/g, '');
};
 /**
 * Hàm phụ trợ để lấy giá trị từ một đối tượng bằng chuỗi đường dẫn (path)
 * Ví dụ: getValueFromPath(dataObj, 'CaVch02d0Data.typeName')
 */
export function getValueFromPath(object:any, path:string) {
    return path.split('.').reduce((o, k) => (o && o[k] !== 'undefined') ? o[k] : null, object);
}

/**
 * Hàm chính để xử lý các công thức
 */
export function processFormulas(data:any, formulas:any) {
    const results:{[key: string]: any } = {};

    for (const key in formulas) {
        let formula = formulas[key];
        let calculatedValue = null;

        // 1. Kiểm tra xem có phải là HÀM TỔNG HỢP không (ví dụ: sum(...))
        const aggRegex = /^(\w+)\(([\w\.]+)\)$/;
        const aggMatch = formula.match(aggRegex);

        if (aggMatch) {
            const funcName = aggMatch[1]; // -> "sum", "count", "avg"
            const path = aggMatch[2];     // -> "CaVch02d0Data.Ps_co"

            const pathParts = path.split('.');
            const propToAggregate = pathParts.pop(); // -> "Ps_co"
            const arrayPath = pathParts.join('.') + '.value'; // -> "CaVch02d0Data.value"

            const dataArray = getValueFromPath(data, arrayPath);

            if (Array.isArray(dataArray)) {
                // Lấy ra danh sách các số cần tính toán
                const values = dataArray.map(item => item[propToAggregate]).filter(v => typeof v === 'number');

                switch (funcName) {
                    case 'sum':
                        calculatedValue = values.reduce((a, b) => a + b, 0);
                        break;
                    case 'count':
                        calculatedValue = values.length;
                        break;
                    case 'avg':
                        calculatedValue = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
                        break;
                    // Thêm các hàm khác ở đây (min, max, ...)
                    default:
                        calculatedValue = `Unknown function: ${funcName}`;
                }
            } else {
                calculatedValue = `Array not found at path: ${arrayPath}`;
            }

        } else {
            // 2. Nếu không, xử lý nó như một PHÉP TÍNH SỐ HỌC
            // Thay thế tất cả các {placeholder} bằng giá trị thực tế
            const resolvedFormula = formula.replace(/\{([\w\.]+)\}/g, (match:any, placeholderPath:string) => {
                const val = getValueFromPath(data, placeholderPath);
                return typeof val === 'number' ? val : 0;
            });

            try {
                // Sử dụng new Function() để tính toán biểu thức một cách an toàn hơn eval()
                // Nó không có quyền truy cập vào scope bên ngoài.
                calculatedValue = new Function('return ' + resolvedFormula)();
            } catch (e) {
                calculatedValue = `Invalid expression: ${resolvedFormula}`;
            }
        }
        
        results[key] = calculatedValue;
    }

    // Hợp nhất kết quả tính toán vào đối tượng dữ liệu gốc
    return { ...data, ...results };
}


// Dữ liệu đầu vào
const dataObj = {
    "So_ct": "PC-08-25-001", "Ngay_lct": "2025-08-14", "Ma_nt": "usd", "Ty_gia": "1", "Stt_rec_dn": "a",
    "So_ct_kem": "s", "Tk_co": "1112", "Stt_rec": "153245", "Ma_ct": "CA2", "Ma_cty": "001",
    "Ty_gia_bq": 1, "T_tien_nt": 124.1, "T_tien": 212542, "T_Thue": 2145, "T_Tt_nt": 554, "T_Tt": 45,
    "LUser": "admin", "so_ct_dn": "245", "Trang_thai": "1", "Nguoi_gd": "", "IDcustomer": "CC0000000001",
    "Dia_chi": "sadas", "Dien_giai": "ád", "Ngay_ct": "2025-08-14",
    "CaVch02d0Data": {
        "typeName": "CaVch01D0Type",
        "value": [
            { "Ps_co": 54.4, "Ps_no": 10 },
            { "Ps_co": 100.0, "Ps_no": 20 },
            { "Ps_co": 20.6, "Ps_no": 5 }
        ]
    }
};

// Công thức động
const formulaObj = {
  sum_Ps_co: 'sum(CaVch02d0Data.Ps_co)', // Tính tổng Ps_co
  total_payment: '{T_tien} + {T_Thue}', // Tính tổng tiền và thuế
  count_items: 'count(CaVch02d0Data.Ps_co)', // Đếm số mục trong chi tiết
  avg_Ps_no: 'avg(CaVch02d0Data.Ps_no)' // Tính trung bình Ps_no
};
// Chạy và xem kết quả
//const finalResult = processFormulas(dataObj, formulaObj);
//console.log(JSON.stringify(finalResult, null, 2));