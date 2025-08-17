import { Button } from "@mui/material";
import { ButtonConfig } from "./types";

interface DynamicButtonProps {
    componentConfig: ButtonConfig;
    onAction: (actionName: string) => void;
}
const DynamicButton: React.FC<DynamicButtonProps> = ({ componentConfig, onAction }) => {
    const { label, config } = componentConfig;
    const handleClick = () => {
        if (config.onClickAction) {
            onAction(config.onClickAction);
        }
    };
    return (
        <Button
            variant={config.variant || 'contained'}
            color={config.color || 'primary'}
            onClick={handleClick}
            fullWidth
        >
            {label}
        </Button>
    );
};

export default DynamicButton