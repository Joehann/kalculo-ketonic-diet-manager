import { useState } from 'react'
import './App.css'
import { AuthRouter } from './ui/pages'
import { TermsAcceptancePage } from './ui/pages/terms'
import { NutritionDashboard } from './ui/pages/nutrition'
import type { SessionToken } from './modules/authentication'

// Import pour le OLD app (nutrition demo) - à décommenter pour tester
// import { useUseCases } from './app/providers/useUseCases'
// import type { DailyNutritionSummary } from './modules/nutrition/domain/DailyNutritionSummary'

type AppState = 'auth' | 'terms' | 'authenticated' | 'nutrition-demo'

function App() {
  const [appState, setAppState] = useState<AppState>('auth')
  const [session, setSession] = useState<SessionToken | null>(null)

  const handleAuthenticationSuccess = (sessionToken: SessionToken) => {
    setSession(sessionToken)
    setAppState('terms')
  }

  const handleTermsAcceptance = () => {
    setAppState('authenticated')
  }

  const handleSkipTerms = () => {
    // Allow skipping for now, but this should require acceptance eventually
    setAppState('authenticated')
  }

  const handleLogout = () => {
    setSession(null)
    setAppState('auth')
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
            <button className="logout-btn" onClick={handleLogout}>
              Déconnexion
            </button>
          </header>

          <section className="main-content">
            <NutritionDashboard />
          </section>
        </div>
      )}
    </main>
  )
}

export default App

/**
 * Alternative: Nutrition Demo
 * 
 * Pour tester la démo nutrition (ancienne version), décommenter le code ci-dessous
 * et changer le state initial de appState
 */
/*
function NutritionDemo() {
  const useCases = useUseCases()
  const [summary, setSummary] = useState<DailyNutritionSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    useCases.nutrition
      .getDailyNutritionSummaryQuery()
      .then((data) => setSummary(data))
      .catch((loadError: Error) => setError(loadError.message))
  }, [useCases])

  return (
    <>
      <header>
        <p className="badge">Kalculo - Front baseline</p>
        <h1>Simulation in-memory active</h1>
      </header>

      {error && <p className="error-text">Error: {error}</p>}

      {!error && !summary && <p>Loading fake data...</p>}

      {summary && (
        <section className="summary-card">
          <h2>Daily nutrition preview</h2>
          <ul>
            <li>
              <strong>Child:</strong> {summary.childFirstName}
            </li>
            <li>
              <strong>Protocol:</strong> {summary.protocol}
            </li>
            <li>
              <strong>Calories:</strong> {summary.caloriesKcal} kcal
            </li>
            <li>
              <strong>Protein:</strong> {summary.proteinGrams} g
            </li>
            <li>
              <strong>Carbs:</strong> {summary.carbsGrams} g
            </li>
            <li>
              <strong>Fats:</strong> {summary.fatsGrams} g
            </li>
          </ul>
          <p className="hint-text">
            The UI consumes use cases from React context. Adapter selection
            happens in the DI composition root through environment mapping.
          </p>
        </section>
      )}
    </>
  )
}
*/
