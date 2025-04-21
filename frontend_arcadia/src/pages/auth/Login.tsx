import { JSX, useState } from "react"
// import { useNavigate } from "react-router-dom"

import { useAuth } from "../../hook/AuthContext"

// import { postRequest } from "../../api/request"
// import { Endpoints } from "../../api/endpoints"

import { Input } from "../../components/form/Input"
import { Button } from '../../components/form/Button'
import { LogIn } from 'lucide-react'

// interface LoginResponse {
//     message: string
//     email: string
//     mustChangePassword: boolean
//     apiToken: string
//     roles: string[]
// }

export function Login(): JSX.Element {
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    // const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!email.trim() || !password) {
            setError('Veuillez renseigner votre email et votre mot de passe.')
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Adresse email invalide.')
            return
        }

        setLoading(true)
        try {
            await login(email, password)
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError('Identifiants invalides.')
            } else {
                setError('Une erreur est survenue. Merci de réessayer.')
            }
        } finally {
            setLoading(false)
        }
    }

    // const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    //     e.preventDefault()
    //     console.log('Connexion cliquée')
    // }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="text-subtitle text-primary">Connexion au dashboard</h2>

                {error && <div className="login-error text-content">{error}</div>}

                <Input
                    type="email"
                    label="Adresse email"
                    placeholder="john.doe@email.com"
                    value={email}
                    onChange={e => setEmail(e.currentTarget.value)}
                />
                <Input
                    type="password"
                    label="Mot de passe"
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={e => setPassword(e.currentTarget.value)}
                />

                <Button
                    variant="primary"
                    type="submit"
                    onClick={() => { }}
                    disabled={loading}
                    icon={<LogIn size={20} />}
                    className="text-content"
                >
                    {loading ? 'Connexion…' : 'Se connecter'}
                </Button>
            </form>

        </div>
    )
}