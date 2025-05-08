export function validateHabitat(
    name: string,
    description: string
): { name?: string; description?: string } {
    const errors: { name?: string; description?: string } = {}
    if (!name.trim()) {
        errors.name = "Le nom de l'habitat est requis."
    } else if (name.length < 2) {
        errors.name = "Le nom doit faire plus de 2 caractères."
    } else if (name.length > 36) {
        errors.name = "Le nom ne doit pas dépasser 36 caractères."
    }
    if (description.trim() && description.length < 10) {
        errors.description = "La description doit faire plus de 10 caractères."
    }
    return errors
}