import { JSX } from "react"
import { PawPrint } from "lucide-react"
import { DashboardPageHeader } from "../../components/dashboard/DashboardPageHeader"

export function Animals (): JSX.Element {
    return (
        <DashboardPageHeader 
            icon={<PawPrint size={30} />}
            title="Animaux"
            description="Gérer et visualiser vos animaux"
        />
    )
}