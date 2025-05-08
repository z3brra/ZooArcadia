export const Endpoints = {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",

    HABITAT: "/habitat",

    SPECIES: "/species",
    ANIMAL: "/animal",
    ACTIVITY: "/activity",
    RATES: "/rates",

} as const

export type Endpoint = typeof Endpoints[keyof typeof Endpoints]
