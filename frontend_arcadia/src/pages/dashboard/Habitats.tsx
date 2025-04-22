import { JSX, useState, useEffect } from "react"
import {
    Leaf,
    PlusCircle
} from "lucide-react"
import { DashboardPageHeader } from "../../components/dashboard/DashboardPageHeader"
import { DashboardSection } from "../../components/dashboard/DashboardSection"
import { DashboardPagination } from "../../components/dashboard/DashboardPagination"

import { HabitatsList, Habitat } from "../../components/dashboard/habitat/HabitatList"

import { MessageBox } from "../../components/common/MessageBox"
import { Button } from "../../components/form/Button"

import { getRequest } from "../../api/request"
import { Endpoints } from "../../api/endpoints"

interface PaginatedResponse<T> {
    data: T[]
    total: number
    totalPages: number
    currentPage: number
    perPage: number
}

export function Habitats (): JSX.Element {

    const [habitats, setHabitats] = useState<Habitat[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [showEmptyInfo, setShowEmptyInfo] = useState<boolean>(false)

    useEffect(() => {
        const fetchHabitats = async () => {
            setLoading(true)
            setError(null)
            try {
                const habitatResponse = await getRequest<PaginatedResponse<Habitat>>(
                    `${Endpoints.HABITAT}?page=${currentPage}`
                )
                setHabitats(habitatResponse.data)
                setTotalPages(habitatResponse.totalPages)
                if (habitatResponse.data.length === 0) {
                    setShowEmptyInfo(true)
                }
            } catch (errorResponse) {
                console.error("Error when fecthing habitat ", errorResponse)
                setError("Impossible de charger la liste des habitats")
            } finally {
                setLoading(false)
            }
        }
        fetchHabitats()
    }, [currentPage])


    return (
        <>
            <DashboardPageHeader 
                icon={<Leaf size={30} />}
                title="Habitats"
                description="Gérer et visualiser vos habitats"
            />

            <DashboardSection className="button-section">
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
                <MessageBox variant='error' message={error} onClose={() => setError(null)}/>
            )}

            { !loading && !error && showEmptyInfo && (
                <MessageBox variant='info' message="Aucun habitat trouvé" onClose={() => setShowEmptyInfo(false)}/>
            )}

            { !loading && !error && habitats.length > 0 && (
                <HabitatsList items={habitats}/>
            )}

            { !loading && !error && habitats.length && totalPages > 1 && (
                <DashboardSection className="pagination-section">
                    <DashboardPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </DashboardSection>
            )}

        </>
    )
}

