import { JSX } from "react"
import { ClipboardList } from "lucide-react"
import { DashboardPageHeader } from "../../components/dashboard/DashboardPageHeader"

export function AnimalsReport (): JSX.Element {
    return (
        <DashboardPageHeader 
            icon={<ClipboardList size={30} />}
            title="Rapports animaliers"
            description="Gérer et visualiser vos rapports animaliers"
        />
    )
}