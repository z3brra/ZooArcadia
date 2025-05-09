import { useState, useCallback, useEffect } from "react"
import { fetchHabitats, createHabitat } from "@services/habitatService"
import { HabitatListItem, HabitatCreate } from "@models/habitat"
import { validateHabitat } from "@utils/validation"

export function useHabitats(initialPage = 1) {
    const [habitats, setHabitats] = useState<HabitatListItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(initialPage)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const [habitatName, setHabitatName] = useState<string>("")
    const [habitatDescription, setHabitatDescription] = useState<string>("")
    const [fieldErrors, setFieldErrors] = useState<{
        habitatName?: string
        habitatDescription?: string
    }>({})

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

    const addHabitat = useCallback(async (payload: HabitatCreate) => {
        setLoading(true)
        setError(null)
        try {
            await createHabitat(payload)
            setCurrentPage(1)
            setHabitatName("");
            setHabitatDescription("");
            await loadHabitats()
        } catch {
            setError("Impossible de créer l'habitat")
        } finally {
            setLoading(false)
        }
    }, [loadHabitats])

    const submitCreation = useCallback(async (habitatName: string, habitatDescription: string) => {
        const errors = validateHabitat(habitatName, habitatDescription)
        setFieldErrors({
            habitatName: errors.name,
            habitatDescription: errors.description
        })
        if (Object.keys(errors).length) {
            return false
        }

        setLoading(true)
        setError(null)

        const payload: HabitatCreate = {
            name: habitatName.trim(),
            description: habitatDescription.trim() || null
        }
        await addHabitat(payload)
        setFieldErrors({})
        return true
    }, [addHabitat])

    return {
        habitats,
        currentPage,
        totalPages,
        loading,
        error,
        setCurrentPage,
        habitatName,
        setHabitatName,
        habitatDescription,
        setHabitatDescription,
        fieldErrors,
        submitCreation
    }
}
