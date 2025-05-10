import { PaginatedResponse } from "@components/dashboard/DashboardPagination"
import { Animal, AnimalListItem, AnimalCreate, AnimalUpdate } from "@models/animal"
import { getRequest, postRequest, putRequest, deleteRequest, postFormRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"

export async function fetchAnimals(
    page: number
): Promise<PaginatedResponse<AnimalListItem>>{
    return getRequest<PaginatedResponse<AnimalListItem>>(
        `${Endpoints.ANIMAL}?page=${page}`
    )
}

export async function fetchOneAnimal(
    uuid: string
): Promise<Animal> {
    return getRequest<Animal>(
        `${Endpoints.ANIMAL}/${uuid}`
    )
}

export async function createAnimal(
    payload: AnimalCreate
): Promise<Animal> {
    return postRequest<AnimalCreate, Animal>(
        `${Endpoints.ANIMAL}/create`,
        payload
    )
}

export async function updateAnimal(
    uuid: string,
    payload: AnimalUpdate
): Promise<Animal> {
    return putRequest<AnimalUpdate, Animal>(
        `${Endpoints.ANIMAL}/${uuid}`,
        payload
    )
}

export async function deleteAnimal(
    uuid: string
): Promise<void> {
    return deleteRequest<void>(
        `${Endpoints.ANIMAL}/${uuid}`
    )
}

export async function updateAnimalPicture(
    uuid: string,
    file: File,
    existingPictureUuid?: string
): Promise<void> {
    const form = new FormData()
    form.append("image", file)

    if (existingPictureUuid) {
        return postFormRequest<void>(
            `${Endpoints.ANIMAL}/${uuid}/change-picture?pictureUuid=${existingPictureUuid}`,
            form
        )
    } else {
        return postFormRequest<void>(
            `${Endpoints.ANIMAL}/${uuid}/add-picture`,
            form
        )
    }
}
