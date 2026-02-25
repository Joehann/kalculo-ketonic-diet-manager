import { useEffect, useState } from 'react'
import type { DailyNutritionSummary } from '../../../../modules/nutrition'
import { useUseCases } from '../../../../app/providers/useUseCases'
import { MacroCard } from '../components/MacroCard'
import './NutritionDashboard.css'

export const NutritionDashboard = () => {
  const useCases = useUseCases()
  const [summary, setSummary] = useState<DailyNutritionSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadNutritionData = async () => {
      try {
        setIsLoading(true)
        const data = await useCases.nutrition.getDailyNutritionSummaryQuery()
        setSummary(data)
        setError(null)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load nutrition data',
        )
        setSummary(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadNutritionData()
  }, [useCases])

  if (isLoading) {
    return (
      <div className="nutrition-dashboard">
        <div className="nutrition-dashboard__loading">Chargement des données nutrition...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="nutrition-dashboard">
        <div className="nutrition-dashboard__error">
          Erreur : {error}
        </div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="nutrition-dashboard">
        <div className="nutrition-dashboard__error">
          Aucune donnée nutrition disponible
        </div>
      </div>
    )
  }

  const totalMacros = summary.proteinGrams + summary.carbsGrams + summary.fatsGrams
  const proteinPercent = totalMacros > 0 ? (summary.proteinGrams / totalMacros) * 100 : 0
  const carbsPercent = totalMacros > 0 ? (summary.carbsGrams / totalMacros) * 100 : 0
  const fatsPercent = totalMacros > 0 ? (summary.fatsGrams / totalMacros) * 100 : 0

  return (
    <div className="nutrition-dashboard">
      <div className="nutrition-dashboard__header">
        <div>
          <h1 className="nutrition-dashboard__title">Résumé Nutrition</h1>
          <p className="nutrition-dashboard__subtitle">
            Suivi nutritionnel pour aujourd'hui
          </p>
          <div className="nutrition-dashboard__child-info">
            <div className="nutrition-dashboard__info-item">
              <span className="nutrition-dashboard__info-label">Enfant</span>
              <span className="nutrition-dashboard__info-value">
                {summary.childFirstName}
              </span>
            </div>
            <div className="nutrition-dashboard__info-item">
              <span className="nutrition-dashboard__info-label">Protocole</span>
              <span className="nutrition-dashboard__info-value">
                {summary.protocol}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', color: '#374151' }}>
          Calories totales
        </h2>
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#3b82f6' }}>
            {summary.caloriesKcal} <span style={{ fontSize: '1.125rem', color: '#6b7280' }}>kcal</span>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', color: '#374151' }}>
          Macronutriments
        </h2>
        <div className="nutrition-dashboard__macros-container">
          <MacroCard
            label="Protéines"
            value={summary.proteinGrams}
            unit="g"
            color="#ef4444"
            percentage={proteinPercent}
          />
          <MacroCard
            label="Glucides"
            value={summary.carbsGrams}
            unit="g"
            color="#f59e0b"
            percentage={carbsPercent}
          />
          <MacroCard
            label="Lipides"
            value={summary.fatsGrams}
            unit="g"
            color="#8b5cf6"
            percentage={fatsPercent}
          />
        </div>
      </div>
    </div>
  )
}
