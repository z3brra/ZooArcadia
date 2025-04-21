import { JSX } from "react"
import { Sprout } from "lucide-react"
import { DashboardPageHeader } from "../../components/dashboard/DashboardPageHeader"

export function HabitatsReport (): JSX.Element {
    return (
        <DashboardPageHeader 
            icon={<Sprout size={30} />}
            title="Rapports habitats"
            description="Gérer et visualiser vos rapports habitats"
        />
    )
}