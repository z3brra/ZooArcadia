import { JSX } from 'react'
import logo from '../../../assets/arcadia_logo2.png'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../hook/AuthContext'

export function DashboardSideMenuHeader(): JSX.Element {
    const { user } = useAuth()

    const username = user
        ? user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.email
        : 'Utilisateur'

    return (
        <div className="dashboard-side-menu-header">
            <Link to="/dashboard">
                <img
                    src={logo}
                    alt="Logo Arcadia"
                    className="dashboard-side-menu-header-logo"
                />
            </Link>
            <h3 className="dashboard-side-menu-header-welcome text-subtitle">Bienvenue</h3>
            <p className="dashboard-side-menu-header-user">{username}</p>
        </div>
    )
}