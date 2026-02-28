import { useEffect, useState } from 'react'
import type { DailyNutritionSummary } from '../../../../modules/nutrition/domain/DailyNutritionSummary'
import { useUseCases } from '../../../../app/providers/useUseCases'
import { NutritionDashboardView } from './NutritionDashboardView'
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

  return (
    <NutritionDashboardView
      summary={summary}
      isLoading={isLoading}
      error={error}
    />
  )
}
