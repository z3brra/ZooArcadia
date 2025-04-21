import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hook/AuthContext'
import logo from '../assets/arcadia_logo2.png'

export function Header() {

    const { isAuthenticated } = useAuth()

    return (
        <header className="main-header">
            <div className="header-container">
                <Link to="/">
                    <img src={logo} alt="Logo Arcadia" className="app-logo" />
                </Link>

                <nav className="main-nav text-bigcontent">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Accueil
                    </NavLink>
                    <NavLink
                        to="/habitats"
                        end
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Habitats
                    </NavLink>
                    <NavLink
                        to="/animals"
                        end
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Animaux
                    </NavLink>
                    <NavLink
                        to="/activity"
                        end
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Activités
                    </NavLink>
                    <NavLink
                        to="/contact"
                        end
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        Contact
                    </NavLink>


                    { isAuthenticated ? (
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            Dashboard
                        </NavLink>
                    ) : (
                    <NavLink
                        to="/login"
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
