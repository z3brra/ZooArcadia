import React, { useState, useEffect } from 'react'
import logo from '../../../assets/arcadia_logo2.png'
import { Link } from 'react-router-dom'
import { getRequest } from '../../../api/request'
import { Endpoints } from '../../../api/endpoints'

interface MeResponse {
    firstname: string
    lastname: string
    email: string
}

export function DashboardSideMenuHeader(): JSX.Element {
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getRequest<MeResponse>(Endpoints.ME)
            .then(data => {
                const fullName =
                    data.firstName && data.lastName
                        ? `${data.firstName} ${data.lastName}`
                        : data.email
                setUsername(fullName)
            })
            .catch(responseError => {
                console.error('Erreur récupération profil:', responseError)
                setError('Impossible de charger le profil')
            })
            .finally(() => setLoading(false))
    }, [])

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
            {loading ? (
                <p className="dashboard-side-menu-header-user">…</p>
            ) : error ? (
                <p className="dashboard-side-menu-header-user error">{error}</p>
            ) : (
                <p className="dashboard-side-menu-header-user">{username}</p>
            )}
        </div>
    )
}