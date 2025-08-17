import { DynFormData } from '../../types'
// --- HÀM TIỆN ÍCH ---
export const parseDateExpression = (expression: string, type: 'date' | 'datetime-local'): string => {
    const now = new Date();
    const regex = /now\s*([+-])?\s*(\d+)?\s*([dhm])?/;
    const match = expression.toLowerCase().match(regex);

    if (!match) return '';
    // Invalid expression

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
        return localDate.toISOString().slice(0,
            16);
    }

    return '';
};

export const evaluateExpression = (expression: string,
    rowContext: DynFormData): string => {
    if (!expression) return '';

    const placeholderRegex = /{(\w+)}/g;

    const replacedExpr = expression.replace(placeholderRegex,
        (match, key) => {
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

    return replacedExpr.replace(/0/g, '');
};