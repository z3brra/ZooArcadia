import { JSX } from "react"
import { DashboardSection } from "@components/dashboard/DashboardSection"
import { HabitatReportItem } from "@components/dashboard/habitat/HabitatReportItem"
import { HabitatReportListItem } from "@models/habitatReport"

type HabitatReportListProps = {
    items: HabitatReportListItem[]
}

export function HabitatReportList({
    items
}: HabitatReportListProps): JSX.Element {
    return (
        <DashboardSection className="habitat-reports-list">
            { items.map(report => (
                <HabitatReportItem
                    key={report.uuid}
                    uuid={report.uuid}
                    habitatName={report.habitatName}
                    reportDate={report.createdAt}
                    state={report.state}
                />
            ))}
        </DashboardSection>
    )
}
