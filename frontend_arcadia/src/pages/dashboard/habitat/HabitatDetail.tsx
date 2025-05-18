import { JSX, useState } from 'react'

import { DASHBOARD_ROUTES } from '@routes/paths'

import {
    Leaf,
    SquarePen,
    Trash2,
    PawPrint,
    PencilRuler,
    CalendarDays,
    User
} from "lucide-react"

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from '@components/dashboard/DashboardSection'
import { Card, CardMedia, CardHeader, CardContent } from '@components/dashboard/Card'

import { DeleteModal } from '@components/common/DeleteModal'
import { MessageBox } from "@components/common/MessageBox"
import { ReturnButton } from '@components/common/ReturnLink'
import { Button } from '@components/form/Button'

import { Dropdown, DropdownItem, DropdownLabel } from '@components/common/Dropdown'
import { CommonLink } from '@components/common/CommonLink'

import placeholderPicture from "@assets/common/placeholder.png"
import { useHabitatDetail } from "@hook/habitat/useHabitatDetail"

import { formatDate, formatStateLabel, formatStateLabelVariant } from "@utils/formatters"

export function HabitatDetail(): JSX.Element {
    const {
        habitat,
        loading,
        error,
        setError,
        animals,
        animalsLoading,
        animalsError,
        reports,
        reportsLoading,
        reportsError,
        removeHabitat
    } = useHabitatDetail()

    const [showDelete, setShowDelete] = useState<boolean>(false)

    // A retirer / modifier quand j'aurais ajouter les spinners, et la page 404 (pour l'instant ça suffit)
    if (!habitat) {
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
                <MessageBox message="Aucun habitat trouvé" variant="warning" onClose={() => {}}/>
            </>
        )
    }

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
                    to={DASHBOARD_ROUTES.HABITATS.EDIT(habitat!.uuid)}
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

                    <Card orientation="vertical" className="habitat-content-infos">
                        <div className="dashboard-card-item">
                            <CardHeader className="text-bigcontent text-primary">Rapports d'habitat</CardHeader>
                        </div>
                        { !reportsLoading && !reportsError && reports.length > 0 && (
                            <Dropdown triggerText="Voir les rapports">
                                { reportsError && (
                                    <MessageBox variant="error" message={reportsError} onClose={() => {}} />
                                )}

                                { !reportsLoading && !reportsError && reports.map(report => (
                                    <div key={report.uuid} className="dropdown-item">
                                        <DropdownItem
                                            leftItems={[
                                                { icon: <CalendarDays size={20} />, text: formatDate(report.createdAt), itemClassName: "text-content text-primary"},
                                                { icon: <User size={20} />, text: `${report.userFirstName} ${report.userLastName}`, itemClassName: "text-content text-silent"}
                                            ]}
                                        />
                                        <DropdownLabel variant={formatStateLabelVariant(report.state)} label={formatStateLabel(report.state)} />
                                    </div>
                                ))}
                                <CommonLink to={DASHBOARD_ROUTES.HABITATS_REPORT.TO} text="Voir tout les rapports" />
                            </Dropdown>
                        )}
                    </Card>
                </DashboardSection>
            )}

            <DeleteModal
                isOpen={showDelete}
                title="Êtes-vous sûr de vouloir supprimer l'habitat ?"
                message="Cette action est irréversible. Cela supprimera l'habitat et toutes les données associées."
                onConfirm={async () => {
                    await removeHabitat()
                    setShowDelete(false)
                }}
                onCancel={() => setShowDelete(false)}
                disabled={loading}
            />
        </>
    )
}