export const Endpoints = {
    LOGIN: "/auth/login",
    ME: "/auth/me",

    HABITATS: "/habitat"
} as const

export type Endpoint = typeof Endpoints[keyof typeof Endpoints]
