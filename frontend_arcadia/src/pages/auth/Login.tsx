import React, { JSX, useState } from "react"

import { LogIn } from 'lucide-react'

import { useAuth } from "@hook/AuthContext"

import { Input } from "@components/form/Input"
import { Button } from '@components/form/Button'

import { MessageBox } from "@components/common/MessageBox"

export function Login(): JSX.Element {
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState<string | null>(null)
    const [warning, setWarning] = useState<string | null>(null)

    const [fieldErrors, setFieldErrors] = useState<{
        email?: string
        password?: string
    }>({})

    const validateFields = () => {
        const errors: typeof fieldErrors = {}
        if (!email.trim()) {
            errors.email = "L'adresse email est requise..."
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Adresse email invalide."
        }
        if (!password) {
            errors.password = "Le mot de passe est requis."
        }
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!validateFields()) {
            return
        }

        setLoading(true)
        try {
            await login(email, password)
        } catch (error: any) {
            if (error.message.startsWith('Trop de tentatives')) {
                setWarning(error.message)
            } else if (error.response?.status === 401) {
                setError("Identifiants invalides.")
            } else {
                setError("Une erreur est survenue, merci de réessayer.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <form className="login-form" noValidate onSubmit={handleSubmit}>
                <h2 className="text-subtitle text-primary">Connexion au dashboard</h2>

                { error && (
                    <MessageBox variant="error" message={error} onClose={() => setError(null)}/>
                )}

                { warning && (
                    <MessageBox variant="warning" message={warning} onClose={() => setWarning(null)}/>
                )}

                <div className="login-form-field">
                    <Input
                        type="email"
                        label="Adresse email"
                        placeholder="john.doe@email.com"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.currentTarget.value)}
                    />
                    {fieldErrors.email && (
                        <div className="login-form-field-error text-small">
                            {fieldErrors.email}
                        </div>
                    )}
                </div>

                <div className="login-form-field">
                    <Input
                        type="password"
                        label="Mot de passe"
                        placeholder="Votre mot de passe"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
                    />
                    {fieldErrors.password && (
                        <div className="login-form-field-error text-small">
                            {fieldErrors.password}
                        </div>
                    )}
                </div>


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