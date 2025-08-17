import { useState, useMemo, useCallback, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Stack,
    Icon,
} from '@mui/material';
import { ColumnHeader, TableConfig } from './types';
import ActiveFiltersDisplay from './ActiveFiltersDisplay';
import FilterSidebar from './FilterSidebar';
import CustomerTable from './CustomerTable';
import { apiCommonGet, apiCommonPost } from 'src/apis/apiCommon';
import Swal from 'sweetalert2';
import CustomerDetailModal from './CustomerDetailModal';
import { useParams } from 'react-router-dom';
import { getTableConfig } from 'src/apis/apiDynamicTable';

export default function DynamicTable() {
    const { id } = useParams()
    const [tableConfig, setTableConfig] = useState<Partial<TableConfig>>({})
    const [columns, setColumns] = useState<ColumnHeader[]>([]);
    const [allData, setAllData] = useState<any[]>([]);
    const [currentData, setCurrentData] = useState<Partial<any>>({});
    const [isViewModal, setIsViewModal] = useState<boolean>(false)
    const [filters, setFilters] = useState<Partial<any>>({});
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState<{ formId: string, layoutJson?: string}>({ formId: '' })

    useEffect(() => {
        apiTableConfig()
    }, [id])

    const apiTableConfig = async () => {
        if (!id || id == '') return;
        const res = await getTableConfig(id)
        if (!res.success) {
            Swal.fire(`Không lấy được dữ liệu tên bảng!`, "", "error");
            return;
        }
        const tbConfig = res.data as TableConfig
        setTableConfig(tbConfig)
        // kiểm tra nếu có api 
        getTableColumn(tbConfig.urlColumn, tbConfig.urlData)
    }

    // Load cột trong bảng
    const getTableColumn = async (url: string, urlData: string) => {
        const res = await apiCommonGet(url);
        if (!res.success) {
            Swal.fire(`Không lấy được cấu hình tên cột!`, "", "error");
            return;
        }
        const mapColumn: ColumnHeader[] = res.data
            .filter((col: any) => col.visibled == 1)
            .sort((a: any, b: any) => a.displayIndex - b.displayIndex)
            .map((col: any) => {
                return {
                    key: col.accessorKey || col.columnName,
                    type: col.columnType,
                    name: col.columnName || col.displayName,
                    order: col.displayIndex || col.columnOrder,
                    width: col.columnWidth || 100
                }
            });

        setColumns(mapColumn);
        loadDataInital(urlData)
    }

    //Load dữ liệu
    const loadDataInital = async (urlData: string) => {
        const [url, obj] = (urlData || '').split('-')
        // nếu tồn tại obj => post và truyền obj vào
        const res = !obj || obj === '' ? await apiCommonGet(url) : await apiCommonPost(url, obj)
        if (!res.success) {
            Swal.fire(`Không lấy được dữ liệu!`, "", "error");
            return;
        }
        setAllData(res.data)
    }

    const handleApplyFilters = useCallback((newFilters: any) => {
        setFilters(newFilters);
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters({});
    }, []);

    const handleRowClick = useCallback((customer: any) => {
        const actionEdit = tableConfig.actions?.find(x=>x.actionType ==='add')
        setCurrentAction({formId:(actionEdit?.formId|| ''),layoutJson:actionEdit?.layoutJson})
        setCurrentData(customer);
        setDetailModalOpen(true);
        setIsViewModal(true)
    }, []);


    const handleDeleteFilter = useCallback((filterKey: any) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[filterKey];
            return newFilters;
        });
    }, []);

    const handleOpenModal = () => {
        setIsViewModal(false);
        setCurrentData({});
        setDetailModalOpen(true);
    };


    const handleCloseDetailModal = () => {
        setDetailModalOpen(false);
        // Đặt một khoảng trễ nhỏ trước khi bỏ chọn hàng để hiệu ứng mượt hơn
        setTimeout(() => {
            setCurrentData({});
        }, 150);
    };


    const handleSaveData = (customerToSave: any) => {
        if (customerToSave.id) { // Edit mode
            setAllData(prev => prev.map(c => c.id === customerToSave.id ? customerToSave : c));
        } else { // Add mode
            const newCustomer: any = { ...customerToSave, id: Date.now().toString(), status: 'Hoạt động', favorite_colors: [], keywords: [], income: 0 };

            setAllData(prev => [newCustomer, ...prev]);
        }
        handleCloseDetailModal();
    };

    const handleSwitchToEditMode = () => {
        setIsViewModal(false);
    };

    const renderActions = () => {
        return (<Stack direction="row" spacing={5}>
            {tableConfig.actions?.map(ac => {
                switch (ac.actionType) {
                    case 'filter':

                        return (
                            <Button variant={ac.style as any} startIcon={<Icon>{ac.iconClass}</Icon>} onClick={() => {
                                setDrawerOpen(true)
                                setCurrentAction({ formId: ac.formId, layoutJson: ac.layoutJson})
                            }}>
                                {ac.actionName}
                            </Button>
                        )
                    default:
                        return (
                            <Button variant={ac.style as any} startIcon={<Icon>{ac.iconClass}</Icon>} onClick={(e) => {
                                handleOpenModal()
                                setCurrentData({})
                                setCurrentAction({ formId: ac.formId, layoutJson: ac.layoutJson})
                            }}>
                                {ac.actionName}
                            </Button>
                        )
                }
            })}
        </Stack>)
    }

    return (
        <div>
            <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1">{tableConfig.tableName}</Typography>
                    {tableConfig?.actions && renderActions()}
                </Box>
                <ActiveFiltersDisplay filters={filters} onDelete={handleDeleteFilter} onClearAll={handleResetFilters} />
                <CustomerTable
                    columnHeaders={columns}
                    data={allData}
                    onRowClick={handleRowClick}
                    selectedCustomerId={currentData?.id}
                />
            </Stack >
            <FilterSidebar
                formId={currentAction?.formId}
                layoutJson={currentAction.layoutJson}
                open={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                initialFilters={filters}
            />
            <CustomerDetailModal
                formId={currentAction?.formId}
                layoutJson={currentAction.layoutJson}
                open={isDetailModalOpen}
                onClose={handleCloseDetailModal}
                onSave={handleSaveData}
                data={currentData}
                columnHeaders={columns}
                isView={isViewModal}
                onSwitchToEdit={handleSwitchToEditMode}
            />
        </div >
    );
}
