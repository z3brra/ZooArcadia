import { JSX } from "react"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { PencilRuler, XCircle, Save } from "lucide-react"

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from "@components/dashboard/DashboardSection"

import { Card } from "@components/dashboard/Card"

import { MessageBox } from "@components/common/MessageBox"
import { ReturnButton } from '@components/common/ReturnLink'
import { Button } from "@components/form/Button"
import { Input } from "@components/form/Input"
import { CustomSelect, SelectOption } from "@components/form/CustomSelect"

import { useSpecieEdit } from "@hook/specie/useSpecieEdit"

export function SpeciesEdit(): JSX.Element {
    const {
        specie,
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
        submitChange
    } = useSpecieEdit()

    const DIET: SelectOption[] = [
        { value: "CARNIVOROUS", label: "Carnivore"},
        { value: "HERBIVOROUS", label: "Herbivore"},
        { value: "OMNIVOROUS", label: "Omnivore"},
    ]

    if (!specie) {
        if (loading) {
            return (
                <MessageBox variant="info" message="Chargement..." onClose={() => {}}/>
            )
        }
        return (
            <>
                <DashboardSection>
                    <ReturnButton />
                </DashboardSection>
                <MessageBox message="Aucune espèce trouvée" variant="warning" onClose={() => {}}/>
            </>
        )
    }

    return (
        <>
            <DashboardPageHeader
                icon={<PencilRuler size={30} />}
                title="Modifier l'espèce"
            />

            <DashboardSection className="button-section">
                <Button
                    to={DASHBOARD_ROUTES.SPECIES.DETAIL(specie.uuid)}
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
                            { fieldErrors.specieCommonName && (
                                <div className="modal-form-field-error text-small">
                                    {fieldErrors.specieCommonName}
                                </div>
                            )}

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
                        </form>
                    </Card>
                </DashboardSection>
            )}

        </>
    )
}