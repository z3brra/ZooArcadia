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

export function formatDate(dateString: string): string {
    const newDate = new Date(dateString)
    if (isNaN(newDate.getTime())) {
        return dateString
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