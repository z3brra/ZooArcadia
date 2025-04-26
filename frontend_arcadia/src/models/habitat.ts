import { Picture } from "./picture"

export interface Habitat {
    uuid: string
    name: string
    description: string| null
    createdAt: Date
    updatedAt: Date | null
    animalCount: number
    pictures: Picture[] | null
}

export interface HabitatListItem {
    uuid: string
    name: string
    description: string | null
    animalCount: number
    pictures: Picture[] | null
}