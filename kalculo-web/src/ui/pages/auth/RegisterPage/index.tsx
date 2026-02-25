import { useState } from 'react'
import type { Parent } from '../../../../modules/authentication'
import { Card, CardHeader, CardBody } from '../../../design-system'
import { RegisterForm } from '../forms/RegisterForm'
import './RegisterPage.css'

interface RegisterPageProps {
  onRegisterSuccess?: (parent: Parent) => void
  onNavigateToLogin?: () => void
}

export const RegisterPage = ({
  onRegisterSuccess,
  onNavigateToLogin,
}: RegisterPageProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleRegisterSuccess = (parent: Parent) => {
    setIsLoading(true)
    setTimeout(() => {
      onRegisterSuccess?.(parent)
    }, 1500)
  }

  return (
    <div className="register-page">
      <Card className="register-page__card">
        <CardHeader>
          <h1 className="register-page__title">Créer un compte</h1>
          <p className="register-page__subtitle">
            Inscrivez-vous pour accéder à Kalculo
          </p>
        </CardHeader>
        <CardBody>
          <RegisterForm onSuccess={handleRegisterSuccess} />

          <div className="register-page__footer">
            <p className="register-page__text">
              Vous avez déjà un compte ?{' '}
              <button
                type="button"
                className="register-page__link"
                onClick={onNavigateToLogin}
                disabled={isLoading}
              >
                Se connecter
              </button>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
