import { JSX, useState } from "react"
import { Sprout, PlusCircle, Funnel } from "lucide-react"
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from "@components/dashboard/DashboardSection"
import { DashboardPagination } from "@components/dashboard/DashboardPagination"

import { CreateModal } from "@components/common/CreateModal"
import { MessageBox } from "@components/common/MessageBox"
import { Button } from "@components/form/Button"
import { Input } from "@components/form/Input"
import { CustomSelect, SelectOption } from "@components/form/CustomSelect"


import { useHabitatReports } from "@hook/habitatReport/useHabitatReports"
import { HabitatReportList } from "@components/dashboard/habitat/HabitatReportList"



export function HabitatsReport (): JSX.Element {
    const [showCreate, setShowCreate] = useState<boolean>(false)

    const {
        habitatReports,
        currentPage, setCurrentPage,
        totalPages,
        loading,
        error, setError,

        habitatReportHabitatUuid, setHabitatReportHabitatUuid,
        habitatOptions,
        habitatOptionsError, setHabitatOptionsError,

        habitatReportState, setHabitatReportState,
        habitatReportComment, setHabitatReportComment,

        fieldErrors,
        submitCreation
    } = useHabitatReports()

    const STATE: SelectOption[] = [
        { value: "GOOD", label: "Excellent" },
        { value: "MEDIUM", label: "Correct" },
        { value: "BAD", label: "Mauvais" }
    ]

    const handleSubmit = async () => {
        const isCreated = await submitCreation(
            habitatReportHabitatUuid,
            habitatReportState,
            habitatReportComment
        )
        if (!isCreated) {
            return
        }
        setShowCreate(false)
    }

    return (
        <>
            <DashboardPageHeader 
                icon={<Sprout size={30} />}
                title="Rapports habitats"
                description="Gérer et visualiser vos rapports habitats"
            />

            <DashboardSection className="button-section">
                <Button
                    variant="white"
                    icon={<Funnel size={20} />}
                    onClick={() => console.log('Filtrer')}
                    className="text-content"
                >
                    Filtrer
                </Button>
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
                <MessageBox variant='error' message={error} onClose={() => {setError(null)}}/>
            )}

            { !loading && !error && habitatReports.length === 0 && (
                <MessageBox variant='info' message="Aucun rapport trouvé" onClose={() => {}}/>
            )}

            { !loading && !error && habitatReports.length > 0 && (
                <HabitatReportList items={habitatReports} />
            )}

            { !loading && !error && habitatReports.length > 0 && totalPages > 1 && (
                <DashboardPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            <CreateModal
                isOpen={showCreate}
                title="Ajouter rapport"
                message="Entrer les informations du rapport"
                onCancel={() => setShowCreate(false)}
                onSubmit={handleSubmit}
                disabled={loading}
            >
                <form noValidate className="modal-body">
                    <div className="modal-form-field">
                        { habitatOptionsError ? (
                            <MessageBox variant="error" message={habitatOptionsError} onClose={() => setHabitatOptionsError(null)} />
                        ): (
                            <>
                                <CustomSelect
                                    label="Habitat"
                                    placeholder={habitatOptions.length === 0 ? "Aucun habitat" : "Selectionner l'habitat"}
                                    options={habitatOptions}
                                    value={habitatReportHabitatUuid}
                                    onChange={setHabitatReportHabitatUuid}
                                    disabled={habitatOptions.length === 0}
                                />
                                { fieldErrors.habitatReportHabitatUuid && (
                                    <div className="modal-form-field-error text-small">
                                        {fieldErrors.habitatReportHabitatUuid}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="modal-form-field">
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
                    </div>

                    <div className="modal-form-field">
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
                    </div>
                </form>
            </CreateModal>


        </>
        
    )
}