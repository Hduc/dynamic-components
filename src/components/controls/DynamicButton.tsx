import { Button } from "@mui/material";
import { useDynamicLayout } from "../../hooks/useDynamicLayout";
import { LayoutItemConfig } from "../../types";
import { ButtonConfig } from "../../types/button";

const DynamicButton: React.FC<ButtonConfig> = ({ id, label, config }) => {
    const { executeAction } = useDynamicLayout()

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