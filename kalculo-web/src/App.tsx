import { useEffect, useState } from 'react'
import './App.css'
import { AuthRouter } from './ui/pages'
import { TermsAcceptancePage } from './ui/pages/terms'
import { NutritionDashboard } from './ui/pages/nutrition'
import { ChildProfilePage } from './ui/pages/child-profile'
import type { SessionToken } from './modules/authentication'
import { ChildProfileNotFoundError } from './modules/child-profile'
import { useUseCases } from './app/providers/useUseCases'
import {
  type AppState,
  transitionAfterAuthentication,
  transitionAfterLogout,
  transitionAfterTermsStep,
} from './app/flow/appFlow'

function App() {
  const useCases = useUseCases()
  const [appState, setAppState] = useState<AppState>('auth')
  const [session, setSession] = useState<SessionToken | null>(null)
  const [hasChildProfile, setHasChildProfile] = useState<boolean | null>(null)

  useEffect(() => {
    const loadChildProfileState = async () => {
      if (appState !== 'authenticated' || !session) {
        setHasChildProfile(null)
        return
      }

      try {
        await useCases.childProfile.getChildProfileQuery(session.parentId)
        setHasChildProfile(true)
      } catch (caught) {
        if (caught instanceof ChildProfileNotFoundError) {
          setHasChildProfile(false)
          return
        }

        setHasChildProfile(false)
      }
    }

    loadChildProfileState()
  }, [appState, session, useCases])

  const handleAuthenticationSuccess = (sessionToken: SessionToken) => {
    const nextFlow = transitionAfterAuthentication(sessionToken)
    setSession(nextFlow.session)
    setAppState(nextFlow.appState)
    setHasChildProfile(null)
  }

  const handleTermsAcceptance = () => {
    const nextFlow = transitionAfterTermsStep(session)
    setSession(nextFlow.session)
    setAppState(nextFlow.appState)
  }

  const handleSkipTerms = () => {
    // Allow skipping for now, but this should require acceptance eventually
    const nextFlow = transitionAfterTermsStep(session)
    setSession(nextFlow.session)
    setAppState(nextFlow.appState)
  }

  const handleLogout = () => {
    const nextFlow = transitionAfterLogout()
    setSession(nextFlow.session)
    setAppState(nextFlow.appState)
    setHasChildProfile(null)
  }

  return (
    <main className="app-shell">
      {appState === 'auth' && (
        <AuthRouter onAuthenticationSuccess={handleAuthenticationSuccess} />
      )}

      {appState === 'terms' && session && (
        <TermsAcceptancePage
          parentId={session.parentId}
          onAcceptanceSuccess={handleTermsAcceptance}
          onSkip={handleSkipTerms}
        />
      )}

      {appState === 'authenticated' && session && (
        <div className="authenticated-view">
          <header className="header">
            <h1>Kalculo</h1>
            <div className="header__info">
              <p>Session Token: {session.token.substring(0, 20)}...</p>
              <p>Expire le: {new Date(session.expiresAt).toLocaleString('fr-FR')}</p>
            </div>
            <div className="header__actions">
              {hasChildProfile && (
                <button
                  className="secondary-btn"
                  onClick={() => setHasChildProfile(false)}
                >
                  Modifier profil enfant
                </button>
              )}
              <button className="logout-btn" onClick={handleLogout}>
                Déconnexion
              </button>
            </div>
          </header>

          <section className="main-content">
            {hasChildProfile === null && (
              <p className="main-content__status">Chargement du profil enfant...</p>
            )}

            {hasChildProfile === false && (
              <ChildProfilePage
                parentId={session.parentId}
                submitLabel="Enregistrer et continuer"
                onProfileSaved={() => setHasChildProfile(true)}
              />
            )}

            {hasChildProfile === true && <NutritionDashboard />}
          </section>
        </div>
      )}
    </main>
  )
}

export default App
