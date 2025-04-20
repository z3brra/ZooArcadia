import React from 'react'
import logo from '../../../assets/arcadia_logo2.png'
import { Link } from 'react-router-dom'

type DashboardSideMenuHeaderProps = {
    username?: string
}

export function DashboardSideMenuHeader ({ username = "John Doe"}: DashboardSideMenuHeaderProps) {
    return (
        <div className="dashboard-side-menu-header">
            <Link to="/dashboard">
                <img src={logo} alt="Logo Arcadia" className="dashboard-side-menu-header-logo" />
            </Link>
            <h3 className="dashboard-side-menu-header-welcome">Bienvenue</h3>
            <p className="dashboard-side-menu-header-user">{username}</p>
        </div>
    )
}