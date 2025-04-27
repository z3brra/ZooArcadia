import React, { JSX } from "react"
import { Modal } from "@components/common/Modal"
import { Button } from "@components/form/Button"

import { X, XCircle, Save } from "lucide-react"

export type CreateModalProps = {
    isOpen: boolean
    title: string
    message?: string
    onCancel: () => void
    onSubmit: () => void
    children: React.ReactNode
}

export function CreateModal({
    isOpen,
    title,
    message,
    onCancel,
    onSubmit,
    children
}: CreateModalProps): JSX.Element {
    return (
        <Modal isOpen={isOpen} onClose={onCancel}>
            <div className="modal-header">
                <div>
                    <div className="modal-title text-bigcontent text-bold text-primary">{title}</div>
                    { message && <p className="modal-message text-small text-silent">{message}</p>}
                </div>
                <button className="modal-close text-silent" onClick={onCancel} aria-label="Fermer">
                    <X size={20} />
                </button>
            </div>

            {children}

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
                    variant="primary"
                    icon={<Save size={20} />}
                    onClick={onSubmit}
                    className="text-content text-medium"
                >
                    Supprimer
                </Button>
            </div>
        </Modal>
    )
}