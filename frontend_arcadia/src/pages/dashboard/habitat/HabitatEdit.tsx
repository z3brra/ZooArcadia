import { JSX, useRef } from "react"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { Leaf, XCircle, Save, Image } from "lucide-react"

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from '@components/dashboard/DashboardSection'
import { Card, CardMedia } from "@components/dashboard/Card"

import { MessageBox } from "@components/common/MessageBox"
import { ReturnButton } from '@components/common/ReturnLink'
import { Button } from '@components/form/Button'
import { Input } from "@components/form/Input"

import placeholderPicture from "@assets/common/placeholder.png"
import { useHabitatEdit } from "@hook/habitat/useHabitatEdit"

export function HabitatEdit(): JSX.Element {
    const {
        habitat,
        loading,
        error,
        setError,
        habitatName,
        setHabitatName,
        habitatDescription,
        setHabitatDescription,
        fieldErrors,
        submitChange,
        uploadPicture
    } = useHabitatEdit()

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

    if (!habitat) {
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
                <MessageBox message="Aucun habitat trouvé" variant="warning" onClose={() => {}}/>
            </>
        )
    }

    return (
        <>
            <DashboardPageHeader
                icon={<Leaf size={30} />}
                title="Modifier l'habitat"
            />

            <DashboardSection className="button-section">
                <Button
                    to={DASHBOARD_ROUTES.HABITATS.DETAIL(habitat.uuid!)}
                    variant="white"
                    icon={<XCircle size={20} />}
                    className="text-content"
                >
                    Annuler
                </Button>
                <Button
                    variant="primary"
                    icon={<Save size={20} />}
                    disabled={loading}
                    onClick={submitChange}
                    className="text-content"
                >
                    Enregistrer
                </Button>
            </DashboardSection>

            { error && (
                <MessageBox variant="error" message={error} onClose={() => setError(null)} />
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
