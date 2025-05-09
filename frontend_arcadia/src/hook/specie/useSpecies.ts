import { useState, useCallback, useEffect } from "react"
import { fetchSpecies, createSpecie } from "@services/specieService"
import { SpeciesListItem, SpecieCreate } from "@models/species"
import { validateSpecie } from "@utils/validation"

export function useSpecies(initialPage = 1) {
    const [species, setSpecies] = useState<SpeciesListItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(initialPage)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

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

    const loadSpecies = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const speciesResponse = await fetchSpecies(currentPage)
            setSpecies(speciesResponse.data)
            setTotalPages(speciesResponse.totalPages)
        } catch {
            setError("Impossible de charger la liste des espèces")
        } finally {
            setLoading(false)
        }
    }, [currentPage])

    useEffect(() => {
        loadSpecies()
    }, [loadSpecies])

    const addSpecie = useCallback(async (payload: SpecieCreate) => {
        setLoading(true)
        setError(null)
        try {
            await createSpecie(payload)

            setSpecieCommonName("")
            setSpecieScientificName("")
            setSpecieLifespan("")
            setSpecieDiet("")
            setSpecieDescription("")

            setCurrentPage(1)
            await loadSpecies()
        } catch {
            setError("Impossible de créer l'espèce")
        } finally {
            setLoading(false)
        }
    }, [loadSpecies])

    const submitCreation = useCallback(async (
        specieCommonName: string,
        specieScientificName: string,
        specieLifespan: string,
        specieDiet: string,
        specieDescription: string
    ) => {
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

        const payload: SpecieCreate = {
            commonName: specieCommonName.trim(),
            scientificName: specieScientificName.trim(),
            lifespan: specieLifespan.trim(),
            diet: specieDiet.trim(),
            description: specieDescription.trim()
        }
        await addSpecie(payload)
        setFieldErrors({})
        return true
    }, [addSpecie])

    return {
        species,
        currentPage,
        setCurrentPage,
        totalPages,
        loading,
        error,
        setError,
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
        submitCreation
    }
}