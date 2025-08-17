import { Button, Chip, Stack } from "@mui/material";

interface ActiveFiltersProps {
    filters: any;
    onDelete: (filterKey: any) => void;
    onClearAll: () => void;
}

const ActiveFiltersDisplay: React.FC<ActiveFiltersProps> = ({ filters, onDelete, onClearAll }) => {
    const activeFilterEntries = Object.entries(filters).filter(([, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== null && value !== undefined && value !== '' && value !== 0;
    });

    if (activeFilterEntries.length === 0) return null;

    const getLabel = (key: string, value: any): string => {
        switch (key) {
            case 'name': return `Tên: ${value}`;
            case 'id_card': return `CCCD: ${value}`;
            case 'dob_start': return `Ngày sinh từ: ${new Date(value).toLocaleDateString('vi-VN')}`;
            case 'dob_end': return `Ngày sinh đến: ${new Date(value).toLocaleDateString('vi-VN')}`;
            case 'gender': return `Giới tính: ${value}`;
            case 'favorite_colors': return `Màu: ${value.join(', ')}`;
            case 'income': return `Thu nhập > ${value}tr`;
            case 'age_min': return `Tuổi từ: ${value}`;
            case 'age_max': return `Tuổi đến: ${value}`;
            case 'keywords': return `Từ khóa: ${value}`;
            case 'city': return `Thành phố: ${value}`;
            case 'status': return `Trạng thái: ${value}`;
            default: return '';
        }
    };

    return (
        <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" sx={{ mb: 2 }}>
            {activeFilterEntries.map(([key, value]) => (
                <Chip
                    key={key}
                    label={getLabel(key, value)}
                    onDelete={() => onDelete(key)}
                    color="primary"
                    variant="outlined"
                />
            ))}
            <Button size="small" onClick={onClearAll}>Xóa tất cả</Button>
        </Stack>
    );
};

export default ActiveFiltersDisplay