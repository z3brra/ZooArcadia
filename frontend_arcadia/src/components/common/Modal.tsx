import React, { JSX, useEffect } from "react"

export type ModalProps = {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

export function Modal({
    isOpen,
    onClose,
    children
}: ModalProps): JSX.Element | null {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        }
    }, [isOpen])

    if (!isOpen) {
        return null
    }
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                onClick={event => event.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}