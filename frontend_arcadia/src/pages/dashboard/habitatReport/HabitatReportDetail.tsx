import { JSX, useState } from "react"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { Sprout, SquarePen, Trash2 } from "lucide-react"

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from "@components/dashboard/DashboardSection"
import { Card, CardHeader, CardContent, CardLabel } from "@components/dashboard/Card"

import { DeleteModal } from "@components/common/DeleteModal"
import { MessageBox } from "@components/common/MessageBox"
import { ReturnButton } from "@components/common/ReturnLink"
import { Button } from "@components/form/Button"

import { formatDate, formatTime, formatStateLabel, formatStateLabelVariant } from "@utils/formatters"

import { useHabitatReportDetail } from "@hook/habitatReport/useHabitatReportsDetail"

export function HabitatReportDetail(): JSX.Element {
    const [showDelete, setShowDelete] = useState<boolean>(false)

    const {
        habitatReport,
        habitatAnimalCount,
        loading,
        error, setError,
        removeHabitatReport
    } = useHabitatReportDetail()

    if (!habitatReport) {
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
                <MessageBox message="Aucun rapport trouvé" variant="warning" onClose={() => {}}/>
            </>
        )
    }

    return (
        <>
            <DashboardSection>
                <ReturnButton />
            </DashboardSection>

            <DashboardPageHeader
                icon={<Sprout size={30} />}
                title="Détail du rapport"
                description={`${habitatReport.userFirstName} ${habitatReport.userLastName} le ${formatDate(habitatReport.createdAt)} à ${formatTime(habitatReport.createdAt)}`}
            />

            <DashboardSection className="button-section">
                <Button
                    // to={DASHBOARD_ROUTES}
                    variant="white"
                    icon={<SquarePen size={20} />}
                    className="text-content"
                    onClick={() => {console.log("modifier")}}
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

            { !loading && !error && habitatReport && (
                <DashboardSection className="habitat-report-content">
                    <Card orientation="vertical" className="habitat-report-content-infos">
                        <div className="dashboard-card-item">
                            <CardHeader className="text-bigcontent text-primary">Détail de l'habitat</CardHeader>
                            <div className="dashboard-card-pair-horizontal">
                                <CardContent className="text-content text-bold text-accent">Habitat :</CardContent>
                                <CardContent className="text-content text-primary">{habitatReport.habitatName}</CardContent>
                            </div>
                            <div className="dashboard-card-pair-horizontal">
                                <CardContent className="text-content text-bold text-accent">Nombre d'animaux :</CardContent>
                                <CardContent className="text-content text-primary">{habitatAnimalCount ? habitatAnimalCount : 'Aucun'}</CardContent>
                            </div>
                        </div>
                        <div className="dashboard-card-item">
                            <CardHeader className="text-bigcontent text-primary">Etat général de l'habitat</CardHeader>
                            <CardLabel label={formatStateLabel(habitatReport.state)} variant={formatStateLabelVariant(habitatReport.state)}/>
                        </div>
                        <div className="dashboard-card-item">
                            <CardHeader className="text-bigcontent text-primary">Rapport</CardHeader>
                            <CardContent className="text-content text-primary">{habitatReport.comment}</CardContent>
                        </div>
                    </Card>

                </DashboardSection>
            )}

            <DeleteModal
                isOpen={showDelete}
                title="Êtes-vous sûr de vouloir supprimer le rapport habitat ?"
                message="Cette action est irréversible. Cela supprimera le rapport et toutes les données associées."
                onConfirm={async () => {
                    await removeHabitatReport()
                    setShowDelete(false)
                }}
                onCancel={() => setShowDelete(false)}
                disabled={loading}
            />
        </>
    )
}