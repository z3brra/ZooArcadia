import { JSX } from "react"
import { DashboardSection } from "../DashboardSection"
import { SpeciesItem } from "./SpeciesItem"

export interface Specie {
    uuid: string
    commonName: string
    scientificName: string
    lifespan: string
    diet: string
    description: string
    createdAt: string
    updatedAt: string | null
    animalCount: number
}

export function SpeciesList({ items }: { items: Specie[] }): JSX.Element {
    return (
        <DashboardSection className="species-list">
            { items.map(species => (
                <SpeciesItem
                    key={species.uuid}
                    commonName={species.commonName}
                    scientificName={species.scientificName}
                    animalCount={species.animalCount}
                />
            ))}
        </DashboardSection>
    )
}