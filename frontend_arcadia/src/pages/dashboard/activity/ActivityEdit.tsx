import { JSX, useCallback, useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { LandPlot, XCircle, Save, Image } from "lucide-react"

import { Activity, ActivityUpdate, Rate, RateCreate, RateUpdate } from "@models/activity"

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from '@components/dashboard/DashboardSection'
import { Card, CardMedia, CardHeader } from "@components/dashboard/Card"
import { RateEditor, DraftRate } from "@components/dashboard/activity/RatesEditor"

import { MessageBox } from "@components/common/MessageBox"
import { Button } from '@components/form/Button'
import { Input } from "@components/form/Input"

import { getRequest, putRequest, postFormRequest, postRequest, deleteRequest } from "@api/request"
import { Endpoints } from "@api/endpoints"

import placeholderPicture from "@assets/common/placeholder.png"

export function ActivityEdit(): JSX.Element {
    const { uuid } = useParams<{ uuid: string }>()
    const navigate = useNavigate()

    const [activity, setActivity] = useState<Activity | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [showEmptyInfo, setShowEmptyInfo] = useState<boolean>(false)

    const [activityName, setActivityName] = useState<string>("")
    const [activityDescription, setActivityDescription] = useState<string>("")
    const [fieldErrors, setFieldErrors] = useState<{
        name?: string
        description?: string
    }>({})

    const [originalRates, setOriginalRates] = useState<Rate[]>([])
    const [draftRates, setDraftRates] = useState<DraftRate[]>([])

    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchActivity = useCallback( async () => {
        const fetchActivity = async () => {
            setLoading(true)
            setError(null)
            try {
                const activityResponse = await getRequest<Activity>(
                    `${Endpoints.ACTIVITY}/${uuid}`
                )
                setActivity(activityResponse)
                if (!activityResponse) {
                    setShowEmptyInfo(true)
                }
                setActivityName(activityResponse.name)
                setActivityDescription(activityResponse.description ? activityResponse.description : "")

                setOriginalRates(activityResponse.rates ?? [])
                setDraftRates((activityResponse.rates ?? []).map(rate => ({ ...rate, status: "unchanged" })))

            } catch (errorResponse) {
                console.error("Error when fetching activity ", errorResponse)
                setError("Impossible de charger l'activité")
            } finally {
                setLoading(false)
            }
        }
        if (uuid) {
            fetchActivity()
        }
    }, [uuid])

    useEffect(() => {
        fetchActivity()
    }, [fetchActivity])

    const validateFields = () => {
        const errors: typeof fieldErrors = {}
        if (!activityName.trim()) {
            errors.name = "Le nom de l'activité est requis."
        } else if (activityName.length < 2) {
            errors.name = "Le nom doit faire plus de 2 caractères."
        } else if (activityName.length > 36) {
            errors.name = "Le nom ne doit pas dépasser 36 caractères."
        }
        
        if (activityDescription.trim() && activityDescription.length < 10) {
            errors.description = "La description doit faire plus de 10 caractères."
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
            const payload: ActivityUpdate = {
                name: activityName.trim(),
                description: activityDescription.trim() || null
            }
            await putRequest<ActivityUpdate, Activity>(
                `${Endpoints.ACTIVITY}/${uuid}`,
                payload
            )

            for (const rate of draftRates) {
                switch (rate.status) {
                    case "new":
                        const rateCreatePayload: RateCreate = {
                            title: rate.title,
                            price: rate.price,
                            activityUuid: uuid!
                        }
                        await postRequest<RateCreate, Rate>(
                            `${Endpoints.RATES}/create`,
                            rateCreatePayload
                        )
                        break

                    case "updated":
                        const rateUpdatePayload: RateUpdate = {
                            title: rate.title,
                            price: rate.price
                        }
                        await putRequest<RateUpdate, Rate>(
                            `${Endpoints.RATES}/${rate.uuid}`,
                            rateUpdatePayload
                        )
                        break

                    case "deleted":
                        await deleteRequest<void>(
                            `${Endpoints.RATES}/${rate.uuid}`
                        )
                        break
                }
            }

            navigate(DASHBOARD_ROUTES.ACTIVITES.DETAIL(uuid!))
        } catch (errorResponse) {
            console.error("Error when updating activity ", errorResponse)
            setError("Impossible de modifier l'activité.")
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
            if (activity?.pictures?.[0]?.uuid) {
                await postFormRequest<void>(
                    `${Endpoints.ACTIVITY}/${uuid}/change-picture?pictureUuid=${activity.pictures[0].uuid}`,
                    form
                )
            } else {
                await postFormRequest<void>(
                    `${Endpoints.ACTIVITY}/${uuid}/add-picture`,
                    form
                )
            }
            await fetchActivity()
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
                icon={<LandPlot size={30} />}
                title="Modifier l'habitat"
            />

            <DashboardSection className="button-section">
                <Button
                    to={DASHBOARD_ROUTES.ACTIVITES.DETAIL(uuid!)}
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
                <MessageBox variant="info" message="Aucune activité trouvée" onClose={() => setShowEmptyInfo(false)} />
            )}

            { !loading && !error && activity && (
                <DashboardSection className="activity-content">
                    <Card orientation="vertical" className="activity-content-infos">
                        <div className="dashboard-card-body">
                            <CardMedia
                                src={activity.pictures && activity.pictures.length > 0 ? activity.pictures[0].path : placeholderPicture}
                                className="media-filled-rectangle"
                                overlay={
                                    <Button
                                        variant="white"
                                        icon={<Image size={20} />}
                                        onClick={onClickChangePicture}
                                        className="text-small"
                                    >
                                        {activity.pictures?.length ? "Modifier" : "Ajouter"}
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
                                    label="Nom"
                                    placeholder="Saisir le nom"
                                    value={activityName}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setActivityName(event.currentTarget.value)}
                                />
                                { fieldErrors.name && (
                                    <div className="modal-form-field-error text-small">
                                        {fieldErrors.name}
                                    </div>
                                )}

                                <Input
                                    type="textarea"
                                    label="Description"
                                    placeholder="Saisir la description"
                                    value={activityDescription}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setActivityDescription(event.currentTarget.value)}
                                />
                                { fieldErrors.description && (
                                    <div className="modal-form-field-error text-small">
                                        {fieldErrors.description}
                                    </div>
                                )}
                            </form>
                            <div className="dashboard-card-item">
                                <CardHeader className="text-bigcontent text-primary">Tarifs</CardHeader>
                                <RateEditor
                                    initialRates={originalRates}
                                    onChange={setDraftRates}
                                />
                            </div>
                        </div>
                    </Card>
                </DashboardSection>
            )}
        </>
    )


}