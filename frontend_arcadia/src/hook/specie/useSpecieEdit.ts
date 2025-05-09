import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { fetchOneSpecie, updateSpecie } from "@services/specieService"
import { validateSpecie } from "@utils/validation"

import { Specie, SpecieUpdate } from "@models/species"

export function useSpecieEdit() {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const [specie, setSpecie] = useState<Specie | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [notFound, setNotFound] = useState<boolean>(false)

    const [specieCommonName, setSpecieCommonName] = useState<string>("")
    const [specieScientificName, setSpecieScientificName] = useState<string>("")
    const [specieLifespan, setSpecieLifespan] = useState<string>("")
    const [specieDiet, setSpecieDiet] = useState<string>("")
    const [specieDescription, setSpecieDescription] = useState<string>("")

    const [fieldErrors, setFieldErrors] = useState<{
        specieCommonName?: string
        specieScientificName?: string
        specieLifespan?: string
        specieDiet?: string
        specieDescription?: string
    }>({})

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
            setSpecieCommonName(specieResponse.commonName)
            setSpecieScientificName(specieResponse.scientificName)
            setSpecieLifespan(specieResponse.lifespan)
            setSpecieDiet(specieResponse.diet)
            setSpecieDescription(specieResponse.description)
        } catch {
            setError("Impossible de charger l'espèce")
        } finally {
            setLoading(false)
        }
    }, [uuid])

    useEffect(() => {
        loadSpecie()
    }, [loadSpecie])

    const submitChange = useCallback(async () => {
        if (!uuid) {
            return
        }
        const errors = validateSpecie(
            specieCommonName,
            specieScientificName,
            specieLifespan,
            specieDiet,
            specieDescription
        )
        setFieldErrors({
            specieCommonName: errors.commonName,
            specieScientificName: errors.scientificName,
            specieLifespan: errors.lifespan,
            specieDiet: errors.diet,
            specieDescription: errors.description
        })
        if (Object.keys(errors).length) {
            return false
        }

        setLoading(true)
        setError(null)

        try {
            const payload: SpecieUpdate = {
                commonName: specieCommonName.trim(),
                scientificName: specieScientificName.trim(),
                lifespan: specieLifespan.trim(),
                diet: specieDiet.trim(),
                description: specieDescription.trim()
            }
            await updateSpecie(uuid, payload)
            navigate(DASHBOARD_ROUTES.SPECIES.DETAIL(uuid))
        } catch {
            setError("Impossible de modifier l'espèce")
        } finally {
            setLoading(false)
        }
    }, [
        specieCommonName,
        specieScientificName,
        specieLifespan,
        specieDiet,
        specieDescription,
        uuid,
        navigate
    ])

    return {
        specie,
        loading,
        error,
        setError,
        notFound,
        specieCommonName,
        setSpecieCommonName,
        specieScientificName,
        setSpecieScientificName,
        specieLifespan,
        setSpecieLifespan,
        specieDiet,
        setSpecieDiet,
        specieDescription,
        setSpecieDescription,
        fieldErrors,
        submitChange
    }
}
