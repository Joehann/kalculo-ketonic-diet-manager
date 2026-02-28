import type { DailyMenuDraft, MenuDraftLineNutritionTotals } from './MenuDraft'
import type { MacroTargetsValues } from '../../macro-targets/domain/MacroTargets'

export type DraftComplianceStatus = 'compliant' | 'non-compliant'

export type DraftComplianceResult = {
  totals: MenuDraftLineNutritionTotals
  targets: MacroTargetsValues
  deltas: {
    proteinGrams: number
    carbsGrams: number
    fatsGrams: number
  }
  status: DraftComplianceStatus
}

const COMPLIANCE_TOLERANCE_GRAMS = 5

export const calculateDraftNutritionTotals = (
  draft: DailyMenuDraft,
): MenuDraftLineNutritionTotals => {
  return draft.lines.reduce(
    (accumulator, line) => ({
      caloriesKcal: round2(accumulator.caloriesKcal + line.nutritionTotals.caloriesKcal),
      proteinGrams: round2(accumulator.proteinGrams + line.nutritionTotals.proteinGrams),
      carbsGrams: round2(accumulator.carbsGrams + line.nutritionTotals.carbsGrams),
      fatsGrams: round2(accumulator.fatsGrams + line.nutritionTotals.fatsGrams),
    }),
    {
      caloriesKcal: 0,
      proteinGrams: 0,
      carbsGrams: 0,
      fatsGrams: 0,
    },
  )
}

export const assessDraftCompliance = (
  totals: MenuDraftLineNutritionTotals,
  targets: MacroTargetsValues,
): DraftComplianceResult => {
  const deltas = {
    proteinGrams: round2(totals.proteinGrams - targets.proteinTargetGrams),
    carbsGrams: round2(totals.carbsGrams - targets.carbsTargetGrams),
    fatsGrams: round2(totals.fatsGrams - targets.fatsTargetGrams),
  }

  const status: DraftComplianceStatus =
    Math.abs(deltas.proteinGrams) <= COMPLIANCE_TOLERANCE_GRAMS &&
    Math.abs(deltas.carbsGrams) <= COMPLIANCE_TOLERANCE_GRAMS &&
    Math.abs(deltas.fatsGrams) <= COMPLIANCE_TOLERANCE_GRAMS
      ? 'compliant'
      : 'non-compliant'

  return {
    totals,
    targets,
    deltas,
    status,
  }
}

const round2 = (value: number): number => Math.round(value * 100) / 100
