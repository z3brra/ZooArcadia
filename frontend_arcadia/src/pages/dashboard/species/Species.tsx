import { JSX, useState } from "react"
import { PencilRuler, PlusCircle, Funnel } from "lucide-react"
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from "@components/dashboard/DashboardSection"
import { DashboardPagination } from "@components/dashboard/DashboardPagination"

import { SpeciesList } from "@components/dashboard/species/SpeciesList"

import { MessageBox } from "@components/common/MessageBox"
import { Button } from "@components/form/Button"
import { CreateModal } from "@components/common/CreateModal"
import { Input } from "@components/form/Input"

import { CustomSelect, SelectOption } from "@components/form/CustomSelect"
import { useSpecies } from "@hook/specie/useSpecies"


export function Species (): JSX.Element {

    const [showCreate, setShowCreate] = useState<boolean>(false)

    const {
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
    } = useSpecies()

    const DIET: SelectOption[] = [
        { value: "CARNIVOROUS", label: "Carnivore"},
        { value: "HERBIVOROUS", label: "Herbivore"},
        { value: "OMNIVOROUS", label: "Omnivore"},
    ]

    const handleSubmit = async () => {
        const isCreated = await submitCreation(
            specieCommonName,
            specieScientificName,
            specieLifespan,
            specieDiet,
            specieDescription
        )
        if (!isCreated) {
            return
        }
        setShowCreate(false)
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

            { !loading && !error && species.length === 0 && (
                <MessageBox variant="info" message="Aucune espèce trouvé" onClose={() => {}}/>
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
                        { fieldErrors.specieCommonName && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.specieCommonName}
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
                        { fieldErrors.specieScientificName && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.specieScientificName}
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
                        { fieldErrors.specieLifespan && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.specieLifespan}
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
                        { fieldErrors.specieDiet && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.specieDiet}
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
                        { fieldErrors.specieDescription && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.specieDescription}
                            </div>
                        )}
                    </div>
                </form>
            </CreateModal>

        </>
    )
}