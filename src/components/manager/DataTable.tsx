/* eslint-disable @typescript-eslint/no-explicit-any */
// components/DataTable.tsx
'use client'

import React, { } from 'react'
import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,

    flexRender,
} from '@tanstack/react-table'
import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Toolbar,
    Typography,
} from '@mui/material'
import { SaveAlt, Edit, Delete } from '@mui/icons-material'
import * as XLSX from 'xlsx'
import Link from 'next/link'

interface DataTableProps<TData> {
    data: TData[]
    columns: ColumnDef<TData, any>[]
    totalCount: number
    page: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
    addTitle: string,
    addTitleRoute: string,
    onEdit?: (row: TData) => void
    onDelete?: (row: TData) => void
    title?: string
}

export function DataTable<TData>({
    data,
    columns,
    totalCount,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    addTitle,
    addTitleRoute,
    onEdit,
    onDelete,
    title,
}: DataTableProps<TData>) {



    const table = useReactTable({
        data,
        columns,
        pageCount: Math.ceil(totalCount / pageSize),
        manualPagination: true,

        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
        XLSX.writeFile(workbook, 'table_export.xlsx')
    }

    return (
        <Paper sx={{}}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {title && <Typography variant="h6">{title}</Typography>}
                <Box display="flex" gap={2}>

                    <Button variant='contained' component={Link} href={addTitleRoute}>{addTitle}</Button>

                    <Button
                        variant="outlined"
                        startIcon={<SaveAlt />}
                        onClick={exportToExcel}
                    >
                        Export
                    </Button>
                </Box>
            </Toolbar>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableCell
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: ' 🔼',
                                            desc: ' 🔽',
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </TableCell>
                                ))}
                                {(onEdit || onDelete) && <TableCell>Actions</TableCell>}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                {table
                                    .getRowModel()
                                    .rows[index]?.getVisibleCells()
                                    .map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                {(onEdit || onDelete) && (
                                    <TableCell>
                                        {onEdit && (
                                            <IconButton onClick={() => onEdit(row)}>
                                                <Edit />
                                            </IconButton>
                                        )}
                                        {onDelete && (
                                            <IconButton onClick={() => onDelete(row)}>
                                                <Delete />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={(_, newPage) => onPageChange(newPage)}
                rowsPerPage={pageSize}
                onRowsPerPageChange={(e) => onPageSizeChange(Number(e.target.value))}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </Paper>
    )
}
