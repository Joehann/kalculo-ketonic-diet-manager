import { useEffect, useState } from 'react'
import './App.css'
import { useUseCases } from './app/providers/useUseCases'
import type { DailyNutritionSummary } from './modules/nutrition/domain/DailyNutritionSummary'

function App() {
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
    <main className="app-shell">
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
    </main>
  )
}

export default App
