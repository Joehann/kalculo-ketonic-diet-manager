import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import type { DailyNutritionSummary } from '../../../../modules/nutrition/domain/DailyNutritionSummary'
import { NutritionDashboardView } from './NutritionDashboardView'
import { calculateMacroPercentages } from './calculateMacroPercentages'

const sampleSummary: DailyNutritionSummary = {
  childFirstName: 'Lina',
  protocol: 'Ketogenic',
  caloriesKcal: 1450,
  proteinGrams: 45,
  carbsGrams: 30,
  fatsGrams: 75,
}

describe('calculateMacroPercentages', () => {
  it('returns expected percentages when total macros is positive', () => {
    const result = calculateMacroPercentages(sampleSummary)

    expect(result.protein).toBeCloseTo(30)
    expect(result.carbs).toBeCloseTo(20)
    expect(result.fats).toBeCloseTo(50)
  })

  it('returns zeros when total macros is zero', () => {
    const result = calculateMacroPercentages({
      ...sampleSummary,
      proteinGrams: 0,
      carbsGrams: 0,
      fatsGrams: 0,
    })

    expect(result).toEqual({
      protein: 0,
      carbs: 0,
      fats: 0,
    })
  })
})

describe('NutritionDashboardView', () => {
  it('renders loading state', () => {
    const html = renderToStaticMarkup(
      <NutritionDashboardView summary={null} isLoading error={null} />,
    )

    expect(html).toContain('Chargement des données nutrition')
  })

  it('renders error state', () => {
    const html = renderToStaticMarkup(
      <NutritionDashboardView
        summary={null}
        isLoading={false}
        error="network down"
      />,
    )

    expect(html).toContain('Erreur : network down')
  })

  it('renders nutrition summary details', () => {
    const html = renderToStaticMarkup(
      <NutritionDashboardView
        summary={sampleSummary}
        isLoading={false}
        error={null}
      />,
    )

    expect(html).toContain('Résumé Nutrition')
    expect(html).toContain('Lina')
    expect(html).toContain('Ketogenic')
    expect(html).toContain('1450')
    expect(html).toContain('30%')
    expect(html).toContain('20%')
    expect(html).toContain('50%')
  })
})
