import { PaginatedResponse } from "@components/dashboard/DashboardPagination";
import { Specie, SpeciesListItem, SpecieCreate, SpecieUpdate } from "@models/species";
import { getRequest, postRequest, putRequest, deleteRequest } from "@api/request";
import { Endpoints } from "@api/endpoints";
import { AnimalListItem } from "@models/animal";

export async function fetchSpecies(
    page: number
): Promise<PaginatedResponse<SpeciesListItem>> {
    return getRequest<PaginatedResponse<SpeciesListItem>>(
        `${Endpoints.SPECIES}?page=${page}`
    )
}

export async function fetchOneSpecie(
    uuid: string
): Promise<Specie> {
    return getRequest<Specie>(
        `${Endpoints.SPECIES}/${uuid}`
    )
}

export async function fetchSpecieAnimals(
    uuid: string,
    limit?: number
): Promise<AnimalListItem[]> {
    return getRequest<AnimalListItem[]>(
        `${Endpoints.SPECIES}/${uuid}/animals?limit=${limit ? limit : 4}`
    )
}

export function createSpecie(
    payload: SpecieCreate
): Promise<SpeciesListItem> {
    return postRequest<SpecieCreate, SpeciesListItem>(
        `${Endpoints.SPECIES}/create`,
        payload
    )
}

export function updateSpecie(
    uuid: string,
    payload: SpecieUpdate
): Promise<Specie> {
    return putRequest<SpecieUpdate, Specie>(
        `${Endpoints.SPECIES}/${uuid}`,
        payload
    )
}

export function deleteSpecie(
    uuid: string
): Promise<void> {
    return deleteRequest<void>(
        `${Endpoints.SPECIES}/${uuid}`
    )
}
