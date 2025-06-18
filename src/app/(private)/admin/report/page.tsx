/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { TextField, Button, Box, Stack } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

function Report() {
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [filterApplied, setFilterApplied] = useState(false)
    const [data, setData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleFilter = async () => {
        if (!startDate || !endDate) return

        setIsLoading(true)
        try {
            const params = new URLSearchParams({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            })
            const response = await fetch(`/api/admin/report?${params?.toString()}`)
            const result = await response.json()
            setData(result.data)
            setFilterApplied(true)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setStartDate(null)
        setEndDate(null)
        setData([])
        setFilterApplied(false)
    }

    const columns = [
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'fatherName', headerName: 'Father Name', width: 150 },
        { field: 'empId', headerName: 'Employee ID', width: 120 },
        { field: 'punchId', headerName: 'Punch ID', width: 120 },
        { field: 'department', headerName: 'Department', width: 150 },
        { field: 'role', headerName: 'Role', width: 120 },
        { field: 'type', headerName: 'Type', width: 150 },
        { field: 'reason', headerName: 'Reason', width: 200 },
        {
            field: 'startDate',
            headerName: 'Start Date',
            width: 180,
            valueFormatter: (params: any) => {
                if (!params?.value) return 'N/A';
                const date = new Date(params?.value);
                return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            },
        },
        {
            field: 'endDate',
            headerName: 'End Date',
            width: 180,
            valueFormatter: (params: any) => {
                if (!params?.value) return 'N/A';
                const date = new Date(params?.value);
                return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            },
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params: any) => (
                <span
                    style={{
                        color: params?.value === 'approved' ? 'green' :
                            params?.value === 'submitted' ? 'blue' : 'gray',
                        fontWeight: 'bold'
                    }}
                >
                    {params?.value}
                </span>
            ),
        },
        {
            field: 'totalHours',
            headerName: 'Total Hours',
            width: 120,
            valueFormatter: (params: any) => params?.value ?? 'N/A',
        },
        {
            field: 'staff',
            headerName: 'Staff',
            width: 150,
            valueGetter: (params: any) => params?.name || 'N/A',
        },
        {
            field: 'manager',
            headerName: 'Manager',
            width: 150,
            valueGetter: (params: any) => params?.name || 'N/A',
        },
    ]

    return (
        <div style={{ height: '80vh', width: '100%', padding: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                Employee Gate Pass Report
            </h1>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box mb={4}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            renderInput={(params: any) => <TextField {...params} />}
                        />
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            renderInput={(params: any) => <TextField {...params} />}
                            minDate={startDate}
                        />
                        <Button
                            variant="contained"
                            onClick={handleFilter}
                            disabled={!startDate || !endDate}
                        >
                            Filter
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleReset}
                            disabled={!filterApplied}
                        >
                            Reset
                        </Button>
                    </Stack>
                </Box>
            </LocalizationProvider>

            {filterApplied ? (
                <DataGrid
                    rows={data}
                    columns={columns}
                    getRowId={(row) => row._id}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10 },
                        },
                    }}
                    loading={isLoading}
                    pageSizeOptions={[5, 10, 20]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    density="comfortable"
                    sx={{
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none',
                        },
                    }}
                />
            ) : (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50%',
                    color: 'rgba(0, 0, 0, 0.6)',
                    fontSize: '1.2rem'
                }}>
                    {!startDate || !endDate
                        ? 'Please select date range and click Filter'
                        : 'Click Filter button to load data'}
                </div>
            )}
        </div>
    )
}

export default Report