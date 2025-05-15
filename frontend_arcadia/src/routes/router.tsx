import { createBrowserRouter, Outlet } from 'react-router-dom'

import { PUBLIC_ROUTES, DASHBOARD_ROUTES } from "@routes/paths"

import { RootLayout } from '@layout/RootLayout'
import { DashboardLayout } from '@layout/DashboardLayout'

import { AuthProvider } from '@hook/AuthContext'
import { RequireAuth } from '@components/RequireAuth'

import { Home } from '@pages/Home'
import { Login } from '@pages/auth/Login'

import { DashboardHome } from '@pages/dashboard/DashboardHome'

import { Habitats } from '@pages/dashboard/habitat/Habitats'
import { HabitatDetail } from '@pages/dashboard/habitat/HabitatDetail'
import { HabitatEdit } from '@pages/dashboard/habitat/HabitatEdit'

import { HabitatsReport } from '@pages/dashboard/habitatReport/HabitatsReport'
import { HabitatReportDetail } from '@pages/dashboard/habitatReport/HabitatReportDetail'
import { HabitatReportEdit } from '@pages/dashboard/habitatReport/HabitatReportEdit'

import { Species } from '@pages/dashboard/species/Species'
import { SpeciesDetail } from '@pages/dashboard/species/SpeciesDetail'
import { SpeciesEdit } from '@pages/dashboard/species/SpeciesEdit'


import { Animals } from '@pages/dashboard/animal/Animals'
import { AnimalDetail } from '@pages/dashboard/animal/AnimalDetail'
import { AnimalEdit } from '@pages/dashboard/animal/AnimalsEdit'
import { AnimalsReport } from '@pages/dashboard/animal/AnimalsReport'
import { AnimalsFeed } from '@pages/dashboard/animal/AnimalsFeed'

import { Activities } from '@pages/dashboard/activity/Activities'
import { ActivityDetail } from '@pages/dashboard/activity/ActivityDetail'
import { ActivityEdit } from '@pages/dashboard/activity/ActivityEdit'

import { Reviews } from '@pages/dashboard/Reviews'

import { Employee } from '@pages/dashboard/Users'

import { Statistics } from '@pages/dashboard/Statistics'


export const router = createBrowserRouter([
    {
        element: (
            <AuthProvider>
                <Outlet />
            </AuthProvider>
        ),
        children: [
            {
                path: PUBLIC_ROUTES.HOME,
                element: <RootLayout />,
                children: [
                    { index: true, element: <Home /> },
                    { path: PUBLIC_ROUTES.HABITATS.REL, element: <Home /> },
                    { path: PUBLIC_ROUTES.ANIMALS.REL, element: <Home /> },
                    { path: PUBLIC_ROUTES.ACTIVITIES.REL, element: <Home /> },
                    { path: PUBLIC_ROUTES.CONTACT.REL, element: <Home /> },
                    { path: PUBLIC_ROUTES.LOGIN.REL, element: <Login /> }
                ]
            },
            {
                path: DASHBOARD_ROUTES.HOME,
                element: (
                    <RequireAuth>
                        <DashboardLayout />
                    </RequireAuth>
                ),
                children: [
                    { index: true, element: <DashboardHome /> },
                    {
                        path: DASHBOARD_ROUTES.HABITATS.REL,
                        children: [
                            { index: true, element: <Habitats /> },
                            { path: DASHBOARD_ROUTES.HABITATS.DETAIL_PATTERN, element: <HabitatDetail /> },
                            { path: DASHBOARD_ROUTES.HABITATS.EDIT_PATTERN, element: <HabitatEdit /> }
                        ]
                    },
                    { 
                        path: DASHBOARD_ROUTES.HABITATS_REPORT.REL, 
                        children: [
                            { index: true, element: <HabitatsReport /> },
                            { path: DASHBOARD_ROUTES.HABITATS_REPORT.DETAIL_PATTERN, element: <HabitatReportDetail />},
                            { path: DASHBOARD_ROUTES.HABITATS_REPORT.EDIT_PATTERN, element: <HabitatReportEdit />}
                        ]
                    },
                    {
                        path: DASHBOARD_ROUTES.SPECIES.REL,
                        children: [
                            { index: true, element: <Species /> },
                            { path: DASHBOARD_ROUTES.SPECIES.DETAIL_PATTERN, element: <SpeciesDetail /> },
                            { path: DASHBOARD_ROUTES.SPECIES.EDIT_PATTERN, element: <SpeciesEdit />}
                        ]
                    },
                    { 
                        path: DASHBOARD_ROUTES.ANIMALS.REL,
                        children: [
                            { index: true, element: <Animals /> },
                            { path: DASHBOARD_ROUTES.ANIMALS.DETAIL_PATTERN, element: <AnimalDetail /> },
                            { path: DASHBOARD_ROUTES.ANIMALS.EDIT_PATTERN, element: <AnimalEdit />}
                        ]
                    },
                    { path: DASHBOARD_ROUTES.ANIMALS_REPORT.REL, element: <AnimalsReport /> },
                    { path: DASHBOARD_ROUTES.ANIMALS_FEED.REL, element: <AnimalsFeed /> },
                    {
                        path: DASHBOARD_ROUTES.ACTIVITES.REL,
                        children: [
                            { index: true, element: <Activities /> },
                            { path: DASHBOARD_ROUTES.ACTIVITES.DETAIL_PATTERN, element: <ActivityDetail /> },
                            { path: DASHBOARD_ROUTES.ACTIVITES.EDIT_PATTERN, element: <ActivityEdit />},
                        ]
                    },
                    { path: DASHBOARD_ROUTES.REVIEWS.REL, element: <Reviews /> },
                    { path: DASHBOARD_ROUTES.USERS.REL, element: <Employee /> },
                    { path: DASHBOARD_ROUTES.STATISTICS.REL, element: <Statistics /> },
                ]
            }
        ]
    }
])