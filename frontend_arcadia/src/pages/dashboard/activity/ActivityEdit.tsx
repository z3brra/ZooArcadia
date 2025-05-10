import { JSX, useRef } from "react"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { LandPlot, XCircle, Save, Image } from "lucide-react"

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from '@components/dashboard/DashboardSection'
import { Card, CardMedia, CardHeader } from "@components/dashboard/Card"
import { RateEditor } from "@components/dashboard/activity/RatesEditor"

import { MessageBox } from "@components/common/MessageBox"
import { ReturnButton } from '@components/common/ReturnLink'
import { Button } from '@components/form/Button'
import { Input } from "@components/form/Input"

import placeholderPicture from "@assets/common/placeholder.png"
import { useActivityEdit } from "@hook/activity/useActivityEdit"

export function ActivityEdit(): JSX.Element {
    const {
        activity,
        loading,
        error, setError,
        activityName, setActivityName,
        activityDescription, setActivityDescription,

        originalRates,
        setDraftRates,
        fieldErrors,
        submitChange,
        uploadPicture
    } = useActivityEdit()

    const fileInputRef = useRef<HTMLInputElement>(null)

    const onClickChangePicture = () => {
        fileInputRef.current?.click()
    }

    const onFilechange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            uploadPicture(file)
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    if (!activity) {
        if (loading) {
            return (
                <MessageBox variant="info" message="Chargement..." onClose={() => {}}/>
            )
        }
        return (
            <>
                <DashboardSection>
                    <ReturnButton />
                </DashboardSection>
                <MessageBox message="Aucune activité trouvée" variant="warning" onClose={() => {}}/>
            </>
        )
    }

    return (
        <>
            <DashboardPageHeader
                icon={<LandPlot size={30} />}
                title="Modifier l'habitat"
            />

            <DashboardSection className="button-section">
                <Button
                    to={DASHBOARD_ROUTES.ACTIVITES.DETAIL(activity.uuid)}
                    variant="white"
                    icon={<XCircle size={20} />}
                    className="text-content"
                >
                    Annuler
                </Button>
                <Button
                    variant="primary"
                    icon={<Save size={20} />}
                    onClick={submitChange}
                    className="text-content"
                >
                    Enregistrer
                </Button>
            </DashboardSection>

            { error && (
                <MessageBox variant="error" message={error} onClose={() => setError(null)} />
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
                                { fieldErrors.activityName && (
                                    <div className="modal-form-field-error text-small">
                                        {fieldErrors.activityName}
                                    </div>
                                )}

                                <Input
                                    type="textarea"
                                    label="Description"
                                    placeholder="Saisir la description"
                                    value={activityDescription}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setActivityDescription(event.currentTarget.value)}
                                />
                                { fieldErrors.activityDescription && (
                                    <div className="modal-form-field-error text-small">
                                        {fieldErrors.activityDescription}
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