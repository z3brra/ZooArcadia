import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { fetchOneHabitatReport, updateHabitatReport } from "@services/habitatReportService"
import { validateHabitatReport } from "@utils/validation"

import { HabitatReport, HabitatReportUpdate } from "@models/habitatReport"

export function useHabitatReportEdit() {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const [habitatReport, setHabitatReport] = useState<HabitatReport | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [notFound, setNotFound] = useState<boolean>(false)

    const [habitatReportState, setHabitatReportState] = useState<string>("")
    const [habitatReportComment, setHabitatReportComment] = useState<string>("")

    const [fieldErrors, setFieldErrors] = useState<{
        habitatReportHabitatUuid?: string
        habitatReportState?: string
        habitatReportComment?: string
    }>({})

    const loadHabitatReport = useCallback(async () => {
        if (!uuid) {
            return
        }
        setLoading(true)
        setError(null)
        try {
            const habitatReportResponse = await fetchOneHabitatReport(uuid)
            setHabitatReport(habitatReportResponse)
            if (!habitatReportResponse) {
                setNotFound(true)
            }
            setHabitatReportState(habitatReportResponse.state)
            setHabitatReportComment(habitatReportResponse.comment ? habitatReportResponse.comment : "")
        } catch {
            setError("Impossible de charger le rapport")
        } finally {
            setLoading(false)
        }
    }, [uuid])

    useEffect(() => {
        loadHabitatReport()
    }, [loadHabitatReport])

    const submitChange = useCallback(async () => {
        if (!uuid) {
            return
        }

        const errors = validateHabitatReport(habitatReport?.habitatUuid!, habitatReportState, habitatReportComment)
        setFieldErrors({
            habitatReportHabitatUuid: errors.habitatUuid,
            habitatReportState: errors.state,
            habitatReportComment: errors.comment
        })
        if (Object.keys(errors).length) {
            return
        }

        setLoading(true)
        setError(null)

        try {
            const payload: HabitatReportUpdate = {
                state: habitatReportState.trim(),
                comment: habitatReportComment.trim() || null
            }
            await updateHabitatReport(uuid, payload)
            navigate(DASHBOARD_ROUTES.HABITATS_REPORT.DETAIL(uuid))
        } catch {
            setError("Impossible de modifier l'habitat")
        } finally {
            setLoading(false)
        }
    }, [habitatReportState, habitatReportComment, uuid, navigate])

    return {
        habitatReport,
        loading,
        error, setError,
        notFound,
        habitatReportState, setHabitatReportState,
        habitatReportComment, setHabitatReportComment,
        fieldErrors,
        submitChange
    }

}