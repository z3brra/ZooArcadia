import { JSX, useState } from "react"
import { XCircle, PlusCircle } from "lucide-react"
import { Input } from "@components/form/Input"
import { Button } from "@components/form/Button"

import { Rate, DraftRateCreate } from "@models/activity"

export type DraftRate = DraftRateCreate & {
    status: "unchanged" | "new" | "updated" | "deleted"
}

type RateEditorProps = {
    initialRates: Rate[]
    onChange: (drafts: DraftRate[]) => void
}

export function RateEditor({
    initialRates,
    onChange
}: RateEditorProps): JSX.Element {
    const [workingRates, setWorkingRates] = useState<DraftRate[]>(() => initialRates.map(rate => ({ ...rate, status: "unchanged" })))

    const updateDrafts = (next: DraftRate[]) => {
        setWorkingRates(next)
        onChange(next)
    }

    const addNew = () => {
        const draft: DraftRate = {
            uuid: `tmp-${Date.now()}`,
            title: "",
            price: 0,
            status: "new"
        }
        updateDrafts([...workingRates, draft])
    }

    const updateField = (
        uuid: string,
        field: "title" | "price",
        value: string | number
    ) => {
        updateDrafts(
            workingRates.map(rate => {
                if (rate.uuid !== uuid) {
                    return rate
                }
                const updated: DraftRate = {
                    ...rate,
                    [field]: value,
                    status: rate.status === "new" ? "new" : "updated"
                }
                return updated
            })
        )
    }

    const markDeleted = (uuid: string) => {
        updateDrafts(
            workingRates.map(rate => rate.uuid === uuid ? { ...rate, status: "deleted" as const } : rate)
        )
    }

    return (
        <div className="rate-editor">
            { workingRates.length === 0 ? (
                <h3 className="text-small text-silent">Aucun tarif</h3>
            ) : (
                <div className="rate-editor-list">
                    {workingRates.map(rate =>
                        rate.status !== "deleted" ? (
                            <div key={rate.uuid} className="rate-editor-item">
                                <div className="rate-editor-item-field-section">
                                    <Input
                                        type="text"
                                        // label="Titre"
                                        placeholder="Saisir le titre"
                                        value={rate.title}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateField(rate.uuid, "title", event.currentTarget.value)}
                                    />

                                    <Input
                                        type="number"
                                        // label="Prix"
                                        placeholder="Saisir le prix"
                                        value={rate.status === "new" && rate.price === 0 ? null! : rate.price}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => updateField(rate.uuid, "price", event.currentTarget.valueAsNumber)}
                                    />
                                </div>
                                <div className="rate-editor-item-button-section">
                                    <button
                                        className="button button-white"
                                        onClick={() => markDeleted(rate.uuid)}
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>
                                
                            </div>
                        ) :null
                    )}
                </div>
            )}
            
            <Button
                variant="secondary"
                icon={<PlusCircle size={20} />}
                onClick={addNew}
                className="text-small"
            >
                Ajouter
            </Button>
        </div>
    )



}
