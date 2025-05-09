import { JSX, useState } from 'react'

import { DASHBOARD_ROUTES } from '@routes/paths'

import {
    PencilRuler,
    SquarePen,
    Trash2,
    PawPrint
} from "lucide-react"

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from '@components/dashboard/DashboardSection'
import { Card, CardHeader, CardContent } from '@components/dashboard/Card'

import { DeleteModal } from '@components/common/DeleteModal'
import { MessageBox } from "@components/common/MessageBox"
import { ReturnButton } from '@components/common/ReturnLink'
import { Button } from '@components/form/Button'
import { Dropdown, DropdownItem, DropdownLabel } from '@components/common/Dropdown'
import { CommonLink } from '@components/common/CommonLink'

import { formatDiet } from '@utils/formatters'
import { useSpecieDetail } from '@hook/specie/useSpecieDetail'

export function SpeciesDetail(): JSX.Element {
    const [showDelete, setShowDelete] = useState<boolean>(false)

    const {
        specie,
        loading,
        error,
        setError,
        animals,
        animalsLoading,
        animalsError,
        removeSpecie
    } = useSpecieDetail()

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
            <DashboardSection>
                <ReturnButton />
            </DashboardSection>

            <DashboardPageHeader 
                icon={<PencilRuler size={30} />}
                title="Détail de l'espèce"
            />

            <DashboardSection className="button-section">
                <Button
                    to={DASHBOARD_ROUTES.SPECIES.EDIT(specie.uuid)}
                    variant="white"
                    icon={<SquarePen size={20} />}
                    className="text-content"
                >
                    Modifier
                </Button>
                <Button
                    variant="delete"
                    icon={<Trash2 size={20} />}
                    onClick={() => setShowDelete(true)}
                    className="text-content"
                >
                    Supprimer
                </Button>
            </DashboardSection>

            { error && (
                <MessageBox variant="error" message={error} onClose={() => setError(null)} />
            )}

            { !loading && !error && specie && (
                <DashboardSection className="specie-content">
                    <Card orientation="vertical" className="specie-content-infos">
                        <div className="dashboard-card-item">
                            <div className="dashboard-card-pair">
                                <CardContent className="text-content text-bold text-accent">Nom commun</CardContent>
                                <CardContent className="text-content text-primary">{specie.commonName}</CardContent>
                            </div>
                            <div className="dashboard-card-pair">
                                <CardContent className="text-content text-bold text-accent">Nom scientifique</CardContent>
                                <CardContent className="text-content text-primary">{specie.scientificName}</CardContent>
                            </div>
                            <div className="dashboard-card-pair">
                                <CardContent className="text-content text-bold text-accent">Durée de vie</CardContent>
                                <CardContent className="text-content text-primary">{specie.lifespan}</CardContent>
                            </div>
                            <div className="dashboard-card-pair">
                                <CardContent className="text-content text-bold text-accent">Régime alimentaire</CardContent>
                                <CardContent className="text-content text-primary">{formatDiet(specie.diet)}</CardContent>
                            </div>
                            <div className="dashboard-card-pair">
                                <CardContent className="text-content text-bold text-accent">Description</CardContent>
                                <CardContent className="text-content text-primary">{specie.description}</CardContent>
                            </div>
                        </div>
                    </Card>

                    <Card orientation="vertical" className="habitat-content-infos">
                        <div className="dashboard-card-item">
                            <CardHeader className="text-bigcontent text-primary">Animaux de cette espèce</CardHeader>
                            <CardContent className="text-small text-silent">{`Animaux : ${specie.animalCount}`}</CardContent>
                        </div>
                        { !animalsLoading && !animalsError && animals.length > 0 && (
                            <Dropdown triggerText="Voir les animaux">
                                { animalsError && (
                                    <MessageBox variant="error" message={animalsError} onClose={() => {}} />
                                )}

                                { !animalsLoading && !animalsError && animals.map(animal => (
                                    <div key={animal.uuid} className="dropdown-item">
                                        <DropdownItem
                                            leftItems={[
                                                { icon: <PawPrint size={20} />, text: animal.name, itemClassName: "text-content text-primary"},
                                                { icon: <PencilRuler size={20} />, text: animal.speciesName, itemClassName: "text-content text-silent"}
                                            ]}
                                        />
                                        <DropdownLabel variant="grey" label='Aucun statut' />
                                    </div>
                                ))}
                                <CommonLink to={DASHBOARD_ROUTES.ANIMALS.TO} text="Voir tout les animaux" />
                            </Dropdown>
                        )}
                    </Card>
                </DashboardSection>
            )}

            <DeleteModal
                isOpen={showDelete}
                title="Êtes-vous sûr de vouloir supprimer l'espèce animale ?"
                message="Cette action est irréversible. Cela supprimera l'espèce animale et toutes les données associées."
                onConfirm={async () => {
                    await removeSpecie()
                    setShowDelete(false)
                }}
                onCancel={() => setShowDelete(false)}
                disabled={loading}
            />

        </>
    )
}