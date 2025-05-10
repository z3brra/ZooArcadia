import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { Animal } from "@models/animal"

import { fetchOneAnimal, deleteAnimal } from "@services/animalService"

export function useAnimalDetail() {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const [animal, setAnimal] = useState<Animal | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [notFound, setNotFound] = useState<boolean>(false)

    const loadAnimal = useCallback(async () => {
        if (!uuid) {
            return
        }
        setLoading(true)
        setError(null)
        try {
            const animalResponse = await fetchOneAnimal(uuid)
            setAnimal(animalResponse)
            if (!animalResponse) {
                setNotFound(true)
            }
        } catch {
            setError("Impossible de charger l'animal")
        } finally {
            setLoading(false)
        }
    }, [uuid])

    const removeAnimal = useCallback(async () => {
        if (!uuid) {
            return
        }
        setLoading(true)
        setError(null)
        try {
            await deleteAnimal(uuid)
            navigate(DASHBOARD_ROUTES.ANIMALS.TO)
        } catch {
            setError("Impossible de supprimer l'animal")
        } finally {
            setLoading(false)
        }
    }, [uuid, navigate])

    useEffect(() => {
        loadAnimal()
    }, [loadAnimal])

    return {
        animal,
        loading,
        error, setError,
        notFound,
        removeAnimal
    }
}