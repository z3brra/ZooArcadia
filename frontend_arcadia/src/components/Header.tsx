import { Link, NavLink } from 'react-router-dom'

import { PUBLIC_ROUTES, DASHBOARD_ROUTES } from '@routes/paths'

import { useAuth } from '@hook/AuthContext'
import logo from '@assets/arcadia_logo2.png'

export function Header() {

    const { isAuthenticated } = useAuth()

    return (
        <header className="main-header">
            <div className="header-container">
                <Link to={PUBLIC_ROUTES.HOME}>
                    <img src={logo} alt="Logo Arcadia" className="app-logo" />
                </Link>

                <nav className="main-nav text-bigcontent">
                    <NavLink
                        to={PUBLIC_ROUTES.HOME}
                        end
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Accueil
                    </NavLink>
                    <NavLink
                        to={PUBLIC_ROUTES.HABITATS.TO}
                        end
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Habitats
                    </NavLink>
                    <NavLink
                        to={PUBLIC_ROUTES.ANIMALS.TO}
                        end
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Animaux
                    </NavLink>
                    <NavLink
                        to={PUBLIC_ROUTES.ACTIVITIES.TO}
                        end
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Activités
                    </NavLink>
                    <NavLink
                        to={PUBLIC_ROUTES.CONTACT.TO}
                        end
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Contact
                    </NavLink>


                    { isAuthenticated ? (
                        <NavLink
                            to={DASHBOARD_ROUTES.HOME}
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            Dashboard
                        </NavLink>
                    ) : (
                    <NavLink
                        to={PUBLIC_ROUTES.LOGIN.TO}
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Se connecter
                    </NavLink>
                    )}
                </nav>
            </div>
        </header>
    )
}
