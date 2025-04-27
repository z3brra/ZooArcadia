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

export interface SpeciesListItem {
    uuid: string
    commonName: string
    scientificName: string
    animalCount: number
}
