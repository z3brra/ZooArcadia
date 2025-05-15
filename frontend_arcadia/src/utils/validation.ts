import { isValidDate } from "@utils/dateUtils"

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

type ValidateAnimalProps = {
    name?: string,
    isMale?: string,
    size?: string,
    weight?: string,
    isFertile?: string,
    birthDate?: string,
    arrivalDate?: string,
    speciesUuid?: string
}
export function validateAnimal(
    name: string,
    isMale: boolean,
    size: number,
    weight: number,
    isFertile: boolean,
    birthDate: string,
    arrivalDate: string,
    speciesUuid: string
): ValidateAnimalProps {
    const errors: ValidateAnimalProps = {}
    if (!name.trim()) {
        errors.name = "Le nom de l'animal est requis."
    } else if (name.length < 2) {
        errors.name = "Le nom doit faire plus de 2 caractères."
    } else if (name.length > 36) {
        errors.name = "Le nom ne doit pas faire plus de 36 caractères."
    }

    if (isMale === null) {
        errors.isMale = "Le sexe de l'animal est requis."
    }

    if (size === null) {
        errors.size = "La taille est requise."
    } else if (size <= 0) {
        errors.size = "La taille doit être un nombre positif"
    }

    if (weight === null) {
        errors.weight = "Le poids est requis."
    } else if (weight <= 0) {
        errors.weight = "Le poids doit être un nombre positif"
    }

    if (isFertile === null) {
        errors.isFertile = "L'état de l'animal est requis."
    }

    if (!birthDate) {
        errors.birthDate = "La date de naissance est requise."
    } else if (!isValidDate(birthDate)) {
        errors.birthDate = "Format de date invalide."
    }

    if (!arrivalDate) {
        errors.arrivalDate = "La date d'arrivée est requise."
    } else if (!isValidDate(arrivalDate)) {
        errors.arrivalDate = "Format de date invalide."
    }

    if (!speciesUuid.trim()) {
        errors.speciesUuid = "L'espèce est requise."
    }

    return errors
}

type ValidateActivityProps = {
    name?: string
    description?: string
}
export function validateActivity(
    name: string,
    description: string
): ValidateActivityProps {
    const errors: ValidateActivityProps = {}

    if (!name.trim()) {
        errors.name = "Le nom de l'activité est requis."
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

type ValidateHabitatReportProps = {
    habitatUuid?: string
    state?: string
    comment?: string
}
export function validateHabitatReport(
    habitatUuid: string,
    state: string,
    comment: string
): ValidateHabitatReportProps {
    const errors: ValidateHabitatReportProps = {}

    if (!habitatUuid.trim()) {
        errors.habitatUuid = "L'habitat est requis."
    }

    if (!state.trim()) {
        errors.state = "L'état est requis."
    }

    if (comment.trim() && comment.length < 10) {
        errors.comment = "Le coommentaire doit faire plus de 10 caractères."
    }

    return errors
}