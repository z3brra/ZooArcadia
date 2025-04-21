import { JSX } from "react"
import { useAuth } from "../../../hook/AuthContext"
import { SideMenuOption } from "./DashboardMenuOption"
import {
    CircleGauge,
    Leaf,
    Sprout,
    PencilRuler,
    PawPrint,
    ClipboardList,
    Ham,
    LandPlot,
    MessagesSquare,
    Users,
    ChartPie,
    LogOut
} from 'lucide-react'
import { Button } from "../../form/Button"

export function DashboardSideMenuOptions (): JSX.Element {

    const { hasAnyRole, logout } = useAuth()

    return (
        <nav className="dashboard-side-menu-options">
            <SideMenuOption to="" end label="Dashboard" icon={<CircleGauge size={20} />} />
            { hasAnyRole('ROLE_ADMIN', 'ROLE_VET') && (
                <SideMenuOption to="habitats" label="Habitats" icon={<Leaf size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN', 'ROLE_VET') && (
                <SideMenuOption to="habitats-report" label="Rapports habitats" icon={<Sprout size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN') && (
                <SideMenuOption to="species" label="Espèces animales" icon={<PencilRuler size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN', 'ROLE_VET', 'ROLE_EMPLOYEE') && (
                <SideMenuOption to="animals" label="Animaux" icon={<PawPrint size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN', 'ROLE_VET') && (
                <SideMenuOption to="animals-report" label="Rapports animaliers" icon={<ClipboardList size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN', 'ROLE_VET', 'ROLE_EMPLOYEE') && (
                <SideMenuOption to="animals-feed" label="Repas" icon={<Ham size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN', 'ROLE_EMPLOYEE') && (
                <SideMenuOption to="activity" label="Activités" icon={<LandPlot size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN', 'ROLE_EMPLOYEE') && (
                <SideMenuOption to="reviews" label="Commentaires" icon={<MessagesSquare size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN') && (
                <SideMenuOption to="users" label="Personnel" icon={<Users size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN') && (
                <SideMenuOption to="statistics" label="Statistiques" icon={<ChartPie size={20} />} />
            )}
            
            <Button
                variant="delete"
                type="button"
                onClick={logout}
                icon={<LogOut size={20} />}
                className="text-small"
                >
                Se déconnecter
            </Button>
        </nav>
    )
}