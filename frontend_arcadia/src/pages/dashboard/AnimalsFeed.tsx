import { JSX } from "react"
import { Ham } from "lucide-react"
import { DashboardPageHeader } from "../../components/dashboard/DashboardPageHeader"

export function AnimalsFeed (): JSX.Element {
    return (
        <DashboardPageHeader 
            icon={<Ham size={30} />}
            title="Repas animaux"
            description="Gérer et visualiser vos repas animaux"
        />
    )
}