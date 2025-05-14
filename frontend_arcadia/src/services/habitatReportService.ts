import { PaginatedResponse } from "@components/dashboard/DashboardPagination"
import { HabitatReportListItem } from "@models/habitatReport"
import { getRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"

export async function fetchHabitatReports(
    page: number
): Promise<PaginatedResponse<HabitatReportListItem>> {
    return getRequest<PaginatedResponse<HabitatReportListItem>>(
        `${Endpoints.HABITAT_REPORT}?page=${page}`
    )
}