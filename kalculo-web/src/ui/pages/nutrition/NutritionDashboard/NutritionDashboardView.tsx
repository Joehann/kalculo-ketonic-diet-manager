import type { DailyNutritionSummary } from '../../../../modules/nutrition/domain/DailyNutritionSummary'
import { MacroCard } from '../components/MacroCard'
import { calculateMacroPercentages } from './calculateMacroPercentages'

interface NutritionDashboardViewProps {
  summary: DailyNutritionSummary | null
  isLoading: boolean
  error: string | null
}

export const NutritionDashboardView = ({
  summary,
  isLoading,
  error,
}: NutritionDashboardViewProps) => {
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
        <div className="nutrition-dashboard__error">Erreur : {error}</div>
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

  const percentages = calculateMacroPercentages(summary)

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
        <h2 className="nutrition-dashboard__section-title">Calories totales</h2>
        <div className="nutrition-dashboard__calories-card">
          <div className="nutrition-dashboard__calories-value">
            {summary.caloriesKcal}{' '}
            <span className="nutrition-dashboard__calories-unit">kcal</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="nutrition-dashboard__section-title">Macronutriments</h2>
        <div className="nutrition-dashboard__macros-container">
          <MacroCard
            label="Protéines"
            value={summary.proteinGrams}
            unit="g"
            color="#ef4444"
            percentage={percentages.protein}
          />
          <MacroCard
            label="Glucides"
            value={summary.carbsGrams}
            unit="g"
            color="#f59e0b"
            percentage={percentages.carbs}
          />
          <MacroCard
            label="Lipides"
            value={summary.fatsGrams}
            unit="g"
            color="#8b5cf6"
            percentage={percentages.fats}
          />
        </div>
      </div>
    </div>
  )
}
