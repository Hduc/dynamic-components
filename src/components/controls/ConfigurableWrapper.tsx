import { ArrowDownward, ArrowUpward, Delete, Settings } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import React, { ReactNode } from 'react'
import { useDynamicLayout } from '../../hooks/useDynamicLayout';

interface ConfigurableWrapperProps {
    children: ReactNode;
    id: string;
    type: string;
    index: number;
    length: number;
}

const ConfigurableWrapper: React.FC<ConfigurableWrapperProps> = ({
    children,
    id,
    type,
    index,
    length }) => {

    const { handleDeleteItem, handleMoveItem, handleOpenConfig } = useDynamicLayout()

    const onMoveUp = () => handleMoveItem(id, 'up')


    const onMoveDown = () => handleMoveItem(id, 'down')

    const onEdit = () => handleOpenConfig(id)
    
    return (<Box sx={{
        position: 'relative', '&:hover .component-actions': { opacity: 1 },
        p: 1, border: '1px dashed transparent',
        '&:hover': {
            borderColor: 'action.hover',
            backgroundColor: 'rgba(0,0,0,0.02)'
        },
        borderRadius: 1
    }}>
        {children}
        <Box className="component-actions" sx={{
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
            <IconButton size="small" onClick={onMoveUp} disabled={index === 0} title="Di chuyển lên">
                <ArrowUpward fontSize="inherit" />
            </IconButton>
            <IconButton size="small" onClick={onMoveDown} disabled={index === length - 1} title="Di chuyển xuống">
                <ArrowDownward fontSize="inherit" />
            </IconButton>
            <IconButton size="small" onClick={onEdit} title={`Chỉnh sửa ${type}`}>
                <Settings fontSize="inherit" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => handleDeleteItem(id)} title={`Xóa ${type}`}>
                <Delete fontSize="inherit" />
            </IconButton>
        </Box>
    </Box>)

};
export default ConfigurableWrapper