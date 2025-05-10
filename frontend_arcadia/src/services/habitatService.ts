import { PaginatedResponse } from "@components/dashboard/DashboardPagination"
import { Habitat, HabitatListItem, HabitatCreate, HabitatUpdate, HabitatAllResponse, HabitatAllList } from "@models/habitat"
import { getRequest, postRequest, deleteRequest, putRequest, postFormRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"
import { AnimalListItem } from "@models/animal"

export async function fetchHabitats(
    page: number
): Promise<PaginatedResponse<HabitatListItem>> {
    return getRequest<PaginatedResponse<HabitatListItem>>(
        `${Endpoints.HABITAT}?page=${page}`
    )
}

export async function fetchAllHabitats(): Promise<HabitatAllResponse<HabitatAllList>>{
    return getRequest<HabitatAllResponse<HabitatAllList>>(
        `${Endpoints.HABITAT}/all`
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
): Promise<Habitat> {
    return postRequest<HabitatCreate, Habitat>(
        `${Endpoints.HABITAT}/create`,
        payload
    )
}

export async function updateHabitat(
    uuid: string,
    payload: HabitatUpdate
): Promise<Habitat> {
    return putRequest<HabitatUpdate, Habitat>(
        `${Endpoints.HABITAT}/${uuid}`,
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

export async function updateHabitatPicture(
    uuid: string,
    file: File,
    existingPictureUuid?: string
): Promise<void> {
    const form = new FormData()
    form.append("image", file)

    if (existingPictureUuid) {
        return postFormRequest<void>(
            `${Endpoints.HABITAT}/${uuid}/change-picture?pictureUuid=${existingPictureUuid}`,
            form
        )
    } else {
        return postFormRequest<void>(
            `${Endpoints.HABITAT}/${uuid}/add-picture`,
            form
        )
    }
}