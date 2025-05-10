import { JSX, useRef } from 'react'

import { DASHBOARD_ROUTES } from '@routes/paths'

import { PawPrint, XCircle, Save, Image} from 'lucide-react'

import { DashboardPageHeader } from '@components/dashboard/DashboardPageHeader'
import { DashboardSection } from '@components/dashboard/DashboardSection'

import { Card, CardMedia } from '@components/dashboard/Card'

import { MessageBox } from '@components/common/MessageBox'
import { ReturnButton } from '@components/common/ReturnLink'
import { Button } from "@components/form/Button"
import { Input } from "@components/form/Input"
import { CustomSelect, SelectOption } from "@components/form/CustomSelect"

import placeholderPicture from "@assets/common/placeholder.png"
import { useAnimalEdit } from '@hook/animal/useAnimalEdit'

export function AnimalEdit(): JSX.Element {
    const {
        animal,
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

        submitChange,
        uploadPicture
    } = useAnimalEdit()

    const SEX: SelectOption[] = [
        { value: true, label: "Mâle"},
        { value: false, label: "Femelle"},
    ]
    const FERTILE: SelectOption[] = [
        { value: true, label: "Non" },
        { value: false, label: "Oui" },
    ]

    const fileInputRef = useRef<HTMLInputElement>(null)

    const onClickChangePicture = () => {
        fileInputRef.current?.click()
    }

    const onFilechange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            uploadPicture(file)
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    if (!animal) {
        if (loading) {
            if (loading) {
                return (
                    <MessageBox variant="info" message="Chargement..." onClose={() => {}}/>
                )
            }
        }
        return (
            <>
                <DashboardSection>
                    <ReturnButton />
                </DashboardSection>
                <MessageBox message="Aucun habitat trouvé" variant="warning" onClose={() => {}}/>
            </>
        )
    }

    return (
        <>
            <DashboardPageHeader
                icon={<PawPrint size={30} />}
                title="Modifier l'animal"
            />

            <DashboardSection className="button-section">
                <Button
                    to={DASHBOARD_ROUTES.ANIMALS.DETAIL(animal.uuid)}
                    variant="white"
                    icon={<XCircle size={20} />}
                    className="text-content"
                >
                    Annuler
                </Button>
                <Button
                    variant="primary"
                    icon={<Save size={20} />}
                    disabled={loading}
                    onClick={submitChange}
                    className="text-content"
                >
                    Enregistrer
                </Button>
            </DashboardSection>

            { error && (
                <MessageBox variant="error" message={error} onClose={() => setError(null)} />
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
                            { fieldErrors.animalName && (
                                <div className="modal-form-field-error text-small">
                                    {fieldErrors.animalName}
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
                                { fieldErrors.animalSpeciesUuid && (
                                    <div className="modal-form-field-error text-small">
                                        {fieldErrors.animalSpeciesUuid}
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
                            { fieldErrors.animalIsMale && (
                                <div className="modal-form-field-error text-small">
                                    {fieldErrors.animalIsMale}
                                </div>
                            )}

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
                        </form>
                    </Card>
                </DashboardSection>
            )}
        </>
    )
}
