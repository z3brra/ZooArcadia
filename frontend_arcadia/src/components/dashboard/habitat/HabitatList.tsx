import { DashboardSection } from "../DashboardSection"
import { HabitatItem } from "./HabitatItem"
import { HabitatListItem } from "@types/habitat"
import placeholderPicture from "@assets/common/placeholder.png"

type HabitatListProps = {
    items: HabitatListItem[]
}

export function HabitatsList({ items }: HabitatListProps) {
    return (
        <DashboardSection className="habitats-list">
            {items.map(habitat => (
                <HabitatItem
                    key={habitat.uuid}
                    imageUrl={habitat.pictures && habitat.pictures.length > 0 ? habitat.pictures[0].path : placeholderPicture}
                    name={habitat.name}
                    animalCount={habitat.animalCount}
                />
            ))}
        </DashboardSection>
    )
}
