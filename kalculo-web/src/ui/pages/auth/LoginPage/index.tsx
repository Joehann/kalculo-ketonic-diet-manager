import { useState } from 'react'
import type { SessionToken } from '../../../../modules/authentication'
import { Card, CardHeader, CardBody } from '../../../design-system'
import { LoginForm } from '../forms/LoginForm'
import './LoginPage.css'

interface LoginPageProps {
  onLoginSuccess?: (session: SessionToken) => void
  onNavigateToRegister?: () => void
}

export const LoginPage = ({
  onLoginSuccess,
  onNavigateToRegister,
}: LoginPageProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLoginSuccess = (session: SessionToken) => {
    setIsLoading(true)
    setTimeout(() => {
      onLoginSuccess?.(session)
    }, 1500)
  }

  return (
    <div className="login-page">
      <Card className="login-page__card">
        <CardHeader>
          <h1 className="login-page__title">Connexion</h1>
          <p className="login-page__subtitle">Connectez-vous à votre compte</p>
        </CardHeader>
        <CardBody>
          <LoginForm onSuccess={handleLoginSuccess} />

          <div className="login-page__footer">
            <p className="login-page__text">
              Pas de compte ?{' '}
              <button
                type="button"
                className="login-page__link"
                onClick={onNavigateToRegister}
                disabled={isLoading}
              >
                Créer un compte
              </button>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
