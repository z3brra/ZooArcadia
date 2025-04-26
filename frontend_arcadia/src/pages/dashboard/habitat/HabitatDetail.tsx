import { JSX, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { DASHBOARD_ROUTES } from '@routes/paths'

import {
    Leaf,
    SquarePen,
    Trash2,
    PawPrint,
    PencilRuler
} from "lucide-react"

import { Habitat } from '@models/habitat'

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from '@components/dashboard/DashboardSection'
import { 
    Card,
    CardMedia,
    CardHeader,
    CardContent
} from '@components/dashboard/Card'

import { MessageBox } from "@components/common/MessageBox"
import { ReturnButton } from '@components/common/ReturnLink'
import { Button } from '@components/form/Button'

import { getRequest } from '@api/request'
import { Endpoints } from '@api/endpoints'

import { Dropdown, DropdownItem, DropdownLabel } from '@components/common/Dropdown'
import { CommonLink } from '@components/common/CommonLink'

import placeholderPicture from "@assets/common/placeholder.png"

export function HabitatDetail(): JSX.Element {
    const { uuid } = useParams<{ uuid: string }>()

    const [habitat, setHabitat] = useState<Habitat | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [showEmptyInfo, setShowEmptyInfo] = useState<boolean>(false)

    useEffect(() => {
        const fetchHabitat = async () => {
            setLoading(true)
            setError(null)
            try {
                const habitatResponse = await getRequest<Habitat>(
                    `${Endpoints.HABITAT}/${uuid}`
                )
                setHabitat(habitatResponse)
                if (!habitatResponse) {
                    setShowEmptyInfo(true)
                }
            } catch (errorResponse) {
                console.error("Error when fetching habitat ", errorResponse)
                setError("Impossible de charger l'habitat")
            } finally {
                setLoading(false)
            }
        }
        
        if (uuid) {
            fetchHabitat()
        }
    }, [uuid])


    return (
        <>
            <DashboardSection>
                <ReturnButton />
            </DashboardSection>

            <DashboardPageHeader 
                icon={<Leaf size={30} />}
                title="Détail de l'habitat"
            />

            <DashboardSection className="button-section">
                <Button
                    variant="white"
                    icon={<SquarePen size={20} />}
                    onClick={() => console.log('Modifier')}
                    className="text-content"
                >
                    Modifier
                </Button>
                <Button
                    variant="delete"
                    icon={<Trash2 size={20} />}
                    onClick={() => console.log('Supprimer')}
                    className="text-content"
                >
                    Supprimer
                </Button>
            </DashboardSection>

            { error && (
                <MessageBox variant="error" message={error} onClose={() => setError(null)} />
            )}

            { !loading && !error && showEmptyInfo && (
                <MessageBox variant="info" message="Aucun habitat trouvé" onClose={() => setShowEmptyInfo(false)} />
            )}

            { !loading && !error && habitat && (
                <DashboardSection className="habitat-content">
                    <Card orientation="vertical" className="habitat-content-infos">
                        <div className="dashboard-card-body">
                            <CardMedia
                                src={habitat.pictures && habitat.pictures.length > 0 ? habitat.pictures[0].path : placeholderPicture}
                                className="media-filled-rectangle"
                            />
                            <div className="dashboard-card-item">
                                <CardHeader className="text-bigcontent text-primary">{habitat.name}</CardHeader>
                                <CardContent className="text-small text-silent">{habitat.description}</CardContent>
                            </div>
                        </div>
                    </Card>

                    <Card orientation="vertical" className="habitat-content-infos">
                        <div className="dashboard-card-item">
                            <CardHeader className="text-bigcontent text-primary">Animaux dans l'habitat</CardHeader>
                            <CardContent className="text-small text-silent">{`Animaux : ${habitat.animalCount}`}</CardContent>
                        </div>
                        <Dropdown triggerText="Voir les animaux">
                            {/* La boucle se fera au dessus */}
                            <div className="dropdown-item">
                                <DropdownItem
                                    leftItems={[
                                        { icon: <PawPrint size={20} />, text: "Simba", itemClassName: "text-content text-primary"},
                                        { icon: <PencilRuler size={20} />, text: "Lion d'Afrique", itemClassName: "text-content text-silent"}
                                    ]}
                                />
                                <DropdownLabel variant="green" label='Bonne santé' />
                            </div>
                            <div className="dropdown-item">
                                <DropdownItem
                                    leftItems={[
                                        { icon: <PawPrint size={20} />, text: "Nala", itemClassName: "text-content text-primary"},
                                        { icon: <PencilRuler size={20} />, text: "Lion d'Afrique", itemClassName: "text-content text-silent"}
                                    ]}
                                />
                                <DropdownLabel variant="yellow" label='Fatigué' />
                            </div>
                            <CommonLink to={DASHBOARD_ROUTES.ANIMALS.TO} text="Voir tout les animaux" />
                        </Dropdown>
                    </Card>

                    <Card orientation="vertical" className="habitat-content-infos">
                        <CardHeader className="text-bigcontent text-primary">Rapports d'habitat</CardHeader>
                    </Card>
                </DashboardSection>
            )}
        </>
    )
}