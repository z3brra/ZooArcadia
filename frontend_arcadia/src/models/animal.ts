import { Picture } from "./picture"

export interface Animal {
    uuid: string
    name: string
    isMale: boolean
    size: number
    weight: number
    isFertile: boolean
    birthDate: string
    arrivalDate: string
    createdAt: string
    updatedAt: string | null
    speciesUuid: string
    speciesName: string
    habitatUuid: string | null
    habitatName: string | null
    pictures: Picture[] | null
}

export interface AnimalCreate {
    name: string
    isMale: boolean
    size: number
    weight: number
    isFertile: boolean
    birthDate: string
    arrivalDate: string
    speciesUuid: string
    habitatUuid: string | null
}

export interface AnimalListItem {
    uuid: string
    name: string
    speciesName: string
    habitatName: string | null
    pictures: Picture[] | null
}
