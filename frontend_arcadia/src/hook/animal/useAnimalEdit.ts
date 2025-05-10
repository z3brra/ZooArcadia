import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { fetchOneAnimal, updateAnimal, updateAnimalPicture } from "@services/animalService"
import { validateAnimal } from "@utils/validation"

import { Animal, AnimalUpdate } from "@models/animal"

import { fetchAllHabitats } from "@services/habitatService"
import { fetchAllSpecies } from "@services/specieService"

import { SelectOption } from "@components/form/CustomSelect"
import { formatDateForInput } from "@utils/formatters"

export function useAnimalEdit() {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const [animal, setAnimal] = useState<Animal | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [notFound, setNotFound] = useState<boolean>(false)

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
            setAnimalName(animalResponse.name)
            setAnimalIsMale(animalResponse.isMale)
            setAnimalSize(animalResponse.size)
            setAnimalWeight(animalResponse.weight)
            setAnimalIsFertile(animalResponse.isFertile)
            setAnimalBirthDate(formatDateForInput(animalResponse.birthDate))
            setAnimalArrivalDate(formatDateForInput(animalResponse.arrivalDate))
            setAnimalSpeciesUuid(animalResponse.speciesUuid)
            setAnimalHabitatUuid(animalResponse.habitatUuid)
        } catch {
            
            setError("Impossible de charger l'animal")
        } finally {
            setLoading(false)
        }
    }, [uuid])

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
        loadAnimal()
        loadOptions()
    }, [loadAnimal, loadOptions])

    const submitChange = useCallback(async () => {
        if (!uuid) {
            return
        }
        const errors = validateAnimal(
            animalName,
            animalIsMale!,
            animalSize!,
            animalWeight!,
            animalIsFertile!,
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

        try {
            const payload: AnimalUpdate = {
                name: animalName.trim(),
                isMale: animalIsMale!,
                size: animalSize!,
                weight: animalWeight!,
                isFertile: animalIsFertile!,
                birthDate: animalBirthDate.trim(),
                arrivalDate: animalArrivalDate.trim(),
                speciesUuid: animalSpeciesUuid.trim(),
                habitatUuid: animalHabitatUuid ? animalHabitatUuid.trim() : null
            }
            await updateAnimal(uuid, payload)
            navigate(DASHBOARD_ROUTES.ANIMALS.DETAIL(uuid))
        } catch {
            setError("Impossible de modifier l'animal")
        } finally {
            setLoading(false)
        }
    }, [
        animalName,
        animalIsMale,
        animalSize,
        animalWeight,
        animalIsFertile,
        animalBirthDate,
        animalArrivalDate,
        animalSpeciesUuid,
        animalHabitatUuid,
        uuid,
        navigate
    ])

    const uploadPicture = useCallback(async (file: File) => {
        if (!uuid) {
            return
        }
        setLoading(true)
        setError(null)
        try {
            await updateAnimalPicture(uuid, file, animal?.pictures?.[0]?.uuid)
            await loadAnimal()
        } catch {
            setError("Impossible d'uploader l'image")
        } finally {
            setLoading(false)
        }
    }, [animal?.pictures, loadAnimal, uuid])

    return {
        animal,
        loading,
        error, setError,
        notFound,

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

        submitChange,
        uploadPicture
    }
}