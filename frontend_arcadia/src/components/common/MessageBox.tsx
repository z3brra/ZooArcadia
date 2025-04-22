import { JSX } from "react";
import {
    Info,
    CircleCheck,
    CircleAlert,
    TriangleAlert,
    X,
} from "lucide-react";

export type MessageVariant = 'error' | 'warning' | 'success' | 'info'

export type MessageBoxProps = {
    variant?: MessageVariant
    message: string
    onClose: () => void
}

export function MessageBox({
    variant = 'info',
    message,
    onClose
}: MessageBoxProps): JSX.Element {
    const Icon = variant === 'error'
        ? CircleAlert
        : variant === 'warning'
        ? TriangleAlert
        : variant === 'success'
        ? CircleCheck
        : Info

    return (
        <div className={`message-box message-box-${variant}`}>
            <div className="message-box-icon">
                <Icon size={20} />
            </div>
            <span className="message-box-text text-content">{message}</span>
            <button
                type="button"
                className="message-box-close"
                onClick={onClose}
                aria-label="Fermer le message d'erreur"
            >
                <X size={20} />
            </button>
        </div>
    )
}

// export type ErrorMessageProps = {
//     message: string
//     onClose: () => void
// }

// export function ErrorMessage({
//     message,
//     onClose
// }: ErrorMessageProps): JSX.Element {
//     return (
//         <div className="error-message">
//             <span className="error-message-text text-content">{message}</span>
//             <button
//                 type="button"
//                 className="error-message-close"
//                 onClick={onClose}
//                 aria-label="Fermer le message d'erreur"
//             >
//                 <X size={20} />
//             </button>
//         </div>
//     )
// }