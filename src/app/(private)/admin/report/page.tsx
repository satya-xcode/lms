'use client'
import useReportByAdmin from '@/hooks/admin/useReportByAdmin'
import React from 'react'

function Report() {
    const { data } = useReportByAdmin()

    console.log(
        "Report", data
    )

    return (
        <div>Report</div>
    )
}

export default Report