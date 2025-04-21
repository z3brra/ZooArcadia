import { JSX } from "react"
import { PencilRuler } from "lucide-react"
import { DashboardPageHeader } from "../../components/dashboard/DashboardPageHeader"

export function Species (): JSX.Element {
    return (
        <DashboardPageHeader 
            icon={<PencilRuler size={30} />}
            title="Espèces animales"
            description="Gérer et visualiser vos espèces animales"
        />
    )
}