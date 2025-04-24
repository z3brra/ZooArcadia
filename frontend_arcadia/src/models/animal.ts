import { Picture } from "./picture"

export interface AnimalListItem {
    uuid: string
    name: string
    speciesName: string
    habitatName: string | null
    pictures: Picture[] | null
}
