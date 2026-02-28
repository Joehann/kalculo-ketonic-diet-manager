import type { DraftComplianceResult } from '../../domain/DraftCompliance'
import { MenuNotCompliantForSharingError } from '../../domain/errors/MenuDraftError'
import type { CalculateDraftComplianceQuery } from './calculateDraftComplianceQuery'

export type AuthorizeDraftShareQuery = (input: {
  parentId: string
  childId: string
  day: string
}) => Promise<DraftComplianceResult>

export const buildAuthorizeDraftShareQuery = (
  calculateDraftComplianceQuery: CalculateDraftComplianceQuery,
): AuthorizeDraftShareQuery => {
  return async (input) => {
    const compliance = await calculateDraftComplianceQuery(input)

    if (compliance.status !== 'compliant') {
      throw new MenuNotCompliantForSharingError(
        `Partage bloque: menu non conforme. Corrigez les ecarts (P ${formatDelta(compliance.deltas.proteinGrams)}g, C ${formatDelta(compliance.deltas.carbsGrams)}g, L ${formatDelta(compliance.deltas.fatsGrams)}g).`,
      )
    }

    return compliance
  }
}

const formatDelta = (value: number): string => {
  if (value > 0) {
    return `+${value}`
  }

  return `${value}`
}
