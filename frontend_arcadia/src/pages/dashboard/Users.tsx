import { JSX } from "react"
import { Users } from "lucide-react"
import { DashboardPageHeader } from "../../components/dashboard/DashboardPageHeader"

export function Employee (): JSX.Element {
    return (
        <DashboardPageHeader 
            icon={<Users size={30} />}
            title="Employés"
            description="Gérer et visualiser vos employés"
        />
    )
}