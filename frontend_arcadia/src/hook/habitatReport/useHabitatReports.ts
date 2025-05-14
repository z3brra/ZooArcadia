import { useState, useCallback, useEffect } from "react"
import { fetchHabitatReports } from "@services/habitatReportService"
import { HabitatReportListItem } from "@models/habitatReport"

export function useHabitatReports(initialPage = 1) {
    const [habitatReports, setHabitatReports] = useState<HabitatReportListItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(initialPage)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const loadHabitatReports = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const habitatReportsResponse = await fetchHabitatReports(currentPage)
            setHabitatReports(habitatReportsResponse.data)
            setTotalPages(habitatReportsResponse.totalPages)
        } catch {
            setError("Impossible de charger la liste des rapports")
        } finally {
            setLoading(false)
        }
    }, [currentPage])

    useEffect(() => {
        loadHabitatReports()
    }, [loadHabitatReports])

    return {
        habitatReports,
        currentPage, setCurrentPage,
        totalPages,
        loading,
        error, setError
    }
}
