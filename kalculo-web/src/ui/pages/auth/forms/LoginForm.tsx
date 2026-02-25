import { useState } from 'react'
import type { SessionToken } from '../../../../modules/authentication'
import { InvalidCredentialsError } from '../../../../modules/authentication'
import { useUseCases } from '../../../../app/providers/useUseCases'
import { useMutation } from '../../../hooks'
import { Input, Button, Alert } from '../../../design-system'
import './LoginForm.css'

interface LoginFormProps {
  onSuccess?: (session: SessionToken) => void
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const useCases = useUseCases()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { mutate, isLoading, error, data } = useMutation<
    SessionToken,
    Error,
    { email: string; password: string }
  >(
    async (credentials) => {
      return await useCases.authentication.loginParentCommand(
        credentials.email,
        credentials.password,
      )
    },
    {
      onSuccess: (session) => {
        setEmail('')
        setPassword('')
        onSuccess?.(session)
      },
    },
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = validateLoginForm(email, password)
    if (validation.error) {
      // Could be handled by state, but for now we show error from mutation
      return
    }

    mutate({ email, password })
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {error && (
        <Alert type="error">
          {error instanceof InvalidCredentialsError
            ? 'Email ou mot de passe invalide'
            : error.message}
        </Alert>
      )}

      {data && (
        <Alert type="success">
          Connexion réussie ! Redirection en cours...
        </Alert>
      )}

      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        placeholder="votre@email.com"
        disabled={isLoading}
        required
      />

      <Input
        type="password"
        label="Mot de passe"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        placeholder="••••••••"
        disabled={isLoading}
        required
      />

      <Button type="submit" isLoading={isLoading} size="md">
        Se connecter
      </Button>
    </form>
  )
}

const validateLoginForm = (
  email: string,
  password: string,
): { error?: string } => {
  if (!email.trim()) {
    return { error: 'Email is required' }
  }
  if (!password.trim()) {
    return { error: 'Password is required' }
  }
  return {}
}
