import { JSX, useState, useEffect, useCallback } from "react"
import { PencilRuler, PlusCircle, Funnel } from "lucide-react"
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from "@components/dashboard/DashboardSection"
import { DashboardPagination, PaginatedResponse } from "@components/dashboard/DashboardPagination"

import { SpeciesList } from "@components/dashboard/species/SpeciesList"
import { SpecieCreate, SpeciesListItem } from "@models/species"

import { MessageBox } from "@components/common/MessageBox"
import { Button } from "@components/form/Button"
import { CreateModal } from "@components/common/CreateModal"
import { Input } from "@components/form/Input"
// import { Select, SelectOption } from "@components/form/Select"

import { getRequest, postRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"
import { CustomSelect, SelectOption } from "@components/form/CustomSelect"


export function Species (): JSX.Element {

    const [showCreate, setShowCreate] = useState<boolean>(false)

    const [species, setSpecies] = useState<SpeciesListItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
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

    const fetchSpecies = useCallback(async () => {
        const fetchSpecies = async () => {
            setLoading(true)
            setError(null)
            try {
                const speciesResponse = await getRequest<PaginatedResponse<SpeciesListItem>>(
                    `${Endpoints.SPECIES}?page=${currentPage}`
                )
                setSpecies(speciesResponse.data)
                setTotalPages(speciesResponse.totalPages)
                if (speciesResponse.data.length === 0) {
                    setShowEmptyInfo(true)
                }
            } catch (errorResponse) {
                console.error("Error when fetching species ", errorResponse)
                setError("Impossible de charger la liste des espèce animales")
            } finally {
                setLoading(false)
            }
        }
        fetchSpecies()
    }, [currentPage])

    useEffect(() => {
        fetchSpecies()
    }, [fetchSpecies])

    const validateFields = () => {
        const errors: typeof fieldErrors = {}
        
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
            const payload: SpecieCreate = {
                commonName: specieCommonName.trim(),
                scientificName: specieScientificName.trim(),
                lifespan: specieLifespan.trim(),
                diet: specieDiet.trim(),
                description: specieDescription.trim()
            }
            await postRequest<SpecieCreate, SpeciesListItem>(
                `${Endpoints.SPECIES}/create`,
                payload
            )
            setCurrentPage(1)
            setSpecieCommonName("")
            setSpecieScientificName("")
            setSpecieLifespan("")
            setSpecieDiet("")
            setSpecieDescription("")
            await fetchSpecies()
        } catch (errorResponse) {
            console.error("Error when creating species", errorResponse)
            setError("Impossible de créer l'espèce animale.")
        } finally {
            setLoading(false)
            setShowCreate(false)
        }
    }

    return (
        <>
            <DashboardPageHeader 
                icon={<PencilRuler size={30} />}
                title="Espèces animales"
                description="Gérer et visualiser vos espèces animales"
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
                <MessageBox variant="info" message="Aucune espèce trouvé" onClose={() => setShowEmptyInfo(false)}/>
            )}

            { !loading && !error && species.length > 0 && (
                <SpeciesList items={species} />
            )}


            { !loading && !error && species.length > 0 && totalPages > 1 && (
                <DashboardPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            ) }

            <CreateModal
                isOpen={showCreate}
                title="Ajouter espèce"
                message="Entrer les informations de l'espèce"
                onCancel={() => setShowCreate(false)}
                onSubmit={() => {
                    handleSubmit()
                }}
                disabled={loading}
            >
                <form noValidate className="modal-body">
                    <div className="modal-form-field">
                        <Input
                            type="string"
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
                    </div>

                    <div className="modal-form-field">
                        <Input
                            type="string"
                            label="Nom scientifique"
                            placeholder="Saisir le nom scientifique"
                            value={specieScientificName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSpecieScientificName(event.currentTarget.value)}
                        />
                        { fieldErrors.commonName && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.commonName}
                            </div>
                        )}
                    </div>

                    <div className="modal-form-field">
                        <Input
                            type="string"
                            label="Durée de vie"
                            placeholder="Saisir la durée de vie"
                            value={specieLifespan}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSpecieLifespan(event.currentTarget.value)}
                        />
                        { fieldErrors.commonName && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.commonName}
                            </div>
                        )}
                    </div>

                    <div className="modal-form-field">
                        <CustomSelect
                            label="Régime alimentaire"
                            placeholder="Choisir le régime"
                            options={DIET}
                            value={specieDiet}
                            onChange={setSpecieDiet}
                        />
                        { fieldErrors.commonName && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.commonName}
                            </div>
                        )}
                    </div>

                    <div className="modal-form-field">
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
                    </div>
                </form>
            </CreateModal>

        </>
    )
}