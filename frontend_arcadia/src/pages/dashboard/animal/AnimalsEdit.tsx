import { JSX, useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { DASHBOARD_ROUTES } from '@routes/paths'

import { PawPrint, XCircle, Save, Image} from 'lucide-react'

import { Animal, AnimalUpdate } from '@models/animal'
import { SpeciesAllList, SpeciesAllResponse } from "@models/species"
import { HabitatAllList, HabitatAllResponse } from "@models/habitat"


import { DashboardPageHeader } from '@components/dashboard/DashboardPageHeader'
import { DashboardSection } from '@components/dashboard/DashboardSection'

import { Card, CardMedia } from '@components/dashboard/Card'

import { MessageBox } from '@components/common/MessageBox'
import { Button } from "@components/form/Button"
import { Input } from "@components/form/Input"
import { CustomSelect, SelectOption } from "@components/form/CustomSelect"

import { getRequest, putRequest, postFormRequest} from "@api/request"
import { Endpoints } from "@api/endpoints"
import { isValidDate } from "@utils/dateUtils"
import { formatDateForInput } from '@utils/formatters'

import placeholderPicture from "@assets/common/placeholder.png"

export function AnimalEdit(): JSX.Element {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const [animal, setAnimal] = useState<Animal | null>(null)
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

    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchAnimal = useCallback( async () => {
        const fectchAnimal = async () => {
            setLoading(true)
            setError(null)
            try {
                const animalResponse = await getRequest<Animal>(
                    `${Endpoints.ANIMAL}/${uuid}`
                )
                setAnimal(animalResponse)
                if (!animalResponse) {
                    setShowEmptyInfo(true)
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

            } catch (errorResponse) {
                console.error("Error when fetching animal ", errorResponse)
                setError("Impossible de charger l'animal")
            } finally {
                setLoading(false)
            }
        }
        if (uuid) {
            fectchAnimal()
        }
    }, [uuid])

    useEffect(() => {
        fetchAnimal()
    }, [fetchAnimal])

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
            await putRequest<AnimalUpdate, Animal>(
                `${Endpoints.ANIMAL}/${uuid}`,
                payload
            )
            navigate(DASHBOARD_ROUTES.ANIMALS.DETAIL(uuid!))
        } catch (errorResponse) {
            console.error("Error when creating animal ", errorResponse)
            setError("Impossible de créer l'animal")
        } finally {
            setLoading(false)
        }
    }

    const onClickChangePicture = () => {
        fileInputRef.current?.click()
    }

    const onFilechange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !uuid) {
            return
        }
        const allowed = /\.(jpe?g|png|webp)$/i
        if (!allowed.test(file.name)) {
            setError("Format d'image non supporté (jpg, png, webp).")
            return
        }

        const form = new FormData()
        form.append("image", file)

        setLoading(true)
        setError(null)

        try {
            if (animal?.pictures?.[0]?.uuid) {
                await postFormRequest<void>(
                    `${Endpoints.ANIMAL}/${uuid}/change-picture?pictureUuid=${animal.pictures[0].uuid}`,
                    form
                )
            } else {
                await postFormRequest<void>(
                    `${Endpoints.ANIMAL}/${uuid}/add-picture`,
                    form
                )
            }
            await fetchAnimal()
        } catch {
            setError("Impossible d'uploader l'image.")
        } finally {
            setLoading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    return (
        <>
            <DashboardPageHeader
                icon={<PawPrint size={30} />}
                title="Modifier l'animal"
            />

            <DashboardSection className="button-section">
                <Button
                    to={DASHBOARD_ROUTES.ANIMALS.DETAIL(uuid!)}
                    variant="white"
                    icon={<XCircle size={20} />}
                    className="text-content"
                >
                    Annuler
                </Button>
                <Button
                    variant="primary"
                    icon={<Save size={20} />}
                    onClick={() => handleSubmit()}
                    className="text-content"
                >
                    Enregistrer
                </Button>
            </DashboardSection>

            { error && (
                <MessageBox variant="error" message={error} onClose={() => setError(null)} />
            )}

            { !loading && !error && showEmptyInfo && (
                <MessageBox variant="info" message="Aucun animal trouvé" onClose={() => setShowEmptyInfo(false)} />
            )}

            { !loading && !error && animal && (
                <DashboardSection className="animal-content">
                    <Card orientation="vertical" className="animal-content-info">
                        <div className="dashboard-card-body">
                            <CardMedia
                                src={animal.pictures && animal.pictures.length > 0 ? animal.pictures[0].path : placeholderPicture}
                                className="media-filled-rectangle"
                                overlay={
                                    <Button
                                        variant="white"
                                        icon={<Image size={20} />}
                                        onClick={onClickChangePicture}
                                        className="text-small"
                                    >
                                        {animal.pictures?.length ? "Modifier" : "Ajouter"}
                                    </Button>
                                }
                            />
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={onFilechange}
                            />
                        </div>

                        <form noValidate className="dashboard-card-item">
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

                        </form>
                    </Card>
                </DashboardSection>
            )}


        </>
    )

}
