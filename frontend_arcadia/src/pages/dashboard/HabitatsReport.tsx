import { JSX } from "react"
import { 
    Sprout,
    PlusCircle,
    Funnel
} from "lucide-react"
import { DashboardPageHeader } from "../../components/dashboard/DashboardPageHeader"
import { DashboardSection } from "../../components/dashboard/DashboardSection"
import { Button } from "../../components/form/Button"


export function HabitatsReport (): JSX.Element {
    return (
        <>
            <DashboardPageHeader 
                icon={<Sprout size={30} />}
                title="Rapports habitats"
                description="Gérer et visualiser vos rapports habitats"
            />

            <DashboardSection className="button-section">
                <Button
                    variant="white"
                    icon={<Funnel size={20} />}
                    onClick={() => console.log('Filtrer')}
                    className="text-content"
                >
                    Filtrer
                </Button>
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