import { JSX } from "react"
import { CircleGauge } from "lucide-react"
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"

export function DashboardHome (): JSX.Element {
    return (
        <DashboardPageHeader 
            icon={<CircleGauge size={30} />}
            title="Dashboard"
        />
    )
}