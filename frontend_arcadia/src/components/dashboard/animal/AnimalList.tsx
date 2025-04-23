import { JSX } from "react"
import { DashboardSection } from "../DashboardSection"
import { AnimalItem } from "./AnimalItem"

const fakeURL = "https://media.istockphoto.com/id/1140829787/fr/photo/coucher-du-soleil-aux-plaines-de-savane.jpg?s=612x612&w=0&k=20&c=E0Z2FP8IkNUvLvOq1GrlvUXxsUggZZH7-hsokErioZ0="

export interface Animal {
    uuid: string
    name: string
    speciesName: string
    habitatName: string| null
    pictures: [] | null
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
                    imageUrl={fakeURL}
                    name={animal.name}
                    speciesName={animal.speciesName}
                    habitatName={animal.habitatName ? animal.habitatName : 'Aucun habitat' }
                />
            ))}
        </DashboardSection>
    )

}