import { Picture } from "./picture"

export interface SpeciesListItem {
    uuid: string
    commonName: string
    scientificName: string
    animalCount: number
    pictures: Picture[] | null
}
