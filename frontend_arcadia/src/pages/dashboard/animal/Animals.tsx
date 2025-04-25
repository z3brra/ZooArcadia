import {
    JSX,
    useState,
    useEffect
} from "react"
import { 
    PawPrint,
    PlusCircle,
    Funnel
} from "lucide-react"
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from "@components/dashboard/DashboardSection"
import { DashboardPagination, PaginatedResponse } from "@components/dashboard/DashboardPagination"

import { AnimalList } from "@components/dashboard/animal/AnimalList"
import { AnimalListItem } from "@models/animal"

import { MessageBox } from "@components/common/MessageBox"
import { Button } from "@components/form/Button"

import { getRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"

export function Animals (): JSX.Element {

    const [animals, setAnimals] = useState<AnimalListItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [showEmptyInfo, setShowEmptyInfo] = useState<boolean>(false)

    useEffect(() => {
        const fetchAnimals = async () => {
            setLoading(true)
            setError(null)
            try {
                const animalResponse = await getRequest<PaginatedResponse<AnimalListItem>>(
                    `${Endpoints.ANIMAL}?page=${currentPage}`
                )
                setAnimals(animalResponse.data)
                setTotalPages(animalResponse.totalPages)
                if (animalResponse.data.length === 0) {
                    setShowEmptyInfo(true)
                }
            } catch (errorResponse) {
                console.error("Error when fetching animal ", errorResponse)
                setError("Impossible de charger la liste des animaux")
            } finally {
                setLoading(false)
            }
        }
        fetchAnimals()
    }, [currentPage])

    return (
        <>
            <DashboardPageHeader 
                icon={<PawPrint size={30} />}
                title="Animaux"
                description="Gérer et visualiser vos animaux"
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
                <MessageBox variant="info" message="Aucun animal trouvé" onClose={() => setShowEmptyInfo(false)}/>
            )}

            { !loading && !error && animals.length > 0 && (
                <AnimalList items={animals} />
            )}

            { !loading && !error && animals.length > 0 && totalPages > 1 && (
                <DashboardPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

        </>
    )
}