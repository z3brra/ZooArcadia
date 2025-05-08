import { PaginatedResponse } from "@components/dashboard/DashboardPagination"
import { Habitat, HabitatListItem, HabitatCreate } from "@models/habitat"
import { getRequest, postRequest, deleteRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"
import { AnimalListItem } from "@models/animal"

export async function fetchHabitats(
    page: number
): Promise<PaginatedResponse<HabitatListItem>> {
    return getRequest<PaginatedResponse<HabitatListItem>>(
        `${Endpoints.HABITAT}?page=${page}`
    )
}

export async function fetchOneHabitat(
    uuid: string
): Promise<Habitat> {
    return getRequest<Habitat>(
        `${Endpoints.HABITAT}/${uuid}`
    )
}

export async function fetchHabitatAnimals(
    uuid: string,
    limit?: number
): Promise<AnimalListItem[]> {
    return getRequest<AnimalListItem[]>(
        `${Endpoints.HABITAT}/${uuid}/animals?limit=${limit ? limit : 4}`
    )
}

export async function createHabitat(
    payload: HabitatCreate
): Promise<HabitatListItem> {
    return postRequest<HabitatCreate, HabitatListItem>(
        `${Endpoints.HABITAT}/create`,
        payload
    )
}

export async function deleteHabitat(
    uuid: string
): Promise<void> {
    return deleteRequest<void>(
        `${Endpoints.HABITAT}/${uuid}`
    )
}
