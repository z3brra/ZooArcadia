import { JSX } from "react"
import { Leaf } from "lucide-react"
import { DashboardPageHeader } from "../../components/dashboard/DashboardPageHeader"

export function Habitats (): JSX.Element {
    return (
        <DashboardPageHeader 
            icon={<Leaf size={30} />}
            title="Habitats"
            description="Gérer et visualiser vos habitats"
        />
    )
}