import { JSX } from "react"
import { DashboardSection } from "@components/dashboard/DashboardSection"
import { AnimalItem } from "@components/dashboard/animal/AnimalItem"

import { AnimalListItem } from "@models/animal"
import placeholderPicture from "@assets/common/placeholder.png"


type AnimalListProps = {
    items: AnimalListItem[]
}

export function AnimalList({
    items
}: AnimalListProps): JSX.Element {

    return (
        <DashboardSection className="animals-list">
            { items.map(animal => (
                <AnimalItem
                    key={animal.uuid}
                    uuid={animal.uuid}
                    imageUrl={animal.pictures && animal.pictures.length > 0 ? animal.pictures[0].path : placeholderPicture}
                    name={animal.name}
                    speciesName={animal.speciesName}
                    habitatName={animal.habitatName ? animal.habitatName : 'Aucun habitat' }
                />
            ))}
        </DashboardSection>
    )
}