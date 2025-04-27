
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