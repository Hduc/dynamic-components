import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import Settings from "@mui/icons-material/Settings";
import { Box, IconButton } from "@mui/material";
import React from "react";
import { ReactNode } from "react";

interface ConfigurableWrapperProps {
    children: ReactNode;
    onEdit?: () => void;
    onDelete?: () => void;
    type: string;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    isFirst?: boolean;
    isLast?: boolean;
}

const ConfigurableWrapper: React.FC<ConfigurableWrapperProps> = ({ children, onEdit, onDelete, type, onMoveUp, onMoveDown, isFirst, isLast }) => (<Box
    sx={{
        position: 'relative',
        '&:hover .component-actions': { opacity: 1 },
        p: 1,
        border: '1px dashed transparent',
        '&:hover': {
            borderColor: 'action.hover',
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
        },
        borderRadius: 1
    }}>
    {children}
    <Box className="component-actions"
        sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            opacity: 0,
            transition: 'opacity 0.2s',
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: '4px',
            p: '2px',
            boxShadow: 1,
            zIndex: 10
        }}>
        <IconButton size="small" onClick={onMoveUp} disabled={isFirst} title="Di chuyển lên">
            <ArrowUpward fontSize="inherit" />
        </IconButton>
        <IconButton size="small" onClick={onMoveDown} disabled={isLast} title="Di chuyển xuống">
            <ArrowDownward fontSize="inherit" />
        </IconButton>
        {onEdit && <IconButton size="small" onClick={onEdit} title={`Chỉnh sửa ${type}`}>
            <Settings fontSize="inherit" />
            </IconButton>}
        {onDelete && <IconButton size="small" color="error" onClick={onDelete} title={`Xóa ${type}`}>
            <Delete fontSize="inherit" />
            </IconButton>}
    </Box>
</Box>
);


export default ConfigurableWrapper

