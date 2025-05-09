type ValidateHabitatProps = {
    name?: string
    description?: string
}
export function validateHabitat(
    name: string,
    description: string
): ValidateHabitatProps {
    const errors: ValidateHabitatProps = {}
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



type validateSpecieProps = {
    commonName?: string
    scientificName?: string
    lifespan?: string
    diet?: string
    description?: string
}
export function validateSpecie(
    commonName: string,
    scientificName: string,
    lifespan: string,
    diet: string,
    description: string
): validateSpecieProps {
    const errors: validateSpecieProps = {}

    if (!commonName.trim()) {
        errors.commonName = "Le nom commun est requis."
    } else if (commonName.length < 2) {
        errors.commonName = "Le nom commun doit faire plus de 2 caractères."
    } else if (commonName.length > 255) {
        errors.commonName = "Le nom commun ne doit pas dépasser 255 caractères."
    }

    if (!scientificName.trim()) {
        errors.scientificName = "Le nom scientifique est requis."
    } else if (scientificName.length < 2) {
        errors.scientificName = "Le nom scientifique doit faire plus de 2 caratères."
    } else if (scientificName.length > 255) {
        errors.scientificName = "Le nom scientifique ne doit pas dépasser 255 caractères."
    }

    if (!lifespan.trim()) {
        errors.lifespan = "La durée de vie est requise."
    } else if (lifespan.length < 2) {
        errors.lifespan = "La durée de vie doit faire plus de 2 caractères."
    } else if (lifespan.length > 255) {
        errors.lifespan = "La durée de vie ne doit ps dépasser 255 caractères."
    }

    if (!diet.trim()) {
        errors.diet = "Le régime alimentaire est requis."
    }

    if (!description.trim()) {
        errors.description = "La description est requise."
    } else if (description.length < 10) {
        errors.description = "La description doit faire plus de 10 caractères."
    }

    return errors
}