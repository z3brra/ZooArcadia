import React, { JSX, useId } from "react"

export type InputProps = {
    type?: React.HTMLInputTypeAttribute | 'textarea'
    label?: string
} & (
    | React.InputHTMLAttributes<HTMLInputElement>
    | React.TextareaHTMLAttributes<HTMLTextAreaElement>
)

export function Input ({
    type = 'text',
    label,
    ...props
}: InputProps): JSX.Element {
    const id = useId()

    if (type === 'textarea') {
        return (
            <div className="text-input">
                {label && (
                    <label htmlFor={id} className="text-input-label text-content">
                        {label}
                    </label>
                )}
                <textarea
                    id={id}
                    {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    className="text-input-field"
                />
            </div>
        )
    }

    return (
        <div className="text-input">
            {label && (
                <label htmlFor={id} className="text-input-label text-content text-accent">
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                className="text-input-field text-small text-primary"
            />
        </div>
    )

}