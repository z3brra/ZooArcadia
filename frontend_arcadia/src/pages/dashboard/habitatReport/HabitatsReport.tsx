import { JSX } from "react"
import { Sprout, PlusCircle, Funnel } from "lucide-react"
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from "@components/dashboard/DashboardSection"
import { DashboardPagination } from "@components/dashboard/DashboardPagination"

import { Button } from "@components/form/Button"
import { MessageBox } from "@components/common/MessageBox"

import { useHabitatReports } from "@hook/habitatReport/useHabitatReports"
import { HabitatReportList } from "@components/dashboard/habitat/HabitatReportList"


export function HabitatsReport (): JSX.Element {
    const {
        habitatReports,
        currentPage, setCurrentPage,
        totalPages,
        loading,
        error, setError
    } = useHabitatReports()

    return (
        <>
            <DashboardPageHeader 
                icon={<Sprout size={30} />}
                title="Rapports habitats"
                description="Gérer et visualiser vos rapports habitats"
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
                <MessageBox variant='error' message={error} onClose={() => {setError(null)}}/>
            )}

            { !loading && !error && habitatReports.length === 0 && (
                <MessageBox variant='info' message="Aucun rapport trouvé" onClose={() => {}}/>
            )}

            { !loading && !error && habitatReports.length > 0 && (
                <HabitatReportList items={habitatReports} />
            )}

            { !loading && !error && habitatReports.length > 0 && totalPages > 1 && (
                <DashboardPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}


        </>
        
    )
}