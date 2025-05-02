import { JSX, useState, useEffect, useCallback } from "react"
import { Leaf, PlusCircle } from "lucide-react"
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from "@components/dashboard/DashboardSection"
import { DashboardPagination, PaginatedResponse } from "@components/dashboard/DashboardPagination"

import { HabitatsList } from "@components/dashboard/habitat/HabitatList"
import { HabitatCreate, HabitatListItem } from "@models/habitat"

import { CreateModal } from "@components/common/CreateModal"
import { MessageBox } from "@components/common/MessageBox"
import { Button } from "@components/form/Button"
import { Input } from "@components/form/Input"

import { getRequest, postRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"



export function Habitats (): JSX.Element {

    const [showCreate, setShowCreate] = useState<boolean>(false)

    const [habitats, setHabitats] = useState<HabitatListItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [showEmptyInfo, setShowEmptyInfo] = useState<boolean>(false)

    const [habitatName, setHabitatName] = useState<string>("")
    const [habitatDescription, setHabitatDescription] = useState<string>("")
    const [fieldErrors, setFieldErrors] = useState<{
        habitatName?: string
        habitatDescription?: string
    }>({})

    const fetchHabitats = useCallback(async () => {
        const fetchHabitats = async () => {
            setLoading(true)
            setError(null)
            try {
                const habitatResponse = await getRequest<PaginatedResponse<HabitatListItem>>(
                    `${Endpoints.HABITAT}?page=${currentPage}`
                )
                setHabitats(habitatResponse.data)
                setTotalPages(habitatResponse.totalPages)
                if (habitatResponse.data.length === 0) {
                    setShowEmptyInfo(true)
                }
            } catch (errorResponse) {
                console.error("Error when fecthing habitat ", errorResponse)
                setError("Impossible de charger la liste des habitats")
            } finally {
                setLoading(false)
            }
        }
        fetchHabitats()
    }, [currentPage])

    useEffect(() => {
        fetchHabitats()
    }, [fetchHabitats])


    const validateFields = () => {
        const errors: typeof fieldErrors = {}
        if (!habitatName.trim()) {
            errors.habitatName = "Le nom de l'habitat est requis."
        } else if (habitatName.length < 10) {
            errors.habitatName = "Le nom doit faire plus de 10 caractères."
        }
        if (habitatDescription.trim() && habitatDescription.length < 10) {
            errors.habitatDescription = "La description doit faire plus de 10 caractères."
        }
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async () => {
        setError(null)

        if (!validateFields()) {
            return
        }

        setLoading(true)
        try {
            const payload: HabitatCreate = {
                name: habitatName.trim(),
                description: habitatDescription.trim() || null
            }
            await postRequest<HabitatCreate, HabitatListItem>(
                `${Endpoints.HABITAT}/create`,
                payload
            )
            setCurrentPage(1)
            setHabitatName("")
            setHabitatDescription("")
            setShowCreate(false)
            await fetchHabitats()
        } catch (errorResponse) {
            console.error("Error when creating habitat ", errorResponse)
            setError("Impossible de créer l'habitat")
        } finally {
            setLoading(false)
        }

    }

    return (
        <>
            <DashboardPageHeader 
                icon={<Leaf size={30} />}
                title="Habitats"
                description="Gérer et visualiser vos habitats"
            />

            <DashboardSection className="button-section">
                <Button
                    variant="primary"
                    icon={<PlusCircle size={20} />}
                    onClick={() => setShowCreate(true)}
                    className="text-content"
                >
                    Ajouter
                </Button>
            </DashboardSection>

            { error && (
                <MessageBox variant='error' message={error} onClose={() => setError(null)}/>
            )}

            { !loading && !error && showEmptyInfo && (
                <MessageBox variant='info' message="Aucun habitat trouvé" onClose={() => setShowEmptyInfo(false)}/>
            )}

            { !loading && !error && habitats.length > 0 && (
                <HabitatsList items={habitats}/>
            )}

            { !loading && !error && habitats.length > 0 && totalPages > 1 && (
                <DashboardPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <CreateModal
                isOpen={showCreate}
                title="Ajouter habitat"
                message="Entrer les informations de l'habitat"
                onCancel={() => setShowCreate(false)}
                onSubmit={() => {
                    handleSubmit()
                }}
                disabled={loading}
            >
                <form noValidate className="modal-body">
                    <div className="modal-form-field">
                        <Input
                            type="string"
                            label="Nom"
                            placeholder="Saisir le nom"
                            value={habitatName}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setHabitatName(event.currentTarget.value)}
                        />
                        { fieldErrors.habitatName && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.habitatName}
                            </div>
                        )}
                    </div>
                    <div className="modal-form-field">
                        <Input
                            type="textarea"
                            label="Description"
                            placeholder="Saisir le nom"
                            value={habitatDescription}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setHabitatDescription(event.currentTarget.value)}
                        />
                        { fieldErrors.habitatDescription && (
                            <div className="modal-form-field-error text-small">
                                {fieldErrors.habitatDescription}
                            </div>
                        )}
                    </div>
                </form>
            </CreateModal>
        </>
    )
}

