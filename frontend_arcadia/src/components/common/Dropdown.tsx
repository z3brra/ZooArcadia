import React, { JSX, useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export type DropdownItemLeft = {
    icon: React.ReactNode
    text: string
    itemClassName?: string
}

export type DropdownItemProps = {
    leftItems: DropdownItemLeft[]
    className?: string
}

export function DropdownItem({
    leftItems,
    className = ""
}: DropdownItemProps): JSX.Element {
    return (
        <div className={`dropdown-item-left ${className}`}>
            { leftItems.map(({ icon, text, itemClassName }, i) => (
                <div key={i} className={`dropdown-item-left-pair ${itemClassName}`}>
                    <span className="dropdown-item-icon">{icon}</span>
                    <span className="dropdown-item-text">{text}</span>
                </div>
            ))}
        </div>
    )
}


export type LabelVariant = "red" | "yellow" | "blue" | "green" | "grey"

export type DropdownLabelProps = {
    label: string
    variant?: LabelVariant
}


export function DropdownLabel({
    label,
    variant = "blue"
}: DropdownLabelProps): JSX.Element {
    return (
        <div className="dropdown-item-right">
            <span className={`dropdown-item-label label-${variant} text-small`}>{label}</span>
        </div>
    )
}


export type DropdownProps = {
    triggerText: string
    className?: string
    children: React.ReactNode
}

export function Dropdown({
    triggerText,
    className = "",
    children
}: DropdownProps): JSX.Element {
    const [isMenuOpen, setMenuOpen] = useState<boolean>(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', onClickOutside)
        return () => {
            document.removeEventListener('mousedown', onClickOutside)
        }
    }, [])

    return (
        <div className={`dropdown ${className}`} ref={dropdownRef}>
            <button
                type="button"
                className="dropdown-trigger text-bigcontent text-primary"
                onClick={() => setMenuOpen(open => !open)}
            >
                <span className="dropdown-trigger-text">{triggerText}</span>
                { isMenuOpen ? <ChevronUp size={25} /> : <ChevronDown size={25} />}
            </button>

            { isMenuOpen && (
                <div className="dropdown-menu">
                    {children}
                </div>
            )}
        </div>
    )
}