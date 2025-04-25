import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    useLocation
} from 'react-router-dom'
import './scss/main.css'
import { useState, useRef, useEffect } from 'react'

import { AuthProvider } from './hook/AuthContext'
import { RequireAuth } from './components/RequireAuth'


import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Login } from './pages/auth/Login'

import { DashboardHome } from './pages/dashboard/DashboardHome'
import { DashboardSideMenu } from './components/dashboard/sidemenu/DashboardSideMenu'
import { Habitats } from './pages/dashboard/habitat/Habitats'
import { HabitatDetail } from './pages/dashboard/habitat/HabitatDetail'
import { HabitatsReport } from './pages/dashboard/HabitatsReport'
import { Species } from './pages/dashboard/Species'
import { Animals } from './pages/dashboard/Animals'
import { AnimalsReport } from './pages/dashboard/AnimalsReport'
import { AnimalsFeed } from './pages/dashboard/AnimalsFeed'
import { Activities } from './pages/dashboard/Activities'
import { Reviews } from './pages/dashboard/Reviews'
import { Employee } from './pages/dashboard/Users'
import { Statistics } from './pages/dashboard/Statistics'

import { MobileHeaderMenu } from './components/dashboard/MobileHeaderMenu'


function RootLayout() {
    return (
        <>
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
        </>
    )
}

function DashboardLayout() {
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

            <DashboardSideMenu ref={menuRef} isOpen={isMenuOpen} />

            <main className="dashboard-main-content">
                <Outlet />
            </main>
        </>
    )
}

const router = createBrowserRouter([
    {
        element: (
            <AuthProvider>
                <Outlet />
            </AuthProvider>
        ),
        children: [
            {
                path: '/',
                element: <RootLayout />,
                children: [
                    { index: true, element: <Home /> },
                    { path: 'habitats', element: <Home /> },
                    { path: 'animals', element: <Home /> },
                    { path: 'activity', element: <Home /> },
                    { path: 'contact', element: <Home /> },
                    { path: 'login', element: <Login /> }
                ]
            },
            {
                path: '/dashboard',
                element: (
                    <RequireAuth>
                        <DashboardLayout />
                    </RequireAuth>
                ),
                children: [
                    { index: true, element: <DashboardHome /> },
                    // { path: 'habitats', element: <Habitats /> },
                    {
                        path: "habitats",
                        children: [
                            { index: true, element: <Habitats />},
                            { path: ":uuid", element: <HabitatDetail />}
                        ]
                    },
                    { path: 'habitats-report', element: <HabitatsReport /> },
                    { path: 'species', element: <Species /> },
                    { path: 'animals', element: <Animals /> },
                    { path: 'animals-report', element: <AnimalsReport /> },
                    { path: 'animals-feed', element: <AnimalsFeed /> },
                    { path: 'activities', element: <Activities /> },
                    { path: 'reviews', element: <Reviews /> },
                    { path: 'users', element: <Employee /> },
                    { path: 'statistics', element: <Statistics /> },
                ]
            }
        ]
    }
])

export default function App() {
    return <RouterProvider router={router} />
}

