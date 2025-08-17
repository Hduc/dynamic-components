import { Button } from "@mui/material";
import { ButtonConfig } from "../../types/button";
import { useDynamicLayout } from "../../hooks/useDynamicLayout";

const DynamicButton: React.FC<ButtonConfig> = ({ label,config }) => {
    const {executeAction} = useDynamicLayout()
    
    const handleClick = () => {
        if (config && config.onClickAction) {
            executeAction(config.onClickAction);
        }
    };

    return (
        <Button
            variant={config?.variant || 'contained'}
            color={config?.color || 'primary'}
            onClick={handleClick}
            fullWidth
        >
            {label}
        </Button>
    );
};

export default DynamicButton