import React from 'react'

export type DashboardPageHeaderProps = {
    icon: React.ReactNode
    title: string
    description?: string
}

export function DashboardPageHeader ({icon, title, description}: DashboardPageHeaderProps): JSX.Element {
    return (
        <div className="dashboard-page-header">
            <div className="dashboard-page-header-main text-primary">
                <span className="dashboard-page-header-icon">{icon}</span>
                <h1 className="dashboard-page-header-title text-subtitle">{title}</h1>
            </div>
            { description && (
                <p className="dashboard-page-header-description text-silent text-small">{description}</p>
            )}
        </div>
    )
}