export interface Specie {
    uuid: string
    commonName: string
    scientificName: string
    lifespan: string
    diet: string
    description: string
    createdAt: string
    updatedAt: string
    animalCount: number
}

export interface SpecieCreate {
    commonName: string
    scientificName: string
    lifespan: string
    diet: string
    description: string
}

export interface SpeciesListItem {
    uuid: string
    commonName: string
    scientificName: string
    animalCount: number
}

export interface SpeciesAllList {
    uuid: string
    commonName: string
}

export interface SpeciesAllResponse<T> {
    data: T[]
    total: number
}
