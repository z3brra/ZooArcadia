import { JSX, useCallback, useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { Leaf, XCircle, Save, Image } from "lucide-react"

import { Habitat, HabitatUpdate } from "@models/habitat"

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from '@components/dashboard/DashboardSection'
import { Card, CardMedia } from "@components/dashboard/Card"

import { MessageBox } from "@components/common/MessageBox"
import { Button } from '@components/form/Button'
import { Input } from "@components/form/Input"

import { getRequest, putRequest, postFormRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"

import placeholderPicture from "@assets/common/placeholder.png"

export function HabitatEdit(): JSX.Element {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const [habitat, setHabitat] = useState<Habitat | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [showEmptyInfo, setShowEmptyInfo] = useState<boolean>(false)

    const [habitatName, setHabitatName] = useState<string>("")
    const [habitatDescription, setHabitatDescription] = useState<string>("")
    const [fieldErrors, setFieldErrors] = useState<{
        habitatName?: string
        habitatDescription?: string
    }>({})

    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchHabitat = useCallback(async () => {
        const fetchHabitat = async () => {
            setLoading(true)
            setError(null)
            try {
                const habitatResponse = await getRequest<Habitat>(
                    `${Endpoints.HABITAT}/${uuid}`
                )
                setHabitat(habitatResponse)
                if (!habitatResponse) {
                    setShowEmptyInfo(true)
                }
                setHabitatName(habitatResponse.name)
                setHabitatDescription(habitatResponse.description ? habitatResponse.description : "")
            } catch (errorResponse) {
                console.error("Error when fetching habitat ", errorResponse)
                setError("Impossible de charger l'habitat.")
            } finally {
                setLoading(false)
            }
        }
        if (uuid) {
            fetchHabitat()
        }
    }, [uuid])

    useEffect(() => {
        fetchHabitat()
    }, [fetchHabitat])

    const validateFields = () => {
        const errors: typeof fieldErrors = {}
        if (!habitatName.trim()) {
            errors.habitatName = "Le nom de l'habitat est requis."
        } else if (habitatName.length < 2) {
            errors.habitatName = "Le nom doit faire plus de 2 caractères."
        } else if (habitatName.length > 36) {
            errors.habitatName = "Le nom ne doit pas dépasser 36 caractères."
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
            const payload: HabitatUpdate = {
                name: habitatName.trim(),
                description: habitatDescription.trim() || null
            }
            await putRequest<HabitatUpdate, Habitat>(
                `${Endpoints.HABITAT}/${uuid}`,
                payload
            )
            navigate(DASHBOARD_ROUTES.HABITATS.DETAIL(uuid!))
        } catch (errorResponse) {
            console.error("Error when updating habitat ", errorResponse)
            setError("Impossible de modifier l'habitat.")
        } finally {
            setLoading(false)
        }
    }

    const onClickChangePicture = () => {
        fileInputRef.current?.click()
    }

    const onFilechange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !uuid) {
            return
        }
        const allowed = /\.(jpe?g|png|webp)$/i
        if (!allowed.test(file.name)) {
            setError("Format d'image non supporté (jpg, png, webp).")
            return
        }

        const form = new FormData()
        form.append("image", file)

        setLoading(true)
        setError(null)

        try {
            if (habitat?.pictures?.[0]?.uuid) {
                await postFormRequest<void>(
                    `${Endpoints.HABITAT}/${uuid}/change-picture?pictureUuid=${habitat.pictures[0].uuid}`,
                    form
                )
            } else {
                await postFormRequest<void>(
                    `${Endpoints.HABITAT}/${uuid}/add-picture`,
                    form
                )
            }
            await fetchHabitat()
        } catch {
            setError("Impossible d'uploader l'image.")
        } finally {
            setLoading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    return (
        <>
            <DashboardPageHeader
                icon={<Leaf size={30} />}
                title="Modifier l'habitat"
            />

            <DashboardSection className="button-section">
                <Button
                    to={DASHBOARD_ROUTES.HABITATS.DETAIL(uuid!)}
                    variant="white"
                    icon={<XCircle size={20} />}
                    className="text-content"
                >
                    Annuler
                </Button>
                <Button
                    variant="primary"
                    icon={<Save size={20} />}
                    onClick={() => handleSubmit()}
                    className="text-content"
                >
                    Enregistrer
                </Button>
            </DashboardSection>

            { error && (
                <MessageBox variant="error" message={error} onClose={() => setError(null)} />
            )}

            { !loading && !error && showEmptyInfo && (
                <MessageBox variant="info" message="Aucun habitat trouvé" onClose={() => setShowEmptyInfo(false)} />
            )}

            { !loading && !error && habitat && (
                <DashboardSection className="habitat-content">
                    <Card orientation="vertical" className="habitat-content-infos">
                        <div className="dashboard-card-body">
                            <CardMedia
                                src={habitat.pictures && habitat.pictures.length > 0 ? habitat.pictures[0].path : placeholderPicture}
                                className="media-filled-rectangle"
                                overlay={
                                    <Button
                                        variant="white"
                                        icon={<Image size={20} />}
                                        onClick={onClickChangePicture}
                                        className="text-small"
                                    >
                                        {habitat.pictures?.length ? "Modifier" : "Ajouter"}
                                    </Button>
                                }
                            />
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={onFilechange}
                            />

                            <form noValidate className="dashboard-card-item">
                                    <Input
                                        type="string"
                                        textSize="text-bigcontent"
                                        placeholder="Saisir le nom"
                                        value={habitatName}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setHabitatName(event.currentTarget.value)}
                                    />
                                    { fieldErrors.habitatName && (
                                        <div className="modal-form-field-error text-small">
                                            {fieldErrors.habitatName}
                                        </div>
                                    )}

                                    <Input
                                        type="textarea"
                                        placeholder="Saisir le nom"
                                        value={habitatDescription}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setHabitatDescription(event.currentTarget.value)}
                                    />
                                    { fieldErrors.habitatDescription && (
                                        <div className="modal-form-field-error text-small">
                                            {fieldErrors.habitatDescription}
                                        </div>
                                    )}
                            </form>
                        </div>
                    </Card>
                </DashboardSection>
            )}
        </>
    )
}
