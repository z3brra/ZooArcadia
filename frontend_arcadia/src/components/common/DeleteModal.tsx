import { JSX } from "react"
import { Modal } from "@components/common/Modal"
import { Button } from "@components/form/Button"
import { X, XCircle, Trash2 } from "lucide-react"

export type DeleteModalProps = {
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
    disabled: boolean
}

export function DeleteModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    disabled
}: DeleteModalProps): JSX.Element {
    return (
        <Modal isOpen={isOpen} onClose={onCancel}>
            <div className="modal-header">
                <div className="modal-title text-content text-bold text-primary">{title}</div>
                <button className="modal-close text-silent" onClick={onCancel} aria-label="Fermer">
                    <X size={20} />
                </button>
            </div> 

            <div className="modal-body text-small text-silent">
                <p>{message}</p>
            </div>

            <div className="modal-footer">
                <Button
                    variant="white"
                    icon={<XCircle size={20} />}
                    onClick={onCancel}
                    className="text-content text-medium"
                >
                    Annuler
                </Button>
                <Button
                    variant="delete"
                    icon={<Trash2 size={20} />}
                    onClick={onConfirm}
                    disabled={disabled}
                    className="text-content text-medium"
                >
                    {disabled ? "Suppression..." : "Supprimer"}
                </Button>
            </div>

        </Modal>
    )
}