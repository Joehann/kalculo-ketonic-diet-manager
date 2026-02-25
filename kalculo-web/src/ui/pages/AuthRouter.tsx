import { useState } from 'react'
import { LoginPage, RegisterPage } from './auth'
import type { SessionToken, Parent } from '../../modules/authentication'

type AuthView = 'login' | 'register'

interface AuthRouterProps {
  onAuthenticationSuccess?: (session: SessionToken) => void
}

export const AuthRouter = ({ onAuthenticationSuccess }: AuthRouterProps) => {
  const [currentView, setCurrentView] = useState<AuthView>('login')

  return (
    <>
      {currentView === 'login' && (
        <LoginPage
          onLoginSuccess={(session: SessionToken) => {
            onAuthenticationSuccess?.(session)
          }}
          onNavigateToRegister={() => setCurrentView('register')}
        />
      )}

      {currentView === 'register' && (
        <RegisterPage
          onRegisterSuccess={(_parent: Parent) => {
            setCurrentView('login')
          }}
          onNavigateToLogin={() => setCurrentView('login')}
        />
      )}
    </>
  )
}
