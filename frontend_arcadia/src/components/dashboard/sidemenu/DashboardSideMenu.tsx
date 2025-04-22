import { forwardRef } from "react"
import { DashboardSideMenuHeader } from "./DashboardMenuHeader"
import { DashboardSideMenuOptions } from "./DashboardMenuOptions"


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