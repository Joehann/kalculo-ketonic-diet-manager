import { useEffect, useState } from 'react'
import './App.css'
import { AuthRouter } from './ui/pages'
import { TermsAcceptancePage } from './ui/pages/terms'
import { ChildProfilePage } from './ui/pages/child-profile'
import { MacroTargetsPage } from './ui/pages/macro-targets'
import { MenuDraftPage } from './ui/pages/menu-draft'
import type { SessionToken } from './modules/authentication'
import type { ChildProfile } from './modules/child-profile'
import { ChildProfileNotFoundError } from './modules/child-profile'
import { MacroTargetsNotConfiguredError } from './modules/macro-targets'
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
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null)
  const [hasMacroTargets, setHasMacroTargets] = useState<boolean | null>(null)

  useEffect(() => {
    const loadChildProfileState = async () => {
      if (appState !== 'authenticated' || !session) {
        setHasChildProfile(null)
        setChildProfile(null)
        setHasMacroTargets(null)
        return
      }

      try {
        const existingChildProfile = await useCases.childProfile.getChildProfileQuery(
          session.parentId,
        )
        setChildProfile(existingChildProfile)
        setHasChildProfile(true)
      } catch (caught) {
        if (caught instanceof ChildProfileNotFoundError) {
          setChildProfile(null)
          setHasChildProfile(false)
          setHasMacroTargets(null)
          return
        }

        setChildProfile(null)
        setHasChildProfile(false)
        setHasMacroTargets(null)
      }
    }

    loadChildProfileState()
  }, [appState, session, useCases])

  useEffect(() => {
    const loadMacroTargetsState = async () => {
      if (appState !== 'authenticated' || !session || !childProfile) {
        setHasMacroTargets(null)
        return
      }

      try {
        await useCases.macroTargets.getActiveMacroTargetsQuery(childProfile.id)
        setHasMacroTargets(true)
      } catch (caught) {
        if (caught instanceof MacroTargetsNotConfiguredError) {
          setHasMacroTargets(false)
          return
        }

        setHasMacroTargets(false)
      }
    }

    loadMacroTargetsState()
  }, [appState, childProfile, session, useCases])

  const handleAuthenticationSuccess = (sessionToken: SessionToken) => {
    const nextFlow = transitionAfterAuthentication(sessionToken)
    setSession(nextFlow.session)
    setAppState(nextFlow.appState)
    setHasChildProfile(null)
    setChildProfile(null)
    setHasMacroTargets(null)
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
    setChildProfile(null)
    setHasMacroTargets(null)
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
                  onClick={() => {
                    setHasChildProfile(false)
                    setHasMacroTargets(null)
                  }}
                >
                  Modifier profil enfant
                </button>
              )}
              {hasChildProfile && hasMacroTargets && (
                <button
                  className="secondary-btn"
                  onClick={() => setHasMacroTargets(false)}
                >
                  Modifier cibles macros
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
                onProfileSaved={(profile) => {
                  setChildProfile(profile)
                  setHasChildProfile(true)
                  setHasMacroTargets(false)
                }}
              />
            )}

            {hasChildProfile === true && hasMacroTargets === null && (
              <p className="main-content__status">Chargement des cibles macros...</p>
            )}

            {hasChildProfile === true && hasMacroTargets === false && childProfile && (
              <MacroTargetsPage
                parentId={session.parentId}
                childProfile={childProfile}
                onTargetsSaved={() => setHasMacroTargets(true)}
              />
            )}

            {hasChildProfile === true && hasMacroTargets === true && childProfile && (
              <MenuDraftPage
                parentId={session.parentId}
                childProfile={childProfile}
              />
            )}
          </section>
        </div>
      )}
    </main>
  )
}

export default App
