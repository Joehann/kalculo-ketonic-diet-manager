import type { TermsAcceptance } from '../../domain/TermsAcceptance'
import { createTermsAcceptance } from '../../domain/TermsAcceptance'
import { DuplicateAcceptanceError } from '../../domain/errors/TermsError'
import type { TermsAcceptanceRepositoryPort } from '../ports/TermsAcceptanceRepositoryPort'
import type { TermsStoragePort } from '../ports/TermsStoragePort'

export type AcceptTermsCommand = (parentId: string) => Promise<TermsAcceptance>

export const buildAcceptTermsCommand =
  (
    repositoryPort: TermsAcceptanceRepositoryPort,
    storagePort: TermsStoragePort,
  ): AcceptTermsCommand =>
  async (parentId: string) => {
    // Get current terms version
    const currentTerms = await storagePort.getCurrentTerms()

    // Check if parent already accepted this version
    const existing = await repositoryPort.findByParentId(parentId)
    if (existing && existing.termsVersion === currentTerms.version) {
      throw new DuplicateAcceptanceError(
        'Terms already accepted for this version',
      )
    }

    // Create acceptance record
    const acceptance = createTermsAcceptance(parentId, currentTerms.version)

    // Persist
    await repositoryPort.save(acceptance)

    return acceptance
  }
