import { JSX, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import {
    LandPlot,
    SquarePen,
    Trash2,
} from "lucide-react"

import { Activity } from '@models/activity'

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from '@components/dashboard/DashboardSection'

import { Card, CardMedia, CardHeader, CardContent } from "@components/dashboard/Card"

import { DeleteModal } from '@components/common/DeleteModal'
import { MessageBox } from '@components/common/MessageBox'
import { ReturnButton } from '@components/common/ReturnLink'
import { Button } from '@components/form/Button'

import { getRequest } from '@api/request'
import { Endpoints } from '@api/endpoints'

import placeholderPicture from "@assets/common/placeholder.png"

export function ActivityDetail(): JSX.Element {
    const { uuid } = useParams<{ uuid: string }>()

    const [showDelete, setShowDelete] = useState<boolean>(false)

    const [activity, setActivity] = useState<Activity | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [showEmptyInfo, setShowEmptyInfo] = useState<boolean>(false)


    useEffect(() => {
        const fetchActivity = async () => {
            setLoading(true)
            setError(null)
            try {
                const activityResponse = await getRequest<Activity>(
                    `${Endpoints.ACTIVITY}/${uuid}`
                )
                setActivity(activityResponse)
                if (!activityResponse) {
                    setShowEmptyInfo(true)
                }
            } catch (errorResponse) {
                console.error("Error when fetching activity ", errorResponse)
                setError("Impossible de charger l'activité")
            } finally {
                setLoading(false)
            }
        }
        if (uuid) {
            fetchActivity()
        }
    }, [uuid])


    return (
        <>
            <DashboardSection>
                <ReturnButton />
            </DashboardSection>

            <DashboardPageHeader 
                icon={<LandPlot size={30} />}
                title="Détail de l'activité"
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
                <MessageBox variant="info" message="Aucune activité trouvée" onClose={() => setShowEmptyInfo(false)} />
            )}

            { !loading && !error && activity && (
                <DashboardSection className="activity-content">
                    <Card orientation="vertical" className="activity-content-infos">
                        <div className="dashboard-card-body">
                            <CardMedia
                                src={activity.pictures && activity.pictures.length > 0 ? activity.pictures[0].path : placeholderPicture}
                                className="media-filled-rectangle"
                            />
                            <div className="dashboard-card-item">
                                <CardHeader className="text-bigcontent text-primary">{activity.name}</CardHeader>
                                <CardContent className="text-small text-silent">{activity.description}</CardContent>
                            </div>
                        </div>
                    </Card>

                    { activity && activity.rates && (
                        <Card orientation="vertical" className="activity-content-infos">
                        <div className="dashboard-card-item">
                            <CardHeader className="text-bigcontent text-primary">Tarifs</CardHeader>
                            { activity.rates?.map(rate => (
                                <div key={rate.uuid} className="dashboard-card-pair">
                                    <CardContent className="text-small text-primary">{rate.title}</CardContent>
                                    <CardContent className="text-small text-silent">{rate.price > 0 ? `${rate.price} €` : "GRATUIT"}</CardContent>
                                </div>
                            ))}
                        </div>
                        </Card>
                    )}
                    { activity && !activity.rates && (
                        <Card orientation="vertical" className="activity-content-infos">
                        <div className="dashboard-card-item">
                            <CardHeader className="text-bigcontent text-primary">Tarifs</CardHeader>
                            <CardContent className="text-small text-silent">Aucun tarif</CardContent>
                        </div>
                        </Card>
                    )}
                </DashboardSection>
            )}


            <DeleteModal
                isOpen={showDelete}
                title="Êtes-vous sûr de vouloir supprimer l'activité ?"
                message="Cette action est irréversible. Cela supprimera l'activité et toutes les données associées."
                onConfirm={() => console.log("Confirm delete")}
                onCancel={() => setShowDelete(false)}
            />

        </>
    )
}
