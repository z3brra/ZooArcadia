import { JSX, useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { PencilRuler, XCircle, Save } from "lucide-react"

import { Specie, SpecieUpdate } from "@models/species"

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from "@components/dashboard/DashboardSection"

import { Card } from "@components/dashboard/Card"

import { MessageBox } from "@components/common/MessageBox"
import { Button } from "@components/form/Button"
import { Input } from "@components/form/Input"
import { CustomSelect, SelectOption } from "@components/form/CustomSelect"

import { getRequest, putRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"

export function SpeciesEdit(): JSX.Element {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const [specie, setSpecie] = useState<Specie | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [showEmptyInfo, setShowEmptyInfo] = useState<boolean>(false)

    const [specieCommonName, setSpecieCommonName] = useState<string>("")
    const [specieScientificName, setSpecieScientificName] = useState<string>("")
    const [specieLifespan, setSpecieLifespan] = useState<string>("")
    const [specieDiet, setSpecieDiet] = useState<string>("")
    const DIET: SelectOption[] = [
        { value: "CARNIVOROUS", label: "Carnivore"},
        { value: "HERBIVOROUS", label: "Herbivore"},
        { value: "OMNIVOROUS", label: "Omnivore"},
    ]
    const [specieDescription, setSpecieDescription] = useState<string>("")

    const [fieldErrors, setFieldErrors] = useState<{
        commonName?: string
        scientificName?: string
        lifespan?: string
        diet?: string
        description?: string
    }>({})

    const fectchSpecie = useCallback( async () => {
        const fetchSpecie = async () => {
            setLoading(true)
            setError(null)
            try {
                const specieResponse = await getRequest<Specie>(
                    `${Endpoints.SPECIES}/${uuid}`
                )
                setSpecie(specieResponse)
                if (!specieResponse) {
                    setShowEmptyInfo(true)
                }
                setSpecieCommonName(specieResponse.commonName)
                setSpecieScientificName(specieResponse.scientificName)
                setSpecieLifespan(specieResponse.lifespan)
                setSpecieDiet(specieResponse.diet)
                setSpecieDescription(specieResponse.description)

            } catch (errorResponse) {
                console.error("Error when fetching specie ", errorResponse)
                setError("Impossible de charger l'espèce")
            } finally {
                setLoading(false)
            }
        }
        if (uuid) {
            fetchSpecie()
        }
    }, [uuid])

    useEffect(() => {
        fectchSpecie()
    }, [fectchSpecie])

    const validateFields = () => {
        const errors: typeof fieldErrors = {}

        if (!specieCommonName.trim()) {
            errors.commonName = "Le nom commun est requis."
        } else if (specieCommonName.length < 2) {
            errors.commonName = "Le nom commun doit faire plus de 2 caractères."
        } else if (specieCommonName.length > 255) {
            errors.commonName = "Le nom commun ne doit pas dépasser 255 caractères."
        }

        if (!specieScientificName.trim()) {
            errors.scientificName = "Le nom scientifique est requis."
        } else if (specieScientificName.length < 2) {
            errors.scientificName = "Le nom scientifique doit faire plus de 2 caratères."
        } else if (specieScientificName.length > 255) {
            errors.scientificName = "Le nom scientifique ne doit pas dépasser 255 caractères."
        }

        if (!specieLifespan.trim()) {
            errors.lifespan = "La durée de vie est requise."
        } else if (specieLifespan.length < 2) {
            errors.lifespan = "La durée de vie doit faire plus de 2 caractères."
        } else if (specieLifespan.length > 255) {
            errors.lifespan = "La durée de vie ne doit ps dépasser 255 caractères."
        }

        if (!specieDiet.trim()) {
            errors.diet = "Le régime alimentaire est requis."
        }

        if (!specieDescription.trim()) {
            errors.description = "La description est requise."
        } else if (specieDescription.length < 10) {
            errors.description = "La description doit faire plus de 10 caractères."
        }

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async () => {
            setError(null)

            if (!validateFields()) {
                return
            }

            setLoading(true)
            try {
                const payload: SpecieUpdate = {
                    commonName: specieCommonName.trim(),
                    scientificName: specieScientificName.trim(),
                    lifespan: specieLifespan.trim(),
                    diet: specieDiet.trim(),
                    description: specieDescription.trim()
                }
                await putRequest<SpecieUpdate, Specie>(
                    `${Endpoints.SPECIES}/${uuid}`,
                    payload
                )
                navigate(DASHBOARD_ROUTES.SPECIES.DETAIL(uuid!))
            } catch (errorResponse) {
                console.error("Error when creating species", errorResponse)
                setError("Impossible de créer l'espèce animale.")
            } finally {
                setLoading(false)
            }
        }

    return (
        <>
            <DashboardPageHeader
                icon={<PencilRuler size={30} />}
                title="Modifier l'espèce"
            />

            <DashboardSection className="button-section">
                <Button
                    to={DASHBOARD_ROUTES.SPECIES.DETAIL(uuid!)}
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
                <MessageBox variant="info" message="Aucune espèce trouvée" onClose={() => setShowEmptyInfo(false)} />
            )}

            { !loading && !error && specie && (
                <DashboardSection className="specie-content">
                    <Card orientation="vertical" className="specie-content-infos">
                        <form noValidate className="dashboard-card-item">
                            <Input
                                type="string"
                                textSize="text-content"
                                label="Nom commun"
                                placeholder="Saisir le nom commun"
                                value={specieCommonName}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSpecieCommonName(event.currentTarget.value)}
                            />
                            { fieldErrors.commonName && (
                                <div className="modal-form-field-error text-small">
                                    {fieldErrors.commonName}
                                </div>
                            )}

                            <Input
                                type="string"
                                label="Nom scientifique"
                                placeholder="Saisir le nom scientifique"
                                value={specieScientificName}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSpecieScientificName(event.currentTarget.value)}
                            />
                            { fieldErrors.scientificName && (
                                <div className="modal-form-field-error text-small">
                                    {fieldErrors.scientificName}
                                </div>
                            )}

                            <Input
                                type="string"
                                label="Durée de vie"
                                placeholder="Saisir la durée de vie"
                                value={specieLifespan}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSpecieLifespan(event.currentTarget.value)}
                            />
                            { fieldErrors.lifespan && (
                                <div className="modal-form-field-error text-small">
                                    {fieldErrors.lifespan}
                                </div>
                            )}

                            <CustomSelect
                                label="Régime alimentaire"
                                placeholder="Choisir le régime"
                                options={DIET}
                                value={specieDiet}
                                onChange={setSpecieDiet}
                            />
                            { fieldErrors.diet && (
                                <div className="modal-form-field-error text-small">
                                    {fieldErrors.diet}
                                </div>
                            )}

                            <Input
                                type="textarea"
                                label="Description"
                                placeholder="Saisir la description"
                                value={specieDescription}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSpecieDescription(event.currentTarget.value)}
                            />
                            { fieldErrors.description && (
                                <div className="modal-form-field-error text-small">
                                    {fieldErrors.description}
                                </div>
                            )}
                        </form>
                    </Card>
                </DashboardSection>
            )}

        </>
    )
}