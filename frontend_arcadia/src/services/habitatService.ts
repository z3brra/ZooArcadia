import { PaginatedResponse } from "@components/dashboard/DashboardPagination"
import { HabitatListItem, HabitatCreate } from "@models/habitat"
import { getRequest, postRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"

export async function fetchHabitats(
    page: number
): Promise<PaginatedResponse<HabitatListItem>> {
    return getRequest<PaginatedResponse<HabitatListItem>>(
        `${Endpoints.HABITAT}?page=${page}`
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