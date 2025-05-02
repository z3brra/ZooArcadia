import {
    JSX,
    useState,
    useEffect,
    useCallback
} from "react"
import {
    LandPlot,
    PlusCircle,
    Funnel
} from "lucide-react"

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from "@components/dashboard/DashboardSection"
import { DashboardPagination, PaginatedResponse } from "@components/dashboard/DashboardPagination"

import { ActivityList } from "@components/dashboard/activity/ActivityList"
import { ActivityListItem, ActivityCreate } from "@models/activity"

import { CreateModal } from "@components/common/CreateModal"
import { Input } from "@components/form/Input"
import { MessageBox } from "@components/common/MessageBox"
import { Button } from "@components/form/Button"

import { getRequest, postRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"


export function Activities (): JSX.Element {

    const [showCreate, setShowCreate] = useState<boolean>(false)

    const [activities, setActivites] = useState<ActivityListItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [showEmptyInfo, setShowEmptyInfo] = useState<boolean>(false)

    const [activityName, setActivityName] = useState<string>("")
    const [activityDescription, setActivityDescription] = useState<string>("")
    const [fieldErrors, setFieldErrors] = useState<{
        name?: string
        description?: string
    }>({})

    const fectchActivities = useCallback(async () => {
        const fetchActivities = async () => {
            setLoading(false)
            setError(null)
            try {
                const activitiesResponse = await getRequest<PaginatedResponse<ActivityListItem>>(
                    `${Endpoints.ACTIVITY}?page=${currentPage}`
                )
                setActivites(activitiesResponse.data)
                setTotalPages(activitiesResponse.totalPages)
                if (activitiesResponse.data.length === 0) {
                    setShowEmptyInfo(true)
                }
            } catch (errorResponse) {
                console.error("Error when fetching activities ", errorResponse)
                setError("Impossible de charger la liste des activités")
            } finally {
                setLoading(false)
            }
        }
        fetchActivities()
    }, [currentPage])

    useEffect(() => {
        fectchActivities()
    }, [fectchActivities])

    const validateFields = () => {
        const errors: typeof fieldErrors = {}
        if (!activityName.trim()) {
            errors.name = "Le nom de l'activité est requis."
        } else if (activityName.length < 2) {
            errors.name = "Le nom doit faire plus de 2 caractères."
        } else if (activityName.length > 36) {
            errors.name = "Le nom ne doit pas dépasser 36 caractères."
        }
        
        if (activityDescription.trim() && activityDescription.length < 10) {
            errors.description = "La description doit faire plus de 10 caractères."
        }
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async () => {
        setError(null)

        if (!validateFields()) {
            return
        }

        setLoading(true)
        try {
            const payload: ActivityCreate = {
                name: activityName.trim(),
                description: activityDescription.trim() || null
            }
            await postRequest<ActivityCreate, ActivityListItem>(
                `${Endpoints.ACTIVITY}/create`,
                payload
            )

            setActivityName("")
            setActivityDescription("")

            setCurrentPage(1)
            setShowCreate(false)
            await fectchActivities()
        } catch (errorResponse) {
            console.error("Error when creating activity ", errorResponse)
            setError("Impossible de créer l'habitat.")
        } finally {
            setLoading(false)
        }
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

            { !loading && !error && showEmptyInfo && (
                <MessageBox variant="info" message="Aucune activité trouvé" onClose={() => setShowEmptyInfo(false)}/>
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
                onSubmit={() => {
                    handleSubmit()
                }}
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
                        { fieldErrors.name && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.name}
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
                        { fieldErrors.description && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.description}
                            </div>
                        )}
                    </div>
                </form>
            </CreateModal>

        </>
        
    )
}