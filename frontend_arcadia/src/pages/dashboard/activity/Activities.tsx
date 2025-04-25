import {
    JSX,
    useState,
    useEffect
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
import { ActivityListItem } from "@models/activity"

import { MessageBox } from "@components/common/MessageBox"
import { Button } from "@components/form/Button"

import { getRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"


export function Activities (): JSX.Element {

    const [activities, setActivites] = useState<ActivityListItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [showEmptyInfo, setShowEmptyInfo] = useState<boolean>(false)

    useEffect(() => {
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
                    onClick={() => console.log('Ajouter')}
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

        </>
        
    )
}