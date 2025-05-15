import { PaginatedResponse } from "@components/dashboard/DashboardPagination"
import { HabitatReport, HabitatReportListItem, HabitatReportUpdate } from "@models/habitatReport"
import { getRequest, deleteRequest, putRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"

export async function fetchHabitatReports(
    page: number
): Promise<PaginatedResponse<HabitatReportListItem>> {
    return getRequest<PaginatedResponse<HabitatReportListItem>>(
        `${Endpoints.HABITAT_REPORT}?page=${page}`
    )
}

export async function fetchOneHabitatReport(
    uuid: string
): Promise<HabitatReport> {
    return getRequest<HabitatReport>(
        `${Endpoints.HABITAT_REPORT}/${uuid}`
    )
}

export function updateHabitatReport(
    uuid: string,
    payload: HabitatReportUpdate
): Promise<HabitatReport> {
    return putRequest<HabitatReportUpdate, HabitatReport>(
        `${Endpoints.HABITAT_REPORT}/${uuid}`,
        payload
    )
}

export function deleteHabitatReport(
    uuid: string
): Promise<void> {
    return deleteRequest<void>(
        `${Endpoints.HABITAT_REPORT}/${uuid}`
    )
}