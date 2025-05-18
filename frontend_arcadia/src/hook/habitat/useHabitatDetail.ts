import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { Habitat } from "@models/habitat"
import { AnimalListItem } from "@models/animal"
import { fetchHabitatAnimals, fetchOneHabitat, deleteHabitat, fetchHabitatReports } from "@services/habitatService"
import { HabitatReportListItem } from "@models/habitatReport"

export function useHabitatDetail() {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const [habitat, setHabitat] = useState<Habitat | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [notFound, setNotFound] = useState<boolean>(false)

    const [animals, setAnimals] = useState<AnimalListItem[]>([])
    const [animalsLoading, setAnimalsLoading] = useState<boolean>(false)
    const [animalsError, setAnimalsError] = useState<string | null>(null)

    const [reports, setReports] = useState<HabitatReportListItem[]>([])
    const [reportsLoading, setReportsLoading] = useState<boolean>(false)
    const [reportsError, setReportsError] = useState<string | null>(null)

    const loadHabitat = useCallback(async () => {
        if (!uuid) {
            return
        }
        setLoading(true)
        setError(null)
        try {
            const habitatResponse = await fetchOneHabitat(uuid)
            setHabitat(habitatResponse)
            if (!habitatResponse) {
                setNotFound(true)
            }
        } catch {
            setError("Impossible de charger l'habitat")
        } finally {
            setLoading(false)
        }
    }, [uuid])

    const loadAnimals = useCallback(async () => {
        if (!uuid) {
            return
        }
        setAnimalsLoading(true)
        setAnimalsError(null)
        try {
            const animalList = await fetchHabitatAnimals(uuid)
            setAnimals(animalList)
        } catch {
            setAnimalsError("Impossible de charger les animaux")
        } finally {
            setAnimalsLoading(false)
        }
    }, [uuid])

    const loadReports = useCallback(async () => {
        if (!uuid) {
            return
        }
        setReportsLoading(true)
        setReportsError(null)
        try {
            const reportsList = await fetchHabitatReports(uuid)
            setReports(reportsList)
        } catch {
            setReportsError("Impossible de charger les rapports")
        } finally {
            setReportsLoading(false)
        }
    }, [uuid])

    const removeHabitat = useCallback(async () => {
        if (!uuid) {
            return
        }
        setLoading(true)
        setError(null)
        try {
            await deleteHabitat(uuid)
            navigate(DASHBOARD_ROUTES.HABITATS.TO)
        } catch {
            setError("Impossible de supprimer l'habitat")
        } finally {
            setLoading(false)
        }
    }, [uuid, navigate])

    useEffect(() => {
        loadHabitat()
    }, [loadHabitat])

    useEffect(() => {
        if (habitat) {
            loadAnimals()
            loadReports()
        }
    }, [habitat, loadAnimals, loadReports])

    return {
        habitat,
        loading,
        error,
        setError,
        notFound,
        animals,
        animalsLoading,
        animalsError,
        reports,
        reportsLoading,
        reportsError,
        removeHabitat
    }
}