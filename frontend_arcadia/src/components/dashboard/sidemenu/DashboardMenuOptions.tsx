import { JSX } from "react"
import { useAuth } from "@hook/AuthContext"
import { SideMenuOption } from "@components/dashboard/sidemenu/DashboardMenuOption"
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
import { Button } from "@form/Button"
import { DASHBOARD_ROUTES } from "@routes/paths"

export function DashboardSideMenuOptions (): JSX.Element {

    const { hasAnyRole, logout } = useAuth()

    return (
        <nav className="dashboard-side-menu-options">
            <SideMenuOption to="" end label="Dashboard" icon={<CircleGauge size={20} />} />
            { hasAnyRole('ROLE_ADMIN', 'ROLE_VET') && (
                <SideMenuOption to={DASHBOARD_ROUTES.HABITATS.REL} label="Habitats" icon={<Leaf size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN', 'ROLE_VET') && (
                <SideMenuOption to={DASHBOARD_ROUTES.HABITATS_REPORT.REL} label="Rapports habitats" icon={<Sprout size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN') && (
                <SideMenuOption to={DASHBOARD_ROUTES.SPECIES.REL} label="Espèces animales" icon={<PencilRuler size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN', 'ROLE_VET', 'ROLE_EMPLOYEE') && (
                <SideMenuOption to={DASHBOARD_ROUTES.ANIMALS.REL} label="Animaux" icon={<PawPrint size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN', 'ROLE_VET') && (
                <SideMenuOption to={DASHBOARD_ROUTES.ANIMALS_REPORT.REL} label="Rapports animaliers" icon={<ClipboardList size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN', 'ROLE_VET', 'ROLE_EMPLOYEE') && (
                <SideMenuOption to={DASHBOARD_ROUTES.ANIMALS_FEED.REL} label="Repas" icon={<Ham size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN', 'ROLE_EMPLOYEE') && (
                <SideMenuOption to={DASHBOARD_ROUTES.ACTIVITES.REL} label="Activités" icon={<LandPlot size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN', 'ROLE_EMPLOYEE') && (
                <SideMenuOption to={DASHBOARD_ROUTES.REVIEWS.REL} label="Commentaires" icon={<MessagesSquare size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN') && (
                <SideMenuOption to={DASHBOARD_ROUTES.USERS.REL} label="Personnel" icon={<Users size={20} />} />
            )}

            { hasAnyRole('ROLE_ADMIN') && (
                <SideMenuOption to={DASHBOARD_ROUTES.STATISTICS.REL} label="Statistiques" icon={<ChartPie size={20} />} />
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