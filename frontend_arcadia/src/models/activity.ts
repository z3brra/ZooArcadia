import { Picture } from "./picture"

export interface Activity {
    uuid: string
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date | null
    rates: Rate[] | null
    pictures: Picture[] | null
}

export interface ActivityListItem {
    uuid: string
    name: string
    description: string | null
    pictures: Picture[] | null
}

export interface Rate {
    uuid: string
    title: string
    price: number
    createdAt: Date
    updatedAt: Date | null
}