import { JSX, useState, useRef, useEffect, useId } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export type SelectOption = {
    value: any
    label: string
    disabled?: boolean
}

export type CustomSelectProps = {
    label?: string
    placeholder?: string
    options: SelectOption[]
    value?: any
    disabled?: boolean
    onChange: (value: any) => void
}

export function CustomSelect({
    label,
    placeholder,
    options,
    value,
    disabled,
    onChange
}: CustomSelectProps): JSX.Element {
    const id = useId()

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onClickOutside = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', onClickOutside)
        return () => document.removeEventListener('mousedown', onClickOutside)
    }, [])

    const selected = options.find(option => option.value === value)

    const allOptions: SelectOption[] = placeholder ? [{ value: "", label: placeholder, disabled: true}, ...options] : options


    return (
        <div ref={containerRef} className="select-input">
            { label && (
                <label htmlFor={id} className="select-input-label text-content text-bold text-accent">
                    {label}
                </label>
            )}
            <div
                id={id}
                className={`select-input-field ${isOpen ? "open" : ""} ${disabled ? "select-input-disabled" : ""}`}
                onClick={() => !disabled && setIsOpen(open => !open)}
            >
                <span className={`select-input-value text-small ${!selected ? "text-silent" : "text-primary"}`}>
                    { selected?.label ?? placeholder ?? "Choisir une option"}
                </span>
                { isOpen
                    ? <ChevronUp size={20} className="select-input-icon" />
                    : <ChevronDown size={20} className="select-input-icon" />
                }
            </div>
            { isOpen && (
                <ul className="select-input-list">
                    {allOptions.map(option => {
                        const isDisabled = option.disabled ?? false
                        const isSelected = option.value === value
                        return (
                            <li
                                key={option.value}
                                className={`select-input-option text-small ${isSelected ? "selected text-secondary" : "text-primary"} ${isDisabled ? "disabled" : ""}`}
                                onClick={() => {
                                    if (!isDisabled) {
                                        onChange(option.value)
                                        setIsOpen(false)
                                    }
                                }}
                            >
                                {option.label}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
