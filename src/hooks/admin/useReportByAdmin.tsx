import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

const useReportByAdmin = (startDate?: Date | null, endDate?: Date | null) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate.toISOString())
    if (endDate) params.append('endDate', endDate.toISOString())

    const url = `/api/admin/report?${params.toString()}`

    const { data, error, isLoading, mutate } = useSWR(url, fetcher)

    return {
        data: data?.data,
        error,
        isLoading,
        mutate
    }
}

export default useReportByAdmin