

import {
    createBrowserRouter,
    RouterProvider,
    Outlet
} from 'react-router-dom'
import './scss/main.css'

import { AuthProvider } from './hook/AuthContext'
import { RequireAuth } from './components/RequireAuth'


import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Login } from './pages/auth/Login'

import { DashboardHome } from './pages/dashboard/DashboardHome'
import { DashboardSideMenu } from './components/dashboard/sidemenu/DashboardSideMenu'
import { Habitats } from './components/dashboard/pages/Habitats'
import { HabitatsReport } from './components/dashboard/pages/HabitatsReport'
import { Species } from './components/dashboard/pages/Species'
import { Animals } from './components/dashboard/pages/Animals'
import { AnimalsReport } from './components/dashboard/pages/AnimalsReport'
import { AnimalsFeed } from './components/dashboard/pages/AnimalsFeed'
import { Activity } from './components/dashboard/pages/Activity'
import { Reviews } from './components/dashboard/pages/Reviews'
import { Users } from './components/dashboard/pages/Users'



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
    return (
        <>
            <DashboardSideMenu />
            <main className="dashboard-main-content">
                <Outlet />
            </main>
        </>
    )
}

// const router = createBrowserRouter([
//     {
//         path: '/',
//         element: <RootLayout />,
//         children: [
//             { index: true, element: <Home /> },
//             { path: 'habitats', element: <Home /> },
//             { path: 'animals', element: <Home /> },
//             { path: 'activity', element: <Home /> },
//             { path: 'contact', element: <Home /> },
//             { path: 'login', element: <Login /> },
//         ]
//     },
//     {
//         path: '/dashboard',
//         element: (
//             <RequireAuth>
//                 <DashboardLayout />
//             </RequireAuth>
//         ),
//         children: [
//             { index: true, element: <DashboardHome /> },
//             { path: 'habitats', element: <Habitats /> },
//             { path: 'habitats-report', element: <HabitatsReport /> },
//             { path: 'species', element: <Species /> },
//             { path: 'animals', element: <Animals /> },
//             { path: 'animals-report', element: <AnimalsReport /> },
//             { path: 'animals-feed', element: <AnimalsFeed /> },
//             { path: 'activity', element: <Activity /> },
//             { path: 'reviews', element: <Reviews /> },
//             { path: 'users', element: <Users /> },
//             { path: 'statistics', element: <Home /> },
//         ]
//     }
// ])

// function App() {
//     return (
//         <AuthProvider>
//             <RouterProvider router={router} />
//         </AuthProvider>
//     )

// }

// export default App


const router = createBrowserRouter([
    {
        // Route « wrapper » qui injecte AuthProvider
        element: (
            <AuthProvider>
                <Outlet />
            </AuthProvider>
        ),
        children: [
            // Toutes les routes publiques
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
            // Toutes les routes protégées
            {
                path: '/dashboard',
                element: (
                    <RequireAuth>
                        <DashboardLayout />
                    </RequireAuth>
                ),
                children: [
                    { index: true, element: <DashboardHome /> },
                    { path: 'habitats', element: <Habitats /> },
                    { path: 'habitats-report', element: <HabitatsReport /> },
                    { path: 'species', element: <Species /> },
                    { path: 'animals', element: <Animals /> },
                    { path: 'animals-report', element: <AnimalsReport /> },
                    { path: 'animals-feed', element: <AnimalsFeed /> },
                    { path: 'activity', element: <Activity /> },
                    { path: 'reviews', element: <Reviews /> },
                    { path: 'users', element: <Users /> },
                    { path: 'statistics', element: <Home /> },
                ]
            }
        ]
    }
])

export default function App() {
    return <RouterProvider router={router} />
}

