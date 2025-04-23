import { JSX } from "react"
import { DashboardSection } from "../DashboardSection"
import { ActivityItem } from "./ActivityItem"

const fakeURL = "https://media.istockphoto.com/id/1140829787/fr/photo/coucher-du-soleil-aux-plaines-de-savane.jpg?s=612x612&w=0&k=20&c=E0Z2FP8IkNUvLvOq1GrlvUXxsUggZZH7-hsokErioZ0="

export interface Activity {
    uuid: string
    name: string
    description: string
    createdAt: Date
    updatedAt: Date | null
}

type ActivityListProps = {
    items: Activity[]
}

export function ActivityList({
    items
}: ActivityListProps): JSX.Element {
    return (
        <DashboardSection className="activities-list">
            { items.map(activity => (
                <ActivityItem
                    key={activity.uuid}
                    imageUrl={fakeURL}
                    name={activity.name}
                    description={activity.description}
                />
            ))}
        </DashboardSection>
    )
}