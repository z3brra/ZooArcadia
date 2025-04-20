import { JSX } from "react"
import { DashboardSideMenuHeader } from "./DashboardMenuHeader"
import { DashboardSideMenuOptions } from "./DashboardMenuOptions"


export function DashboardSideMenu (): JSX.Element {
    return (
        <div className="dashboard-side-menu">
            <DashboardSideMenuHeader username="John Doe" />
            <DashboardSideMenuOptions />
        </div>
    )
}