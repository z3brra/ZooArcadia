import { JSX, useState } from "react"
import { Leaf, PlusCircle } from "lucide-react"
import { DashboardPageHeader } from "@components/dashboard/DashboardPageHeader"
import { DashboardSection } from "@components/dashboard/DashboardSection"
import { DashboardPagination } from "@components/dashboard/DashboardPagination"

import { HabitatsList } from "@components/dashboard/habitat/HabitatList"
// import { HabitatCreate } from "@models/habitat"

import { CreateModal } from "@components/common/CreateModal"
import { MessageBox } from "@components/common/MessageBox"
import { Button } from "@components/form/Button"
import { Input } from "@components/form/Input"

import { useHabitats } from "@hook/habitat/useHabitat"

export function Habitats (): JSX.Element {

    const [showCreate, setShowCreate] = useState<boolean>(false)

    const [habitatName, setHabitatName] = useState<string>("")
    const [habitatDescription, setHabitatDescription] = useState<string>("")

    const {
        habitats,
        currentPage,
        totalPages,
        loading,
        error,
        setCurrentPage,
        fieldErrors,
        submitCreation
    } = useHabitats()

    const handleSubmit = async () => {
        const isCreated = await submitCreation(habitatName, habitatDescription)
        if (!isCreated) {
            return
        }
        setShowCreate(false)
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
                <MessageBox variant='error' message={error} onClose={() => {}}/>
            )}

            { !loading && !error && habitats.length === 0 && (
                <MessageBox variant='info' message="Aucun habitat trouvé" onClose={() => {}}/>
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
                onSubmit={handleSubmit}
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

