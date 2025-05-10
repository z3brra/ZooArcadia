import { JSX, useState } from 'react'

import { DASHBOARD_ROUTES } from '@routes/paths'

import { LandPlot, SquarePen, Trash2, } from "lucide-react"

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from '@components/dashboard/DashboardSection'

import { Card, CardMedia, CardHeader, CardContent } from "@components/dashboard/Card"

import { DeleteModal } from '@components/common/DeleteModal'
import { MessageBox } from '@components/common/MessageBox'
import { ReturnButton } from '@components/common/ReturnLink'
import { Button } from '@components/form/Button'

import placeholderPicture from "@assets/common/placeholder.png"
import { useActivityDetail } from '@hook/activity/useActivityDetail'

export function ActivityDetail(): JSX.Element {
    const [showDelete, setShowDelete] = useState<boolean>(false)

    const {
        activity,
        loading,
        error, setError,
        removeActivity
    } = useActivityDetail()

    if (!activity) {
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
                <MessageBox message="Aucune activité trouvée" variant="warning" onClose={() => {}}/>
            </>
        )
    }

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
                    to={DASHBOARD_ROUTES.ACTIVITES.EDIT(activity.uuid)}
                    variant="white"
                    icon={<SquarePen size={20} />}
                    className="text-content"
                >
                    Modifier
                </Button>
                <Button
                    variant="delete"
                    icon={<Trash2 size={20} />}
                    disabled={loading}
                    onClick={() => setShowDelete(true)}
                    className="text-content"
                >
                    Supprimer
                </Button>
            </DashboardSection>

            { error && (
                <MessageBox variant="error" message={error} onClose={() => setError(null)} />
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
                onConfirm={async () => {
                    await removeActivity(),
                    setShowDelete(false)
                }}
                onCancel={() => setShowDelete(false)}
                disabled={loading}
            />
        </>
    )
}
