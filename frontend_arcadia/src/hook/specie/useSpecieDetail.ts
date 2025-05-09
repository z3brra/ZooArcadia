import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { Specie } from "@models/species"
import { AnimalListItem } from "@models/animal"
import { fetchSpecieAnimals, fetchOneSpecie, deleteSpecie } from "@services/specieService"

export function useSpecieDetail() {
    const { uuid } = useParams<{ uuid: string}>()
    const navigate = useNavigate()

    const [specie, setSpecie] = useState<Specie | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [notFound, setNotFound] = useState<boolean>(false)

    const [animals, setAnimals] = useState<AnimalListItem[]>([])
    const [animalsLoading, setAnimalsLoading] = useState<boolean>(false)
    const [animalsError, setAnimalsError] = useState<string | null>(null)

    const loadSpecie = useCallback(async () => {
        if (!uuid) {
            return
        }
        setLoading(true)
        setError(null)
        try {
            const specieResponse = await fetchOneSpecie(uuid)
            setSpecie(specieResponse)
            if (!specieResponse) {
                setNotFound(true)
            }
        } catch {
            setError("Impossible de charger l'espèce")
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
            const animalList = await fetchSpecieAnimals(uuid)
            setAnimals(animalList)
        } catch {
            setAnimalsError("Impossible de charger les animaux")
        } finally {
            setAnimalsLoading(false)
        }
    }, [uuid])

    const removeSpecie = useCallback(async () => {
        if (!uuid) {
            return
        }
        setLoading(true)
        setError(null)
        try {
            await deleteSpecie(uuid)
            navigate(DASHBOARD_ROUTES.SPECIES.TO)
        } catch {
            setError("Impossible de supprimer l'espèce")
        } finally {
            setLoading(false)
        }
    }, [uuid, navigate])

    useEffect(() => {
        loadSpecie()
    }, [loadSpecie])

    useEffect(() => {
        loadAnimals()
    }, [loadAnimals])

    return {
        specie,
        loading,
        error,
        setError,
        notFound,
        animals,
        animalsLoading,
        animalsError,
        removeSpecie
    }
}