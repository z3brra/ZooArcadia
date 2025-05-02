import { JSX, useState, useEffect, useCallback } from "react"
import { PawPrint, PlusCircle, Funnel } from "lucide-react"
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from "@components/dashboard/DashboardSection"
import { DashboardPagination, PaginatedResponse } from "@components/dashboard/DashboardPagination"

import { AnimalList } from "@components/dashboard/animal/AnimalList"
import { AnimalCreate, AnimalListItem } from "@models/animal"
import { SpeciesAllList, SpeciesAllResponse } from "@models/species"
import { HabitatAllList, HabitatAllResponse } from "@models/habitat"

import { CreateModal } from "@components/common/CreateModal"
import { MessageBox } from "@components/common/MessageBox"
import { Button } from "@components/form/Button"
import { Input } from "@components/form/Input"
import { CustomSelect, SelectOption } from "@components/form/CustomSelect"


import { getRequest, postRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"
import { isValidDate } from "@utils/dateUtils"



export function Animals (): JSX.Element {

    const [showCreate, setShowCreate] = useState<boolean>(false)

    const [animals, setAnimals] = useState<AnimalListItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [showEmptyInfo, setShowEmptyInfo] = useState<boolean>(false)

    const [animalName, setAnimalName] = useState<string>("")
    const [animalIsMale, setAnimalIsMale] = useState<boolean | null>(null)
    const SEX: SelectOption[] = [
        { value: true, label: "Mâle"},
        { value: false, label: "Femelle"},
    ]
    const [animalSize, setAnimalSize] = useState<number | null>(null)
    const [animalWeight, setAnimalWeight] = useState<number | null>(null)
    const [animalIsFertile, setAnimalIsFertile] = useState<boolean | null>(null)
    const FERTILE: SelectOption[] = [
        { value: true, label: "Non" },
        { value: false, label: "Oui" },
    ]
    const [animalBirthDate, setAnimalBirthDate] = useState<string>("")
    const [animalArrivalDate, setAnimalArrivalDate] = useState<string>("")

    const [animalSpeciesUuid, setAnimalSpeciesUuid] = useState<string>("")
    const [speciesOptions, setSpeciesOptions] = useState<SelectOption[]>([])
    const [speciesOptionsError, setSpeciesOptionsError] = useState<string | null>(null)

    const [animalHabitatUuid, setAnimalHabitatUuid] = useState<string | null>(null)
    const [habitatOptions, setHabitatOptions] = useState<SelectOption[]>([])
    const [habitatOptionsError, setHabitatOptionsError] = useState<string | null>(null)

    const [fieldErrors, setFieldsErrors] = useState<{
        name?: string
        isMale?: string
        size?: string
        weight?: string
        isFertile?: string
        birthDate?: string
        arrivalDate?: string
        speciesUuid?: string
        habitatUuid?: string
    }>({})

    const fetchAnimals = useCallback( async () => {
        const fetchAnimals = async () => {
            setLoading(true)
            setError(null)
            try {
                const animalResponse = await getRequest<PaginatedResponse<AnimalListItem>>(
                    `${Endpoints.ANIMAL}?page=${currentPage}`
                )
                setAnimals(animalResponse.data)
                setTotalPages(animalResponse.totalPages)
                if (animalResponse.data.length === 0) {
                    setShowEmptyInfo(true)
                }
            } catch (errorResponse) {
                console.error("Error when fetching animal ", errorResponse)
                setError("Impossible de charger la liste des animaux")
            } finally {
                setLoading(false)
            }
        }
        fetchAnimals()
    }, [currentPage])

    useEffect(() => {
        fetchAnimals()
    }, [fetchAnimals])

    useEffect(() => {
        const loadSpecies = async () => {
            setSpeciesOptionsError(null)
            try {
                const speciesResponse = await getRequest<SpeciesAllResponse<SpeciesAllList>>(
                    `${Endpoints.SPECIES}/all`
                )
                setSpeciesOptions(
                    speciesResponse.data.map((specie) => ({ value: specie.uuid, label: specie.commonName}))
                )
            } catch {
                setSpeciesOptionsError("Impossible de charger la liste des espèces")
            }
        }
        loadSpecies()
    }, [])

    useEffect(() => {
        const loadHabitat = async () => {
            setHabitatOptionsError(null)
            try {
                const habitatResponse = await getRequest<HabitatAllResponse<HabitatAllList>>(
                    `${Endpoints.HABITAT}/all`
                )
                setHabitatOptions(habitatResponse.data.map((habitat) => ({ value: habitat.uuid, label: habitat.name})))
            } catch {
                setHabitatOptionsError("Impossible de charger la liste des habitats")
            }
        }
        loadHabitat()
    }, [])

    const validateFields = () => {
        const errors: typeof fieldErrors = {}
        if (!animalName.trim()) {
            errors.name = "Le nom de l'animal est requis."
        } else if (animalName.length < 2) {
            errors.name = "Le nom doit faire plus de 2 caractères."
        } else if (animalName.length > 36) {
            errors.name = "Le nom ne doit pas faire plus de 36 caractères."
        }

        if (animalIsMale === null) {
            errors.isMale = "Le sexe de l'animal est requis."
        }

        if (animalSize === null) {
            errors.size = "La taille est requise."
        } else if (animalSize <= 0) {
            errors.size = "La taille doit être un nombre positif"
        }

        if (animalWeight === null) {
            errors.weight = "Le poids est requis."
        } else if (animalWeight <= 0) {
            errors.weight = "Le poids doit être un nombre positif"
        }

        if (animalIsFertile === null) {
            errors.isFertile = "L'état de l'animal est requis."
        }

        if (!animalBirthDate) {
            errors.birthDate = "La date de naissance est requise."
        } else if (!isValidDate(animalBirthDate)) {
            errors.birthDate = "Format de date invalide."
        }

        if (!animalArrivalDate) {
            errors.arrivalDate = "La date d'arrivée est requise."
        } else if (!isValidDate(animalArrivalDate)) {
            errors.arrivalDate = "Format de date invalide."
        }

        if (!animalSpeciesUuid.trim()) {
            errors.speciesUuid = "L'espèce est requise."
        }

        setFieldsErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async () => {
        setError(null)

        if (!validateFields()) {
            return
        }

        setLoading(true)
        try {
            const payload: AnimalCreate = {
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
            await postRequest<AnimalCreate, AnimalListItem>(
                `${Endpoints.ANIMAL}/create`,
                payload
            )
            setAnimalName("")
            setAnimalIsMale(null)
            setAnimalSize(null)
            setAnimalWeight(null)
            setAnimalIsFertile(null)
            setAnimalBirthDate("")
            setAnimalArrivalDate("")
            setAnimalSpeciesUuid("")
            setAnimalHabitatUuid("")

            setCurrentPage(1)
            await fetchAnimals()
            setShowCreate(false)
        } catch (errorResponse) {
            console.error("Error when creating animal ", errorResponse)
            setError("Impossible de créer l'animal")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <DashboardPageHeader 
                icon={<PawPrint size={30} />}
                title="Animaux"
                description="Gérer et visualiser vos animaux"
            />
            <DashboardSection className="button-section">
                <Button
                    variant="white"
                    icon={<Funnel size={20} />}
                    onClick={() => console.log('Filtrer')}
                    className="text-content"
                >
                    Filtrer
                </Button>
                <Button
                    variant="primary"
                    icon={<PlusCircle size={20} />}
                    onClick={() => setShowCreate(true)}
                    className="text-content"
                >
                    Ajouter
                </Button>
            </DashboardSection>

            { error && (
                <MessageBox variant="error" message={error} onClose={() => setError(null)} />
            )}

            { !loading && !error && showEmptyInfo && (
                <MessageBox variant="info" message="Aucun animal trouvé" onClose={() => setShowEmptyInfo(false)}/>
            )}

            { !loading && !error && animals.length > 0 && (
                <AnimalList items={animals} />
            )}

            { !loading && !error && animals.length > 0 && totalPages > 1 && (
                <DashboardPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <CreateModal
                isOpen={showCreate}
                title="Ajouter animal"
                message="Entrer les informations de l'animal"
                onCancel={() => setShowCreate(false)}
                onSubmit={() => handleSubmit()}
                disabled={loading}
            >
                <form noValidate className="modal-body">
                    <div className="modal-form-field">
                        <Input
                            type="string"
                            label="Nom"
                            placeholder="Saisir le nom"
                            value={animalName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAnimalName(event.currentTarget.value)}
                        />
                        { fieldErrors.name && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.name}
                            </div>
                        )}
                    </div>

                    <div className="modal-form-field">
                        { speciesOptionsError ? (
                            <MessageBox variant="error" message={speciesOptionsError} onClose={() => setSpeciesOptionsError(null)} />
                        ) : (
                            <>
                            <CustomSelect
                                label="Espèce"
                                placeholder={speciesOptions.length === 0 ? "Aucune espèce" : "Selectionner l'espèce"}
                                options={speciesOptions}
                                value={animalSpeciesUuid}
                                onChange={setAnimalSpeciesUuid}
                                disabled={speciesOptions.length === 0}
                            />
                            { fieldErrors.speciesUuid && (
                                <div className="modal-form-field-error text-small">
                                    {fieldErrors.speciesUuid}
                                </div>
                            )}
                            </>
                        )}
                    </div>

                    <div className="modal-form-field">
                        <CustomSelect
                            label="Sexe"
                            placeholder="Selectionner le sexe"
                            options={SEX}
                            value={animalIsMale}
                            onChange={setAnimalIsMale}
                        />
                        { fieldErrors.isMale && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.isMale}
                            </div>
                        )}
                    </div>

                    <div className="modal-form-field">
                        <Input
                            type="number"
                            label="Taille (cm)"
                            placeholder="Saisir la taille"
                            value={animalSize!}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAnimalSize(event.currentTarget.valueAsNumber)}
                        />
                        { fieldErrors.size && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.size}
                            </div>
                        )}
                    </div>

                    <div className="modal-form-field">
                        <Input
                            type="number"
                            label="Poids (kg)"
                            placeholder="Saisir le poids"
                            value={animalWeight!}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAnimalWeight(event.currentTarget.valueAsNumber)}
                        />
                        { fieldErrors.weight && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.weight}
                            </div>
                        )}
                    </div>

                    <div className="modal-form-field">
                        <CustomSelect
                            label="Stérilisé"
                            placeholder="Selectionner l'état"
                            options={FERTILE}
                            value={animalIsFertile}
                            onChange={setAnimalIsFertile}
                        />
                        { fieldErrors.isFertile && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.isFertile}
                            </div>
                        )}
                    </div>

                    <div className="modal-form-field">
                        <Input
                            type="date"
                            label="Date de naissance"
                            placeholder="Saisir la date"
                            value={animalBirthDate}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAnimalBirthDate(event.currentTarget.value)}
                        />
                        { fieldErrors.birthDate && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.birthDate}
                            </div>
                        )}
                    </div>

                    <div className="modal-form-field">
                        <Input
                            type="date"
                            label="Date d'arrivée"
                            placeholder="Saisir la date"
                            value={animalArrivalDate}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAnimalArrivalDate(event.currentTarget.value)}
                        />
                        { fieldErrors.arrivalDate && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.arrivalDate}
                            </div>
                        )}
                    </div>

                    <div className="modal-form-field">
                        { habitatOptionsError ? (
                            <MessageBox variant="error" message={habitatOptionsError} onClose={() => setHabitatOptionsError(null)}/>
                        ) : (
                            <>
                                <CustomSelect
                                    label="Habitat"
                                    placeholder={habitatOptions.length === 0 ? "Aucun habitat" : "Selectionner l'habitat"}
                                    options={habitatOptions}
                                    value={animalHabitatUuid}
                                    onChange={setAnimalHabitatUuid}
                                    disabled={habitatOptions.length === 0}
                                />
                                { fieldErrors.habitatUuid && (
                                    <div className="modal-form-field-error text-small">
                                        {fieldErrors.habitatUuid}
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                </form>
            </CreateModal>

        </>
    )
}