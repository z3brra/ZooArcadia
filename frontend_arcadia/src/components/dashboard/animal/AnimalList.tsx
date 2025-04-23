import { JSX } from "react"
import { DashboardSection } from "../DashboardSection"
import { AnimalItem } from "./AnimalItem"

const fakeURL = "https://media.istockphoto.com/id/1140829787/fr/photo/coucher-du-soleil-aux-plaines-de-savane.jpg?s=612x612&w=0&k=20&c=E0Z2FP8IkNUvLvOq1GrlvUXxsUggZZH7-hsokErioZ0="

export interface Animal {
    uuid: string
    name: string
    isMale: boolean
    size: number
    weight: number
    isFertile: boolean
    birthDate: Date
    arrivalDate: Date
    createdAt: Date
    updatedAt: Date | null
    speciesUuid: string
    habitatUuid: string | null
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
                    species={"fake species"}
                    habitat={"fake habitat"}
                />
            ))}
        </DashboardSection>
    )

}