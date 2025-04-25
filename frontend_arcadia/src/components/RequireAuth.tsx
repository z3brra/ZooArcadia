import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@hook/AuthContext'

export function RequireAuth({ children }: { children: ReactNode }) {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return null
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location}} replace />
    }
    return <>{children}</>
}