import { JSX, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { DASHBOARD_ROUTES } from '@routes/paths'

import {
    PawPrint,
    SquarePen,
    Trash2
} from "lucide-react"

import { Animal } from '@models/animal'

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from '@components/dashboard/DashboardSection'
import {
    Card,
    CardMedia,
    CardHeader,
    CardContent
} from "@components/dashboard/Card"

import { DeleteModal } from '@components/common/DeleteModal'
import { MessageBox } from "@components/common/MessageBox"
import { ReturnButton } from '@components/common/ReturnLink'
import { Button } from '@components/form/Button'
// import { Dropdown, DropdownItem, DropdownLabel } from '@components/common/Dropdown'
// import { CommonLink } from '@components/common/CommonLink'

import { deleteRequest, getRequest } from '@api/request'
import { Endpoints } from '@api/endpoints'

import placeholderPicture from "@assets/common/placeholder.png"

import { formatDate } from "@utils/formatters"

export function AnimalDetail(): JSX.Element {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const [showDelete, setShowDelete] = useState<boolean>(false)

    const [animal, setAnimal] = useState<Animal | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [showEmptyInfo, setShowEmptyInfo] = useState<boolean>(false)

    useEffect(() => {
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

    const handleDelete = async () => {
        setLoading(true)
        setError(null)
        try {
            await deleteRequest<void>(
                `${Endpoints.ANIMAL}/${uuid}`
            )
        } catch (errorResponse) {
            console.error("Error when delete animal ", errorResponse)
            setError("Impossible de supprimer l'espèce animale")
        } finally {
            setLoading(false)
            setShowDelete(false)
            navigate(DASHBOARD_ROUTES.ANIMALS.TO)
        }
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
                    to={DASHBOARD_ROUTES.ANIMALS.EDIT(uuid!)}
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
                onConfirm={handleDelete}
                onCancel={() => setShowDelete(false)}
                disabled={loading}
            />

        </>
    )
}