import { JSX, useState } from "react"
import { LandPlot, PlusCircle, Funnel } from "lucide-react"

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from "@components/dashboard/DashboardSection"
import { DashboardPagination } from "@components/dashboard/DashboardPagination"

import { ActivityList } from "@components/dashboard/activity/ActivityList"

import { CreateModal } from "@components/common/CreateModal"
import { Input } from "@components/form/Input"
import { MessageBox } from "@components/common/MessageBox"
import { Button } from "@components/form/Button"

import { useActivities } from "@hook/activity/useActivity"

export function Activities (): JSX.Element {
    const [showCreate, setShowCreate] = useState<boolean>(false)

    const {
        activities,
        currentPage, setCurrentPage,
        totalPages,
        loading,
        error, setError,
        activityName, setActivityName,
        activityDescription, setActivityDescription,
        fieldErrors,
        submitCreation
    } = useActivities()

    const handleSubmit = async () => {
        const isCreated = await submitCreation(activityName, activityDescription)
        if (!isCreated) {
            return
        }
        setShowCreate(false)
    }

    return (
        <>
            <DashboardPageHeader 
                icon={<LandPlot size={30} />}
                title="Activités"
                description="Gérer et visualiser vos activités"
            />
            <DashboardSection className="button-section">
                <Button
                    variant="white"
                    icon={<Funnel size={20} />}
                    onClick={() => console.log('Filtrer')}
                    className="text-content"
                >
                    Filtrer
                </Button>
                <Button
                    variant="primary"
                    icon={<PlusCircle size={20} />}
                    onClick={() => setShowCreate(true)}
                    className="text-content"
                >
                    Ajouter
                </Button>
            </DashboardSection>

            { error && (
                <MessageBox variant="error" message={error} onClose={() => setError(null)} />
            )}

            { !loading && !error && activities.length === 0 && (
                <MessageBox variant="info" message="Aucune activité trouvé" onClose={() => {}}/>
            )}

            { !loading && !error && activities.length > 0 && (
                <ActivityList items={activities} />
            )}

            { !loading && !error && activities.length > 0 && totalPages > 1 && (
                <DashboardPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            ) }

            <CreateModal
                isOpen={showCreate}
                title="Ajouter activité"
                message="Entrer les informations de l'activité"
                onCancel={() => setShowCreate(false)}
                onSubmit={handleSubmit}
                disabled={loading}
            >
                <form noValidate className="modal-body">
                    <div className="modal-form-field">
                        <Input
                            type="string"
                            label="Nom"
                            placeholder="Saisir le nom"
                            value={activityName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setActivityName(event.currentTarget.value)}
                        />
                        { fieldErrors.activityName && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.activityName}
                            </div>
                        )}
                    </div>
                    <div className="modal-form-field">
                        <Input
                            type="textarea"
                            label="Description"
                            placeholder="Saisir la description"
                            value={activityDescription}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setActivityDescription(event.currentTarget.value)}
                        />
                        { fieldErrors.activityDescription && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.activityDescription}
                            </div>
                        )}
                    </div>
                </form>
            </CreateModal>
        </>
    )
}