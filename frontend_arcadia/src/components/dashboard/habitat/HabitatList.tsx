import { DashboardSection } from "../DashboardSection"
import { HabitatItem } from "./HabitatItem"

// https://media.istockphoto.com/id/1140829787/fr/photo/coucher-du-soleil-aux-plaines-de-savane.jpg?s=612x612&w=0&k=20&c=E0Z2FP8IkNUvLvOq1GrlvUXxsUggZZH7-hsokErioZ0=

const fakeURL = "https://media.istockphoto.com/id/1140829787/fr/photo/coucher-du-soleil-aux-plaines-de-savane.jpg?s=612x612&w=0&k=20&c=E0Z2FP8IkNUvLvOq1GrlvUXxsUggZZH7-hsokErioZ0="

export interface Habitat {
    uuid: string
    name: string
    description: string
    createdAt: string
    updatedAt: string | null
    // animalCount: number
}

export function HabitatsList({ items }: { items: Habitat[] }) {
    return (
        <DashboardSection className="habitats-list">
            {items.map(habitat => (
                <HabitatItem
                    key={habitat.uuid}
                    imageUrl={fakeURL}
                    name={habitat.name}
                    description={habitat.description}
                />
            ))}
        </DashboardSection>
    )
}
