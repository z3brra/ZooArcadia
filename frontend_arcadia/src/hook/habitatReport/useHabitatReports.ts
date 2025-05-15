import { useState, useCallback, useEffect } from "react"
import { createHabitatReport, fetchHabitatReports } from "@services/habitatReportService"
import { HabitatReportListItem, HabitatReportCreate } from "@models/habitatReport"

import { fetchAllHabitats } from "@services/habitatService"

import { SelectOption } from "@components/form/CustomSelect"
import { validateHabitatReport } from "@utils/validation"

export function useHabitatReports(initialPage = 1) {
    const [habitatReports, setHabitatReports] = useState<HabitatReportListItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(initialPage)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const [habitatReportHabitatUuid, setHabitatReportHabitatUuid] = useState<string>("")
    const [habitatOptions, setHabitatOptions] = useState<SelectOption[]>([])
    const [habitatOptionsError, setHabitatOptionsError] = useState<string | null>(null)

    const [habitatReportState, setHabitatReportState] = useState<string>("")
    const [habitatReportComment, setHabitatReportComment] = useState<string>("")

    const [fieldErrors, setFieldErrors] = useState<{
        habitatReportHabitatUuid?: string
        habitatReportState?: string
        habitatReportComment?: string
    }>({})

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

    const loadOptions = useCallback(async () => {
        setHabitatOptionsError(null)
        try {
            const habitats = await fetchAllHabitats()
            setHabitatOptions(
                habitats.data.map((habitat) => ({ value: habitat.uuid, label: habitat.name}))
            )
        } catch {
            setHabitatOptionsError("Impossible de charger la liste des habitats")
        }
    }, [])

    useEffect(() => {
        loadHabitatReports()
        loadOptions()
    }, [loadHabitatReports, loadOptions])

    const addHabitatReport = useCallback(async (payload: HabitatReportCreate) => {
        setLoading(true)
        setError(null)
        try {
            await createHabitatReport(payload)
            setCurrentPage(1)

            setHabitatReportHabitatUuid("")
            setHabitatReportState("")
            setHabitatReportComment("")

            await loadHabitatReports()
        } catch {
            setError("Impossible de créer le rapport")
        } finally {
            setLoading(false)
        }
    }, [loadHabitatReports])

    const submitCreation = useCallback(async (
        habitatReportHabitatUuid: string,
        habitatReportState: string,
        habitatReportComment: string
    ) => {
        const errors = validateHabitatReport(habitatReportHabitatUuid, habitatReportState, habitatReportComment)
        setFieldErrors({
            habitatReportHabitatUuid: errors.habitatUuid,
            habitatReportState: errors.state,
            habitatReportComment: errors.comment
        })
        if (Object.keys(errors).length) {
            return false
        }
        setLoading(true)
        setError(null)

        const payload: HabitatReportCreate = {
            habitatUuid: habitatReportHabitatUuid.trim(),
            state: habitatReportState.trim(),
            comment: habitatReportComment.trim() || null
        }
        await addHabitatReport(payload)
        setFieldErrors({})
        return true
    }, [addHabitatReport])

    return {
        habitatReports,
        currentPage, setCurrentPage,
        totalPages,
        loading,
        error, setError,

        habitatReportHabitatUuid, setHabitatReportHabitatUuid,
        habitatOptions,
        habitatOptionsError, setHabitatOptionsError,

        habitatReportState, setHabitatReportState,
        habitatReportComment, setHabitatReportComment,

        fieldErrors,
        submitCreation
    }
}
