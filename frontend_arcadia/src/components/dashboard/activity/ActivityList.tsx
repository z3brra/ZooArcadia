import { JSX } from "react"
import { DashboardSection } from "../DashboardSection"
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
                    uuid={activity.uuid}
                    imageUrl={activity.pictures && activity.pictures.length > 0 ? activity.pictures[0].path : placeholderPicture}
                    name={activity.name}
                    description={activity.description}
                />
            ))}
        </DashboardSection>
    )
}