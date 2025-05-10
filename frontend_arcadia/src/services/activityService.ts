import { PaginatedResponse } from "@components/dashboard/DashboardPagination"
import { Activity, ActivityListItem, ActivityCreate, ActivityUpdate, Rate, RateCreate, RateUpdate } from "@models/activity"
import { getRequest, postRequest, putRequest, deleteRequest, postFormRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"

export async function fetchActivities(
    page: number
): Promise<PaginatedResponse<ActivityListItem>> {
    return getRequest<PaginatedResponse<ActivityListItem>>(
        `${Endpoints.ACTIVITY}?page=${page}`
    )
}

export async function fetchOneActivity(
    uuid: string
): Promise<Activity> {
    return getRequest<Activity>(
        `${Endpoints.ACTIVITY}/${uuid}`
    )
}

export async function createActivity(
    payload: ActivityCreate
): Promise<Activity> {
    return postRequest<ActivityCreate, Activity>(
        `${Endpoints.ACTIVITY}/create`,
        payload
    )
}

export async function updateActivity(
    uuid: string,
    payload: ActivityUpdate
): Promise<Activity> {
    return putRequest<ActivityUpdate, Activity>(
        `${Endpoints.ACTIVITY}/${uuid}`,
        payload
    )
}

export async function deleteActivity(
    uuid: string
): Promise<void> {
    return deleteRequest<void>(
        `${Endpoints.ACTIVITY}/${uuid}`
    )
}

export async function createRate(
    payload: RateCreate
): Promise<Rate> {
    return postRequest<RateCreate, Rate>(
        `${Endpoints.RATES}/create`,
        payload
    )
}

export async function updateRate(
    uuid: string,
    payload: RateUpdate
): Promise<Rate> {
    return putRequest<RateUpdate, Rate>(
        `${Endpoints.RATES}/${uuid}`,
        payload
    )
}

export async function deleteRate(
    uuid: string
): Promise<void> {
    return deleteRequest<void>(
        `${Endpoints.RATES}/${uuid}`
    )
}

export async function updateActivityPicture(
    uuid: string,
    file: File,
    existingPictureUuid?: string
): Promise<void> {
    const form = new FormData()
    form.append("image", file)

    if (existingPictureUuid) {
        return postFormRequest<void>(
            `${Endpoints.ACTIVITY}/${uuid}/change-picture?pictureUuid=${existingPictureUuid}`,
            form
        )
    } else {
        return postFormRequest<void>(
            `${Endpoints.ACTIVITY}/${uuid}/add-picture`,
            form
        )
    }
}
