import React from 'react'

export type DashboardSectionProps = {
    children: React.ReactNode
    className?: string
}

export function DashboardSection({
    children,
    className = ""
}: DashboardSectionProps): JSX.Element {
    return (
        <div className={`dashboard-section ${className}`}>
            {children}
        </div>
    )
}