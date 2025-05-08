import { useState, useCallback, useEffect } from "react"
import { fetchHabitats, createHabitat } from "@services/habitatService"
import { HabitatListItem, HabitatCreate } from "@models/habitat"

export function useHabitats(initialPage = 1) {
    const [habitats, setHabitats] = useState<HabitatListItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(initialPage)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const loadHabitats = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const habitatResponse = await fetchHabitats(currentPage)
            setHabitats(habitatResponse.data)
            setTotalPages(habitatResponse.totalPages)
        } catch {
            setError("Impossible de charger la liste des habitats")
        } finally {
            setLoading(false)
        }
    }, [currentPage])

    useEffect(() => {
        loadHabitats()
    }, [loadHabitats])

    const addHabitat = async (payload: HabitatCreate) => {
        setLoading(true)
        setError(null)
        try {
            await createHabitat(payload)
            setCurrentPage(1)
            await loadHabitats()
        } catch {
            setError("Impossible de créer l'habitat")
        } finally {
            setLoading(false)
        }
    }

    return {
        habitats,
        currentPage,
        totalPages,
        loading,
        error,
        setCurrentPage,
        addHabitat
    }
}
