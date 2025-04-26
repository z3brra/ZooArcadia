import { Outlet, useLocation } from "react-router-dom"
import { MobileHeaderMenu } from "@components/dashboard/MobileHeaderMenu"
import { DashboardSideMenu } from "@components/dashboard/sidemenu/DashboardSideMenu"
import { useState, useRef, useEffect} from "react"



export function DashboardLayout() {
    const [isMenuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLElement | null>(null)
    const location = useLocation()

    const toggleMenu = () => setMenuOpen(open => !open)
    const closeMenu = () => setMenuOpen(false)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isMenuOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                closeMenu()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMenuOpen])

    useEffect(() => {
        if (isMenuOpen) {
            closeMenu()
        }
    }, [location.pathname])

    return (
        <>
            <MobileHeaderMenu onToggle={toggleMenu} />

            <DashboardSideMenu ref={menuRef} isOpen={isMenuOpen}/>

            <main className="dashboard-main-content">
                <Outlet />
            </main>
        </>
    )
}