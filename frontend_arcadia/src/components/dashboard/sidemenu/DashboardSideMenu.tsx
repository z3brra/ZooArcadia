import { JSX, forwardRef } from "react"
import { DashboardSideMenuHeader } from "./DashboardMenuHeader"
import { DashboardSideMenuOptions } from "./DashboardMenuOptions"


type DashboardSideMenuProps = {
    isOpen: boolean
}

// export function DashboardSideMenu ( {isOpen }: DashboardSideMenuProps): JSX.Element {
//     return (
//         <div className={`dashboard-side-menu ${isOpen ? 'open' : ''}`}>
//             <DashboardSideMenuHeader />
//             <DashboardSideMenuOptions />
//         </div>
//     )
// }

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