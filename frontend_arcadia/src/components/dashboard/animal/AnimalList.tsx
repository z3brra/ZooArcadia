import { JSX } from "react"
import { DashboardSection } from "../DashboardSection"
import { AnimalItem } from "./AnimalItem"
import placeholderPicture from "../../../assets/common/placeholder.png"

export interface Picture {
    uuid: string
    slug: string
    path: string
    createdAt: Date
    updatedAt: Date | null
}

export interface Animal {
    uuid: string
    name: string
    speciesName: string
    habitatName: string| null
    pictures: Picture[] | null
}

type AnimalListProps = {
    items: Animal[]
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