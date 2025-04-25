import { forwardRef } from "react"
import { DashboardSideMenuHeader } from "@components/dashboard/sidemenu/DashboardMenuHeader"
import { DashboardSideMenuOptions } from "@components/dashboard/sidemenu/DashboardMenuOptions"


type DashboardSideMenuProps = {
    isOpen: boolean
}

export const DashboardSideMenu = forwardRef<HTMLElement, DashboardSideMenuProps>(
    ({ isOpen }, ref) => (
        <aside
            ref={ref}
            className={`dashboard-side-menu${isOpen ? ' open' : ''}`}
        >
            <DashboardSideMenuHeader />
            <DashboardSideMenuOptions />
        </aside>
    )
)