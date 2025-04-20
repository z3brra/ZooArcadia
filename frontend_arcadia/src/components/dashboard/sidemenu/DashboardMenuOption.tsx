import React from 'react'
import { NavLink, To } from 'react-router-dom'

type SideMenuOptionProps = {
    to: To
    label: string
    icon: React.ReactNode
    end?: boolean
}

export function SideMenuOption({ to, label, icon, end = false}: SideMenuOptionProps) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => isActive ? 'dashboard-side-menu-option dashboard-side-menu-option-active': 'dashboard-side-menu-option'}
        >
            <span className="dashboard-side-menu-option-icon">{icon}</span>
            <span className="dashboard-side-menu-option-label text-content">{label}</span>
        </NavLink>
    )
}