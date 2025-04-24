import { JSX, useState, useEffect } from "react"
import {
    PencilRuler,
    PlusCircle,
    Funnel
} from "lucide-react"
import { DashboardPageHeader } from "../../components/dashboard/DashboardPageHeader"
import { DashboardSection } from "../../components/dashboard/DashboardSection"
import { DashboardPagination, PaginatedResponse } from "../../components/dashboard/DashboardPagination"

import { SpeciesList } from "../../components/dashboard/species/SpeciesList"
import { SpeciesListItem } from "@models/species"

import { MessageBox } from "../../components/common/MessageBox"
import { Button } from "../../components/form/Button"

import { getRequest } from "../../api/request"
import { Endpoints } from "../../api/endpoints"


export function Species (): JSX.Element {
    const [species, setSpecies] = useState<SpeciesListItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [showEmptyInfo, setShowEmptyInfo] = useState<boolean>(false)

    useEffect(() => {
        const fetchSpecies = async () => {
            setLoading(true)
            setError(null)
            try {
                const speciesResponse = await getRequest<PaginatedResponse<SpeciesListItem>>(
                    `${Endpoints.SPECIES}?page=${currentPage}`
                )
                setSpecies(speciesResponse.data)
                setTotalPages(speciesResponse.totalPages)
                if (speciesResponse.data.length === 0) {
                    setShowEmptyInfo(true)
                }
            } catch (errorResponse) {
                console.error("Error when fetching species ", errorResponse)
                setError("Impossible de charger la liste des espèce animales")
            } finally {
                setLoading(false)
            }
        }
        fetchSpecies()
    }, [currentPage])


    return (
        <>
            <DashboardPageHeader 
                icon={<PencilRuler size={30} />}
                title="Espèces animales"
                description="Gérer et visualiser vos espèces animales"
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
                <MessageBox variant="info" message="Aucune espèce trouvé" onClose={() => setShowEmptyInfo(false)}/>
            )}

            { !loading && !error && species.length > 0 && (
                <SpeciesList items={species} />
            )}


            { !loading && !error && species.length > 0 && totalPages > 1 && (
                <DashboardPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            ) }
        </>
    )
}