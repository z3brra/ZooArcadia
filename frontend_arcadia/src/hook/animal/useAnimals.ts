import { useState, useCallback, useEffect } from "react"
import { fetchAnimals, createAnimal } from "@services/animalService"
import { AnimalListItem, AnimalCreate } from "@models/animal"

import { fetchAllHabitats } from "@services/habitatService"
import { fetchAllSpecies } from "@services/specieService"

import { SelectOption } from "@components/form/CustomSelect"
import { validateAnimal } from "@utils/validation"

export function useAnimals(initialPage = 1) {
    const [animals, setAnimals] = useState<AnimalListItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(initialPage)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const [animalName, setAnimalName] = useState<string>("")
    const [animalIsMale, setAnimalIsMale] = useState<boolean | null>(null)
    const [animalSize, setAnimalSize] = useState<number | null>(null)
    const [animalWeight, setAnimalWeight] = useState<number | null>(null)
    const [animalIsFertile, setAnimalIsFertile] = useState<boolean | null>(null)
    const [animalBirthDate, setAnimalBirthDate] = useState<string>("")
    const [animalArrivalDate, setAnimalArrivalDate] = useState<string>("")

    const [animalSpeciesUuid, setAnimalSpeciesUuid] = useState<string>("")
    const [speciesOptions, setSpeciesOptions] = useState<SelectOption[]>([])
    const [speciesOptionsError, setSpeciesOptionsError] = useState<string | null>(null)

    const [animalHabitatUuid, setAnimalHabitatUuid] = useState<string | null>(null)
    const [habitatOptions, setHabitatOptions] = useState<SelectOption[]>([])
    const [habitatOptionsError, setHabitatOptionsError] = useState<string | null>(null)

    const [fieldErrors, setFieldsErrors] = useState<{
        animalName?: string
        animalIsMale?: string
        animalSize?: string
        animalWeight?: string
        animalIsFertile?: string
        animalBirthDate?: string
        animalArrivalDate?: string
        animalSpeciesUuid?: string
        animalHabitatUuid?: string
    }>({})

    const loadAnimals = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const animalsResponse = await fetchAnimals(currentPage)
            setAnimals(animalsResponse.data)
            setTotalPages(animalsResponse.totalPages)
        } catch {
            setError("Impossible de charger la liste des animaux")
        } finally {
            setLoading(false)
        }
    }, [currentPage])

    const loadOptions = useCallback(async () => {
        setSpeciesOptionsError(null)
        setHabitatOptionsError(null)

        try {
            const species = await fetchAllSpecies()
            setSpeciesOptions(
                species.data.map((specie) => ({ value: specie.uuid, label: specie.commonName}))
            )
        } catch {
            setSpeciesOptionsError("Impossible de charger la liste des espèces")
        }

        try {
            const habitats = await fetchAllHabitats()
            setHabitatOptions(
                habitats.data.map((habitat) => ({ value: habitat.uuid, label: habitat.name}))
            )
        } catch {
            setHabitatOptionsError("Impossible de charger la liste des habitats")
        }
    }, [])

    useEffect(() => {
        loadAnimals()
        loadOptions()
    }, [loadAnimals, loadOptions])

    const addAnimal = useCallback(async (payload: AnimalCreate) => {
        setLoading(true)
        setError(null)
        try {
            await createAnimal(payload)
            setCurrentPage(1)

            setAnimalName("")
            setAnimalIsMale(null)
            setAnimalSize(null)
            setAnimalWeight(null)
            setAnimalIsFertile(null)
            setAnimalBirthDate("")
            setAnimalArrivalDate("")
            setAnimalSpeciesUuid("")
            setAnimalHabitatUuid("")

            await loadAnimals()
        } catch {
            setError("Impossible de créer l'animal")
        } finally {
            setLoading(false)
        }
    }, [loadAnimals])

    const submitCreation = useCallback(async (
        animalName: string,
        animalIsMale: boolean,
        animalSize: number,
        animalWeight: number,
        animalIsFertile: boolean,
        animalBirthDate: string,
        animalArrivalDate: string,
        animalSpeciesUuid: string,
        animalHabitatUuid: string
    ) => {
        const errors = validateAnimal(
            animalName,
            animalIsMale,
            animalSize,
            animalWeight,
            animalIsFertile,
            animalBirthDate,
            animalArrivalDate,
            animalSpeciesUuid
        )
        setFieldsErrors({
            animalName: errors.name,
            animalIsMale: errors.isMale,
            animalSize: errors.size,
            animalWeight: errors.weight,
            animalIsFertile: errors.isFertile,
            animalBirthDate: errors.birthDate,
            animalArrivalDate: errors.arrivalDate,
            animalSpeciesUuid: errors.speciesUuid,
        })
        if (Object.keys(errors).length) {
            return false
        }
        setLoading(true)
        setError(null)

        const payload: AnimalCreate = {
            name: animalName.trim(),
            isMale: animalIsMale,
            size: animalSize,
            weight: animalWeight,
            isFertile: animalIsFertile,
            birthDate: animalBirthDate.trim(),
            arrivalDate: animalArrivalDate.trim(),
            speciesUuid: animalSpeciesUuid.trim(),
            habitatUuid: animalHabitatUuid ? animalHabitatUuid.trim() : null
        }
        await addAnimal(payload)
        setFieldsErrors({})
        return true
    }, [addAnimal])

    return {
        animals,
        currentPage, setCurrentPage,
        totalPages,
        loading,
        error, setError,

        animalName, setAnimalName,
        animalIsMale, setAnimalIsMale,
        animalSize, setAnimalSize,
        animalWeight, setAnimalWeight,
        animalIsFertile, setAnimalIsFertile,
        animalBirthDate, setAnimalBirthDate,
        animalArrivalDate, setAnimalArrivalDate,
        animalSpeciesUuid, setAnimalSpeciesUuid,
        speciesOptions,
        speciesOptionsError, setSpeciesOptionsError,
        animalHabitatUuid, setAnimalHabitatUuid,
        habitatOptions,
        habitatOptionsError, setHabitatOptionsError,

        fieldErrors,
        submitCreation,
    }
}
