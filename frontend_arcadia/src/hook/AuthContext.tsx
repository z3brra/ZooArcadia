import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from 'react'
import { useNavigate } from 'react-router-dom'
import { postRequest } from '../api/request'
import { Endpoints } from '../api/endpoints'

interface AuthContextType {
    token: string | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode}) {
    const [token, setToken] = useState(
        () => localStorage.getItem('apiToken')
    )
    const navigate = useNavigate()

    const login = async (email: string, password: string) => {
        const body = { username: email, password}
        const data = await postRequest<typeof body, { apiToken: string }>(
            Endpoints.LOGIN,
            body
        )
        localStorage.setItem('apiToken', data.apiToken)
        setToken(data.apiToken)
        navigate('/dashboard')
    }

    const logout = () => {
        localStorage.removeItem('apiToken')
        setToken(null)
        navigate('/login')
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated: Boolean(token),
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