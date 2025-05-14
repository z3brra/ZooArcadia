export interface HabitatReport {
    uuid: string
    habitatUuid: string
    habitatName: string
    createdByUuid: string
    userLastName: string
    userFirstName: string
    state: string
    comment: string
    createdAt: Date
    updatedAt: Date | null
}

export interface HabitatReportListItem {
    uuid: string
    habitatName: string
    userLastName: string
    userFirstName: string
    state: string
    createdAt: Date
}