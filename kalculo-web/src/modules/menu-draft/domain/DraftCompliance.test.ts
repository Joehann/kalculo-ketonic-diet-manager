import { describe, expect, it } from 'vitest'
import type { DailyMenuDraft } from './MenuDraft'
import { assessDraftCompliance, calculateDraftNutritionTotals } from './DraftCompliance'

const sampleDraft: DailyMenuDraft = {
  id: 'draft-1',
  parentId: 'parent-1',
  childId: 'child-1',
  day: '2026-02-28',
  status: 'draft',
  lockedAt: null,
  updatedAt: new Date(),
  lines: [
    {
      id: 'line-1',
      foodId: 'food-egg',
      foodName: 'Oeuf',
      quantityGrams: 100,
      addedAt: new Date(),
      nutritionPer100gSnapshot: {
        caloriesKcal: 155,
        proteinGrams: 13,
        carbsGrams: 1,
        fatsGrams: 11,
      },
      nutritionTotals: {
        caloriesKcal: 155,
        proteinGrams: 13,
        carbsGrams: 1,
        fatsGrams: 11,
      },
    },
    {
      id: 'line-2',
      foodId: 'food-avocado',
      foodName: 'Avocat',
      quantityGrams: 100,
      addedAt: new Date(),
      nutritionPer100gSnapshot: {
        caloriesKcal: 160,
        proteinGrams: 2,
        carbsGrams: 8.5,
        fatsGrams: 14.7,
      },
      nutritionTotals: {
        caloriesKcal: 160,
        proteinGrams: 2,
        carbsGrams: 8.5,
        fatsGrams: 14.7,
      },
    },
  ],
}

describe('draft compliance domain helpers', () => {
  it('calculates menu totals from draft lines', () => {
    const totals = calculateDraftNutritionTotals(sampleDraft)

    expect(totals).toEqual({
      caloriesKcal: 315,
      proteinGrams: 15,
      carbsGrams: 9.5,
      fatsGrams: 25.7,
    })
  })

  it('returns compliant status when deltas stay in tolerance', () => {
    const result = assessDraftCompliance(
      {
        caloriesKcal: 315,
        proteinGrams: 15,
        carbsGrams: 10,
        fatsGrams: 26,
      },
      {
        proteinTargetGrams: 18,
        carbsTargetGrams: 12,
        fatsTargetGrams: 24,
      },
    )

    expect(result.status).toBe('compliant')
  })

  it('returns non-compliant status when one macro is outside tolerance', () => {
    const result = assessDraftCompliance(
      {
        caloriesKcal: 315,
        proteinGrams: 30,
        carbsGrams: 10,
        fatsGrams: 26,
      },
      {
        proteinTargetGrams: 18,
        carbsTargetGrams: 12,
        fatsTargetGrams: 24,
      },
    )

    expect(result.status).toBe('non-compliant')
    expect(result.deltas.proteinGrams).toBe(12)
  })
})
