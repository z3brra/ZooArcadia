import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { HabitatReport } from "@models/habitatReport"

import { fetchOneHabitatReport, deleteHabitatReport } from "@services/habitatReportService"
import { fetchOneHabitat } from "@services/habitatService"

export function useHabitatReportDetail() {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const [habitatReport, setHabitatReport] = useState<HabitatReport | null>()
    const [habitatAnimalCount, setHabitatAnimalCount] = useState<number | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [notFound, setNotFound] = useState<boolean>(false)

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
        } catch {
            setError("Impossible de charger le rapport")
        } finally {
            setLoading(false)
        }
    }, [uuid])

    const loadHabitatAnimalCount = useCallback(async () => {
        if (!habitatReport) {
            return
        }
        setLoading(true)
        setError(null)
        try {
            const habitatResponse = await fetchOneHabitat(habitatReport.habitatUuid)
            setHabitatAnimalCount(habitatResponse.animalCount)
        } catch {
            setError("Impossible de charger l'habitat")
        } finally {
            setLoading(false)
        }
    }, [habitatReport])

    useEffect(() => {
        loadHabitatReport()
    }, [loadHabitatReport])

    useEffect(() => {
        loadHabitatAnimalCount()
    }, [loadHabitatAnimalCount])


    const removeHabitatReport = useCallback(async () => {
        if (!uuid) {
            return
        }
        setLoading(true)
        setError(null)
        try {
            await deleteHabitatReport(uuid)
            navigate(DASHBOARD_ROUTES.HABITATS_REPORT.TO)
        } catch {
            setError("Impossible de supprimer le rapport")
        } finally {
            setLoading(false)
        }
    }, [uuid, navigate])

    return {
        habitatReport,
        habitatAnimalCount,
        loading,
        error, setError,
        notFound,
        removeHabitatReport
    }

}