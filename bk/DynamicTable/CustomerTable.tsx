import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Typography, TablePagination, TableSortLabel
} from "@mui/material";
import { ColumnHeader } from "./types";
import React, { useState, useMemo } from "react";
import { formatCell } from "./formatCell";




interface CustomerTableProps {
    columnHeaders: ColumnHeader[],
    data: any[];
    onRowClick: (obj: any) => void;
    selectedCustomerId?: string;
}

type Order = 'asc' | 'desc';

const CustomerTable: React.FC<CustomerTableProps> = React.memo(({ columnHeaders, data, onRowClick, selectedCustomerId }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<string>('name');

    const handleSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            let aValue: any = a[orderBy];
            let bValue: any = b[orderBy];

            if (typeof aValue === 'string') {
                return (order === 'asc' ? 1 : -1) * aValue.localeCompare(bValue);
            }

            return (order === 'asc' ? aValue - bValue : bValue - aValue);
        });
    }, [data, order, orderBy]);

    const paginatedData = useMemo(() => {
        const start = page * rowsPerPage;
        return sortedData.slice(start, start + rowsPerPage);
    }, [sortedData, page, rowsPerPage]);

    return (
        <Paper>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="customer table">
                    <TableHead sx={{ backgroundColor: 'grey.100' }}>
                        <TableRow>
                            {columnHeaders.map((col: ColumnHeader) => (
                                <TableCell sx={{
                                    width: 'auto',           // chiều rộng
                                    backgroundColor: "#F6F7F9", // màu nền
                                    color: "inherit",       // màu chữ
                                    fontWeight: "bold",                    // chữ đậm cho header
                                }}>
                                    <TableSortLabel
                                        active={orderBy === col.key}
                                        direction={orderBy === col.key ? order : 'asc'}
                                        onClick={() => handleSort(col.key)}
                                    >
                                        {col.name}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.length > 0 ? paginatedData.map((obj, index) => (
                            <TableRow
                                key={obj.id}
                                hover
                                onClick={() => onRowClick(obj)}
                                selected={selectedCustomerId === obj.id}
                                sx={{
                                    cursor: 'pointer',
                                    "&:nth-of-type(odd)": { backgroundColor: "#ddeeffff" },
                                    "&:nth-of-type(even)": { backgroundColor: "#ffffff" },
                                }}
                            >
                                {columnHeaders && columnHeaders.map(he => (
                                    <TableCell>{formatCell(obj[he.key], he.type)}</TableCell>
                                ))}
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">Không tìm thấy kết quả phù hợp.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={data.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Số dòng mỗi trang"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
            />
        </Paper>
    );
});

export default CustomerTable;
