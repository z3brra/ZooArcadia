import { Picture } from "./picture"

export interface HabitatListItem {
    uuid: string
    name: string
    description: string | null
    animalCount: number
    pictures: Picture[] | null
}