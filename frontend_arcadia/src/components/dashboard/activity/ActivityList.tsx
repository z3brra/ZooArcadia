import { JSX } from "react"
import { DashboardSection } from "@components/dashboard/DashboardSection"
import { ActivityItem } from "./ActivityItem"
import { ActivityListItem } from "@models/activity"
import placeholderPicture from "@assets/common/placeholder.png"

type ActivityListProps = {
    items: ActivityListItem[]
}

export function ActivityList({
    items
}: ActivityListProps): JSX.Element {
    return (
        <DashboardSection className="activities-list">
            { items.map(activity => (
                <ActivityItem
                    key={activity.uuid}
                    uuid={activity.uuid}
                    imageUrl={activity.pictures && activity.pictures.length > 0 ? activity.pictures[0].path : placeholderPicture}
                    name={activity.name}
                    description={activity.description}
                />
            ))}
        </DashboardSection>
    )
}