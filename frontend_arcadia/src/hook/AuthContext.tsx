import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from 'react'
import { useNavigate } from 'react-router-dom'
import { postRequest, getRequest } from '../api/request'
import { Endpoints } from '../api/endpoints'

interface LoginResponse {
    message: string
    email: string
    mustChangePassword: boolean
    roles: string[]
}

interface CurrentUserResponse {
    uuid: string
    firstName: string
    lastName: string
    email: string
    roles: string[]
    mustChangePassword: boolean
  }

interface AuthContextType {
    user: CurrentUserResponse | null
    isAuthenticated: boolean
    loading: boolean
    hasRole: (role: string) => boolean
    hasAnyRole: (...role: string[]) => boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode}) {
    const navigate = useNavigate()

    const [user, setUser] = useState<CurrentUserResponse | null>(null)
    const [loading, setLoading] = useState(true)

    const isAuthenticated = Boolean(user)

    const hasRole = (role: string) => user?.roles.includes(role) ?? false
    const hasAnyRole = (...checks: string[]) => Boolean(user && checks.some(role => user.roles.includes(role)))

    useEffect(() => {
        getRequest<CurrentUserResponse>(Endpoints.ME)
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    const login = async (email: string, password: string) => {
        await postRequest<{ username: string; password: string }, LoginResponse>(
            Endpoints.LOGIN,
            { username: email, password }
        )
        const currentUser = await getRequest<CurrentUserResponse>(Endpoints.ME)
        setUser(currentUser)
        navigate('/dashboard')
    }

    const logout = () => {
        setUser(null)
        navigate('/login')
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                hasRole,
                hasAnyRole,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}