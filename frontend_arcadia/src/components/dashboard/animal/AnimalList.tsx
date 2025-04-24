import { JSX } from "react"
import { DashboardSection } from "../DashboardSection"
import { AnimalItem } from "./AnimalItem"

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
                    imageUrl={animal.pictures && animal.pictures.length > 0 ? animal.pictures[0].path : placeholderPicture}
                    name={animal.name}
                    speciesName={animal.speciesName}
                    habitatName={animal.habitatName ? animal.habitatName : 'Aucun habitat' }
                />
            ))}
        </DashboardSection>
    )
}