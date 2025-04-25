import { JSX } from "react"
import { DashboardSection } from "../DashboardSection"
import { SpeciesItem } from "./SpeciesItem"
import { SpeciesListItem } from "@models/species"

type SpeciesListProps = {
    items: SpeciesListItem[]
}

export function SpeciesList({ items }: SpeciesListProps): JSX.Element {
    return (
        <DashboardSection className="species-list">
            { items.map(species => (
                <SpeciesItem
                    uuid={species.uuid}
                    commonName={species.commonName}
                    scientificName={species.scientificName}
                    animalCount={species.animalCount}
                />
            ))}
        </DashboardSection>
    )
}