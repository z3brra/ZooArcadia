import { JSX } from "react"
import { ChartPie } from "lucide-react"
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"

export function Statistics (): JSX.Element {
    return (
        <DashboardPageHeader 
            icon={<ChartPie size={30} />}
            title="Statistiques"
            description="Gérer et visualiser vos Statistiques"
        />
    )
}