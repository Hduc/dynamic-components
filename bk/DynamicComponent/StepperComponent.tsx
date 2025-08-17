import { Add, Settings } from "@mui/icons-material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import ConfigurableWrapper from "./ConfigurableWrapper";
import DynamicField from "./DynamicField";
import { Box, Button, CircularProgress, Grid, IconButton, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import DynamicTableComponent from "./DynamicTableComponent";
import { useState } from "react";
import { AddComponentContext, DynFormData, Errors, LayoutItem, StepperConfig } from "./types";

interface StepperComponentProps {
    componentId: string;
    componentConfig: StepperConfig;
    formData: DynFormData;
    errors: Errors;
    onFieldChange: (fieldId: string, value: any) => void;
    onTableChange: (tableId: string, data: any[], tableType?: string) => void;
    onValidateStep: (itemsToValidate: LayoutItem[]) => Errors;
    onExecuteAction: (actionName: string) => Promise<void>;

    onAddFieldToStep?: (stepperComponentId: string, stepIndex: number) => void;
    onAddStep?: (stepperComponentId: string) => void;
    onOpenConfig?: (itemId: string) => void;
    onOpenTableConfig?: (itemId: string) => void;
    onDeleteItem?: (itemId: string) => void;
    onOpenStepConfig?: (componentId: string, stepId: string) => void;
    onMoveItem?: (itemId: string, direction: 'up' | 'down') => void;
    onOpenAddComponentDialog?: (context: AddComponentContext) => void;
}

const StepperComponent: React.FC<StepperComponentProps> = ({
    componentId,
    componentConfig,
    formData,
    onFieldChange,
    onTableChange,
    onAddStep,
    onOpenConfig,
    onDeleteItem,
    onOpenTableConfig,
    errors,
    onValidateStep,
    onOpenStepConfig,
    onExecuteAction,
    onMoveItem,
    onOpenAddComponentDialog
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const steps = componentConfig.steps || [];
    const [isStepLoading, setStepLoading] = useState(false);

    const handleNext = async () => {
        const currentStep = steps[activeStep];
        const stepErrors = onValidateStep(currentStep.items);
        if (Object.keys(stepErrors).length > 0) {
            return;
        }

        if (currentStep.onNextAction) {
            setStepLoading(true);
            try {
                await onExecuteAction(currentStep.onNextAction);
                setActiveStep((prev) => prev + 1);
            } catch (error) {
                // Error toast is handled by the caller (App component)
            } finally {
                setStepLoading(false);
            }
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const renderLayoutItem = (item: LayoutItem, index: number, arrayLength: number) => {
        switch (item.type) {
            case 'field':
                return (<Grid item xs={12}
                    sm={item.config.grid} key={item.id}>
                    <ConfigurableWrapper type="trường"
                        onEdit={onOpenConfig ? () => onOpenConfig(item.id) : undefined}
                        onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
                        onMoveUp={onMoveItem ? () => onMoveItem(item.id, 'up') : undefined}
                        onMoveDown={onMoveItem ? () => onMoveItem(item.id, 'down') : undefined}
                        isFirst={index === 0} isLast={index === arrayLength - 1}
                    >
                        <DynamicField fieldConfig={item.config}
                            formData={formData}
                            onFieldChange={onFieldChange}
                            errorText={errors[item.id]} />
                    </ConfigurableWrapper>
                </Grid>);
            case 'table':
                return (<Grid item xs={12}
                    key={item.id}>
                    <ConfigurableWrapper type="bảng"
                        onEdit={onOpenConfig ? () => onOpenConfig(item.id) : undefined}
                        onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
                        onMoveUp={onMoveItem ? () => onMoveItem(item.id, 'up') : undefined}
                        onMoveDown={onMoveItem ? () => onMoveItem(item.id, 'down') : undefined}
                        isFirst={index === 0} isLast={index === arrayLength - 1}
                    >
                        <DynamicTableComponent tableConfig={item.config}
                            tableData={formData[item.id]?.value || []}
                            onTableChange={onTableChange} />
                    </ConfigurableWrapper>
                </Grid>);
            default: return null;
        }
    };

    return (<Paper variant="outlined">
        <Box sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step) => (<Step key={step.id}>
                    <StepLabel>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            {step.label}
                            {onOpenStepConfig && <IconButton size="small" sx={{ p: 0.5 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenStepConfig(componentId, step.id);
                                }}
                                title="Chỉnh sửa bước">
                                <Settings sx={{ fontSize: '1rem' }} />
                            </IconButton>}
                        </Box>
                    </StepLabel>
                </Step>))}
            </Stepper>
            <Box sx={{ mt: 4 }}>
                {activeStep === steps.length ? (<Box>
                    <Typography>Tất cả các bước đã hoàn thành!</Typography>
                </Box>)
                    : (<Box>
                        <Grid container spacing={3}>
                            {steps[activeStep].items.map((item, idx, arr) => renderLayoutItem(item, idx, arr.length))}
                            <Grid item xs={12}>
                                <Button variant="outlined" size="small" startIcon={<Add />}
                                    onClick={onOpenAddComponentDialog ? () => onOpenAddComponentDialog({ parentId: componentId, parentType: 'step', stepIndex: activeStep }) : undefined}
                                    sx={{ mt: 2 }}>
                                    Thêm trường vào Bước này
                                </Button>
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
                            <Button color="inherit" disabled={activeStep === 0 || isStepLoading}
                                onClick={handleBack} sx={{ mr: 1 }}>Quay lại</Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleNext} disabled={isStepLoading}
                                startIcon={isStepLoading ? <CircularProgress size={20} /> : null}>
                                {isStepLoading ? 'Đang xử lý...' : (activeStep === steps.length - 1 ? 'Hoàn thành' : 'Tiếp theo')}
                            </Button>
                        </Box>
                    </Box>)}
            </Box>
        </Box>
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
            <Button onClick={onAddStep ? () => onAddStep(componentId) : undefined} color="primary" startIcon={<AddCircleOutline />} size="small">Thêm Bước</Button>
        </Box>
    </Paper>);

};
export default StepperComponent