import { JSX } from "react"
import { Link } from "react-router-dom"
import { Menu } from "lucide-react"
import logo from "@assets/arcadia_logo2.png"

type MobileHeaderMenuProps = {
    onToggle: () => void
}

export function MobileHeaderMenu({ onToggle }: MobileHeaderMenuProps): JSX.Element {
    return (
        <header className="dashboard-mobile-header-menu">
            <div className="dashboard-mobile-header-menu-container">
                <Link to="/dashboard">
                    <img
                        src={logo}
                        alt="Logo Arcadia"
                        className="dashboard-mobile-header-menu-logo"
                    />
                </Link>
                <button
                    type="button"
                    className="dashboard-mobile-header-menu-button"
                    onClick={onToggle}
                >
                    <Menu size={30} />
                </button>
            </div>
        </header>
    )
}