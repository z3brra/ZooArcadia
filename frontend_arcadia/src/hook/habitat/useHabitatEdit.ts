import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { fetchOneHabitat, updateHabitat, updateHabitatPicture } from "@services/habitatService"
import { validateHabitat } from "@utils/validation"

import { Habitat, HabitatUpdate } from "@models/habitat"

export function useHabitatEdit() {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const [habitat, setHabitat] = useState<Habitat | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [notFound, setNotFound] = useState<boolean>(false)

    const [habitatName, setHabitatName] = useState<string>("")
    const [habitatDescription, setHabitatDescription] = useState<string>("")
    const [fieldErrors, setFieldErrors] = useState<{
        habitatName?: string
        habitatDescription?: string
    }>({})

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
            setHabitatName(habitatResponse.name)
            setHabitatDescription(habitatResponse.description ? habitatResponse.description : "")
        } catch {
            setError("Impossible de charger l'habitat")
        } finally {
            setLoading(false)
        }
    }, [uuid])

    useEffect(() => {
        loadHabitat()
    }, [loadHabitat])

    const submitChange = useCallback(async () => {
        if (!uuid) {
            return
        }

        const errors = validateHabitat(habitatName,habitatDescription)
        setFieldErrors({
            habitatName: errors.name,
            habitatDescription: errors.description
        })
        if (Object.keys(errors).length) {
            return
        }

        setLoading(true)
        setError(null)

        try {
            const payload: HabitatUpdate = {
                name: habitatName.trim(),
                description: habitatDescription.trim() || null
            }
            await updateHabitat(uuid, payload)
            navigate(DASHBOARD_ROUTES.HABITATS.DETAIL(uuid))
        } catch {
            setError("Impossible de modifier l'habitat")
        } finally {
            setLoading(false)
        }
    }, [habitatName, habitatDescription, uuid, navigate])

    const uploadPicture = useCallback(async (file: File) => {
        if (!uuid) {
            return
        }
        setLoading(true)
        setError(null)
        try {
            await updateHabitatPicture(uuid, file, habitat?.pictures?.[0]?.uuid)
            await loadHabitat()
        } catch {
            setError("Impossible d'uploader l'image")
        } finally {
            setLoading(false)
        }
    }, [habitat?.pictures, loadHabitat, uuid])

    return {
        habitat,
        loading,
        error,
        setError,
        notFound,
        habitatName,
        setHabitatName,
        habitatDescription,
        setHabitatDescription,
        fieldErrors,
        submitChange,
        uploadPicture
    }
}