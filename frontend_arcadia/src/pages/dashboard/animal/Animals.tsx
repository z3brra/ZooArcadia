import { JSX, useState } from "react"
import { PawPrint, PlusCircle, Funnel } from "lucide-react"
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from "@components/dashboard/DashboardSection"
import { DashboardPagination } from "@components/dashboard/DashboardPagination"

import { AnimalList } from "@components/dashboard/animal/AnimalList"

import { CreateModal } from "@components/common/CreateModal"
import { MessageBox } from "@components/common/MessageBox"
import { Button } from "@components/form/Button"
import { Input } from "@components/form/Input"
import { CustomSelect, SelectOption } from "@components/form/CustomSelect"

import { useAnimals } from "@hook/animal/useAnimals"

export function Animals (): JSX.Element {

    const [showCreate, setShowCreate] = useState<boolean>(false)

    const {
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
    } = useAnimals()

    const SEX: SelectOption[] = [
        { value: true, label: "Mâle"},
        { value: false, label: "Femelle"},
    ]

    const FERTILE: SelectOption[] = [
        { value: true, label: "Non" },
        { value: false, label: "Oui" },
    ]

    const handleSubmit = async () => {
        const isCreated = await submitCreation(
            animalName,
            animalIsMale!,
            animalSize!,
            animalWeight!,
            animalIsFertile!,
            animalBirthDate,
            animalArrivalDate,
            animalSpeciesUuid,
            animalHabitatUuid!
        )
        if (!isCreated) {
            return
        }
        setShowCreate(false)
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

            { !loading && !error && animals.length === 0 && (
                <MessageBox variant="info" message="Aucun animal trouvé" onClose={() => {}}/>
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
                onSubmit={handleSubmit}
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
                        { fieldErrors.animalName && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.animalName}
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
                            { fieldErrors.animalSpeciesUuid && (
                                <div className="modal-form-field-error text-small">
                                    {fieldErrors.animalSpeciesUuid}
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
                        { fieldErrors.animalIsMale && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.animalIsMale}
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
                        { fieldErrors.animalSize && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.animalSize}
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
                        { fieldErrors.animalWeight && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.animalWeight}
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
                        { fieldErrors.animalIsFertile && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.animalIsFertile}
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
                        { fieldErrors.animalBirthDate && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.animalBirthDate}
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
                        { fieldErrors.animalArrivalDate && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.animalArrivalDate}
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
                                { fieldErrors.animalHabitatUuid && (
                                    <div className="modal-form-field-error text-small">
                                        {fieldErrors.animalHabitatUuid}
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