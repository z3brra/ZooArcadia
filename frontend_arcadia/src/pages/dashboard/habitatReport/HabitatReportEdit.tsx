import { JSX } from "react"

import { DASHBOARD_ROUTES } from "@routes/paths"

import { Sprout, XCircle, Save } from "lucide-react"

import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from "@components/dashboard/DashboardSection"

import { Card } from "@components/dashboard/Card"

import { MessageBox } from "@components/common/MessageBox"
import { ReturnButton } from "@components/common/ReturnLink"
import { Button } from "@components/form/Button"
import { Input } from "@components/form/Input"
import { CustomSelect, SelectOption } from "@components/form/CustomSelect"

import { useHabitatReportEdit } from "@hook/habitatReport/useHabitatReportEdit"

export function HabitatReportEdit(): JSX.Element {
    const {
        habitatReport,
        loading,
        error, setError,
        habitatReportState, setHabitatReportState,
        habitatReportComment, setHabitatReportComment,
        fieldErrors,
        submitChange
    } = useHabitatReportEdit()

    const STATE: SelectOption[] = [
        { value: "GOOD", label: "Excellent" },
        { value: "MEDIUM", label: "Correct" },
        { value: "BAD", label: "Mauvais" }
    ]

    if (!habitatReport) {
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
                <MessageBox message="Aucun rapport trouvé" variant="warning" onClose={() => {}}/>
            </>
        )
    }

    return (
        <>
            <DashboardPageHeader
                icon={<Sprout size={30} />}
                title="Modifier le rapport"
            />

            <DashboardSection className="button-section">
                <Button
                    to={DASHBOARD_ROUTES.HABITATS_REPORT.DETAIL(habitatReport.uuid)}
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

            { !loading && !error && habitatReport && (
                <DashboardSection className="habitat-report-content">
                    <Card orientation="vertical" className="habitat-report-content-infos">
                        <form noValidate className="dashboard-card-item">
                            <CustomSelect
                                label="Etat général de l'habitat"
                                placeholder="Choisir l'état"
                                options={STATE}
                                value={habitatReportState}
                                onChange={setHabitatReportState}
                            />
                            { fieldErrors.habitatReportState && (
                                <div className="modal-form-field-error text-small">
                                    {fieldErrors.habitatReportState}
                                </div>
                            )}

                            <Input
                                type="textarea"
                                label="Rapport"
                                placeholder="Saisir le rapport"
                                value={habitatReportComment}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setHabitatReportComment(event.currentTarget.value)}
                            />
                            { fieldErrors.habitatReportComment && (
                                <div className="modal-form-field-error text-small">
                                    {fieldErrors.habitatReportComment}
                                </div>
                            )}
                        </form>
                    </Card>
                </DashboardSection>
            )}
        </>
    )
}