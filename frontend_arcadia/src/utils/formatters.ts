import { LabelVariant } from "@components/dashboard/Card"

export function formatDiet(diet: string): string {
    switch (diet) {
        case "HERBIVOROUS":
            return "Herbivore"

        case "CARNIVOROUS":
            return "Carnivore"

        case "OMNIVOROUS":
            return "Omnivore"

        default:
            return diet.charAt(0).toUpperCase() + diet.slice(1).toLowerCase()
    }
}

export function formatDate(dateString: string | Date): string {
    const newDate = new Date(dateString)
    if (isNaN(newDate.getTime())) {
        return String(dateString)
    }

    const day = String(newDate.getDate()).padStart(2, "0")
    const monthAbbreviation = [
        "Janv.",
        "Fév.",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juil.",
        "Août",
        "Sept.",
        "Oct.",
        "Nov.",
        "Déc."
    ]
    const month = monthAbbreviation[newDate.getMonth()]
    const year = newDate.getFullYear()

    return `${day} ${month} ${year}`
}

export function formatTime(dateString: string | Date): string {
    const newDate = new Date(dateString)
    if (isNaN(newDate.getTime())) {
        return String(dateString)
    }

    const hours = String(newDate.getHours()).padStart(2, "0")
    const minutes = String(newDate.getMinutes()).padStart(2, "0")

    return `${hours}h${minutes}`
}

export function formatDateForInput(backendDate: string | Date): string {
    return new Date(backendDate).toISOString().split('T')[0]
}

export function formatStateLabelVariant(state: string): LabelVariant {
    switch (state) {
        case "GOOD":
            return "green"
        case "MEDIUM":
            return "yellow"
        case "BAD":
            return "red"
        default:
            return "grey"
    }
}

export function formatStateLabel(state: string): string {
    switch (state) {
        case "GOOD":
            return "Excellent"
        case "MEDIUM":
            return "Correct"
        case "BAD":
            return "Mauvais"
        default:
            return "Aucun statut"
    }
}