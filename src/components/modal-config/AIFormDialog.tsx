import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Layout } from "../../types";
import { FieldConfig } from "../../types/field";
import { AutoAwesome } from "@mui/icons-material";
import { useDynamicLayout } from "../../hooks/useDynamicLayout";

const AIFormDialog = () => {
    const { isAiDialogOpen, setAiDialogOpen, handleAiGenerate } = useDynamicLayout()

    const [aiPrompt, setAiPrompt] = useState('Một form đăng ký sự kiện có họ tên,email, số điện thoại và số người tham dự.');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState('');

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
                const layoutItems: Layout = generatedFields.map((field: FieldConfig) => ({
                    id: field.id,
                    type: 'field',
                    config: field
                }));

                handleAiGenerate(layoutItems);

                setAiDialogOpen(false);
            } else {
                throw new Error("Phản hồi từ AI không hợp lệ.");
            }
        } catch (error: any) {
            setAiError(error.message);
        } finally {
            setIsGenerating(false);
        }
    };
    return (<Dialog open={isAiDialogOpen}
        onClose={() => setAiDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
        }}>
            <AutoAwesome color="primary" /> Tạo Form bằng AI</DialogTitle>
        <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Mô tả form bạn muốn tạo,
                AI sẽ tạo ra các trường dữ liệu tương ứng.</Typography>
            <TextField fullWidth multiline rows={3} variant="outlined" label="Mô tả form..." value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)} disabled={isGenerating} />
            {aiError && <Alert severity="error" sx={{ mt: 2 }}>{aiError}</Alert>}
        </DialogContent>
        <DialogActions>
            <Button
                onClick={() => setAiDialogOpen(false)}>Hủy</Button>
            <Button
                onClick={handleGenerate} variant="contained" disabled={isGenerating} startIcon={isGenerating
                    ? <CircularProgress size={20} />
                    : <AutoAwesome />}>
                {isGenerating ? 'Đang tạo...' : 'Tạo Form'}
            </Button>
        </DialogActions>
    </Dialog>);
};
export default AIFormDialog