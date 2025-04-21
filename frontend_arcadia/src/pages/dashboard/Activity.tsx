import { JSX } from "react"
import { LandPlot } from "lucide-react"
import { DashboardPageHeader } from "../../components/dashboard/DashboardPageHeader"


export function Activity (): JSX.Element {
    return (
        <DashboardPageHeader 
            icon={<LandPlot size={30} />}
            title="Activités"
            description="Gérer et visualiser vos activités"
        />
    )
}