import useSWR from "swr";

const useReportByAdmin = () => {
    const { data, error, isLoading, mutate } = useSWR('/api/admin/report')

    return {
        data,
        error,
        isLoading,
        mutate
    }
}

export default useReportByAdmin;