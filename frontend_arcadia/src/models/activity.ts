import { Picture } from "./picture"

export interface ActivityListItem {
    uuid: string
    name: string
    description: string | null
    pictures: Picture[] | null
}