import { JSX, useState } from 'react'

import { DASHBOARD_ROUTES } from '@routes/paths'

import { PawPrint, SquarePen, Trash2 } from "lucide-react"

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from '@components/dashboard/DashboardSection'
import { Card, CardMedia, CardHeader, CardContent } from "@components/dashboard/Card"

import { DeleteModal } from '@components/common/DeleteModal'
import { MessageBox } from "@components/common/MessageBox"
import { ReturnButton } from '@components/common/ReturnLink'
import { Button } from '@components/form/Button'

import placeholderPicture from "@assets/common/placeholder.png"

import { formatDate } from "@utils/formatters"
import { useAnimalDetail } from '@hook/animal/useAnimalDetail'

export function AnimalDetail(): JSX.Element {
    const [showDelete, setShowDelete] = useState<boolean>(false)

    const {
        animal,
        loading,
        error, setError,
        removeAnimal
    } = useAnimalDetail()


    if (!animal) {
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
                <MessageBox message="Aucun animal trouvé" variant="warning" onClose={() => {}}/>
            </>
        )
    }

    return (
        <>
            <DashboardSection>
                <ReturnButton />
            </DashboardSection>

            <DashboardPageHeader 
                icon={<PawPrint size={30} />}
                title="Détail de l'animal"
            />

            <DashboardSection className="button-section">
                <Button
                    to={DASHBOARD_ROUTES.ANIMALS.EDIT(animal.uuid)}
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

            { !loading && !error && animal && (
                <DashboardSection className="animal-content">
                    <Card orientation="vertical" className="animal-content-info">
                        <div className="dashboard-card-body">
                            <CardMedia
                                src={animal.pictures && animal.pictures.length > 0 ? animal.pictures[0].path : placeholderPicture}
                                className="media-filled-rectangle"
                            />
                            <div className="dashboard-card-item">
                                <CardHeader className="text-bigcontent text-primary">{animal.name}</CardHeader>
                                <div className="dashboard-card-pair">
                                    <CardContent className="text-content text-bold text-accent">Espèce</CardContent>
                                    <CardContent className="text-content text-primary">{animal.speciesName}</CardContent>
                                </div>

                                <div className="dashboard-card-pair">
                                    <CardContent className="text-content text-bold text-accent">Sexe</CardContent>
                                    <CardContent className="text-content text-primary">{animal.isMale ? "Mâle" : "Femelle"}</CardContent>
                                </div>

                                <div className="dashboard-card-pair">
                                    <CardContent className="text-content text-bold text-accent">Taille (cm)</CardContent>
                                    <CardContent className="text-content text-primary">{`${animal.size} cm`}</CardContent>
                                </div>

                                <div className="dashboard-card-pair">
                                    <CardContent className="text-content text-bold text-accent">Poids (kg)</CardContent>
                                    <CardContent className="text-content text-primary">{`${animal.weight} kg`}</CardContent>
                                </div>

                                <div className="dashboard-card-pair">
                                    <CardContent className="text-content text-bold text-accent">Stérilisé</CardContent>
                                    <CardContent className="text-content text-primary">{animal.isFertile ? "Non" : "Oui"}</CardContent>
                                </div>

                                <div className="dashboard-card-pair">
                                    <CardContent className="text-content text-bold text-accent">Date de naissance</CardContent>
                                    <CardContent className="text-content text-primary">{formatDate(animal.birthDate)}</CardContent>
                                </div>

                                <div className="dashboard-card-pair">
                                    <CardContent className="text-content text-bold text-accent">Date d'arrivée</CardContent>
                                    <CardContent className="text-content text-primary">{formatDate(animal.arrivalDate)}</CardContent>
                                </div>

                                <div className="dashboard-card-pair">
                                    <CardContent className="text-content text-bold text-accent">Habitat</CardContent>
                                    <CardContent className="text-content text-primary">{animal.habitatName ? animal.habitatName : "Aucun habitat"}</CardContent>
                                </div>
                            </div>
                        </div>
                    </Card>
                </DashboardSection>
            )}

            <DeleteModal
                isOpen={showDelete}
                title="Êtes-vous sûr de vouloir supprimer l'animal ?"
                message="Cette action est irréversible. Cela supprimera l'animal et toutes les données associées."
                onConfirm={async () => {
                    await removeAnimal()
                    setShowDelete(false)
                }}
                onCancel={() => setShowDelete(false)}
                disabled={loading}
            />

        </>
    )
}