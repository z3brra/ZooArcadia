export const PUBLIC_ROUTES = {
    HOME: "/" as const,

    HABITATS: {
        TO: "/habitats" as const,
        REL: "habitats" as const,
    },

    ANIMALS: {
        TO: "/animals" as const,
        REL: "animals" as const,
    },

    ACTIVITIES: {
        TO: "/activities" as const,
        REL: "activities" as const,
    },

    CONTACT: {
        TO: "/contact" as const,
        REL: "contact" as const,
    },

    LOGIN: {
        TO: "/login" as const,
        REL: "login" as const,
    },
}

export const DASHBOARD_ROUTES = {
    HOME: "/dashboard" as const,

    HABITATS: {
        TO: "/dashboard/habitats" as const,
        REL: "habitats" as const,
        DETAIL_PATTERN: ":uuid" as const,
        DETAIL: (uuid: string) => `${DASHBOARD_ROUTES.HABITATS.TO}/${uuid}` as const,
        EDIT_PATTERN: ":uuid/edit" as const,
        EDIT: (uuid: string) => `${DASHBOARD_ROUTES.HABITATS.TO}/${uuid}/edit` as const,
    },

    HABITATS_REPORT: {
        TO: "/dashboard/habitats-report" as const,
        REL: "habitats-report" as const,
    },

    SPECIES: {
        TO: "/dashboard/species" as const,
        REL: "species" as const,
        DETAIL_PATTERN: ":uuid" as const,
        DETAIL: (uuid: string) => `${DASHBOARD_ROUTES.SPECIES.TO}/${uuid}` as const,
        EDIT_PATTERN: ":uuid/edit" as const,
        EDIT: (uuid: string) => `${DASHBOARD_ROUTES.SPECIES.TO}/${uuid}/edit` as const
    },

    ANIMALS: {
        TO: "/dashboard/animals" as const,
        REL: "animals" as const,
        DETAIL_PATTERN: ":uuid" as const,
        DETAIL: (uuid: string) => `${DASHBOARD_ROUTES.ANIMALS.TO}/${uuid}` as const,
        EDIT_PATTERN: ":uuid/edit" as const,
        EDIT: (uuid: string) => `${DASHBOARD_ROUTES.ANIMALS.TO}/${uuid}/edit` as const,
    },

    ANIMALS_REPORT: {
        TO: "/dashboard/animals-report" as const,
        REL: "animals-report" as const,
    },

    ANIMALS_FEED: {
        TO: "/dashboard/animals-feed" as const,
        REL: "animals-feed" as const,
    },

    ACTIVITES: {
        TO: "/dashboard/activities" as const,
        REL: "activities" as const,
        DETAIL_PATTERN: ":uuid" as const,
        DETAIL: (uuid: string) => `${DASHBOARD_ROUTES.ACTIVITES.TO}/${uuid}` as const,
        EDIT_PATTERN: ":uuid/edit" as const,
        EDIT: (uuid: string) => `${DASHBOARD_ROUTES.ACTIVITES.TO}/${uuid}/edit` as const,
    },

    REVIEWS: {
        TO: "/dashboard/reviews" as const,
        REL: "reviews" as const,
    },

    USERS: {
        TO: "/dashboard/users" as const,
        REL: "users" as const,
    },

    STATISTICS: {
        TO: "/dashboard/statistics" as const,
        REL: "statistics" as const,
    }
}
