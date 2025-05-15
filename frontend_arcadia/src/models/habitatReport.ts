export interface HabitatReport {
    uuid: string
    habitatUuid: string
    habitatName: string
    createdByUuid: string
    userLastName: string
    userFirstName: string
    state: string
    comment: string | null
    createdAt: Date
    updatedAt: Date | null
}

export interface HabitatReportCreate {
    habitatUuid: string
    state: string
    comment: string | null
}

export interface HabitatReportUpdate {
    state: string
    comment: string | null
}

export interface HabitatReportListItem {
    uuid: string
    habitatName: string
    userLastName: string
    userFirstName: string
    state: string
    createdAt: Date
}