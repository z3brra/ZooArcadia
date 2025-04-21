import { JSX } from "react"
import {
    Leaf,
    PlusCircle
} from "lucide-react"
import { DashboardPageHeader } from "../../components/dashboard/DashboardPageHeader"
import { DashboardSection } from "../../components/dashboard/DashboardSection"
import { Button } from "../../components/form/Button"

export function Habitats (): JSX.Element {
    return (
        <>
            <DashboardPageHeader 
                icon={<Leaf size={30} />}
                title="Habitats"
                description="Gérer et visualiser vos habitats"
            />

            <DashboardSection className="button-section">
                <Button
                    variant="primary"
                    icon={<PlusCircle size={20} />}
                    onClick={() => console.log('Ajouter')}
                    className="text-content"
                >
                    Ajouter
                </Button>
            </DashboardSection>
        </>
    )
}