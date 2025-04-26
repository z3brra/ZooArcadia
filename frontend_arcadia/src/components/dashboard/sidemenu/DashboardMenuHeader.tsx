import { JSX } from 'react'
import { Link } from 'react-router-dom'
import { DASHBOARD_ROUTES } from '@routes/paths'
import { useAuth } from '@hook/AuthContext'

import logo from '@assets/arcadia_logo2.png'

export function DashboardSideMenuHeader(): JSX.Element {
    const { user } = useAuth()

    const username = user
        ? user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.email
        : 'Utilisateur'

    return (
        <div className="dashboard-side-menu-header">
            <Link to={DASHBOARD_ROUTES.HOME}>
                <img
                    src={logo}
                    alt="Logo Arcadia"
                    className="dashboard-side-menu-header-logo"
                />
            </Link>
            <h3 className="dashboard-side-menu-header-welcome text-subtitle">Bienvenue</h3>
            <p className="dashboard-side-menu-header-user text-content">{username}</p>
        </div>
    )
}