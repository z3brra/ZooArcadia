export const Endpoints = {
    LOGIN: "/auth/login",
    HABITATS: "/habitats"
} as const

export type Endpoint = typeof Endpoints[keyof typeof Endpoints]
