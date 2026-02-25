import { TermsNotAcceptedError } from '../../domain/errors/TermsError'
import type { TermsAcceptanceRepositoryPort } from '../ports/TermsAcceptanceRepositoryPort'
import type { TermsStoragePort } from '../ports/TermsStoragePort'

export type CheckTermsAcceptanceQuery = (parentId: string) => Promise<boolean>

export const buildCheckTermsAcceptanceQuery =
  (
    repositoryPort: TermsAcceptanceRepositoryPort,
    storagePort: TermsStoragePort,
  ): CheckTermsAcceptanceQuery =>
  async (parentId: string) => {
    const currentTerms = await storagePort.getCurrentTerms()
    const acceptance = await repositoryPort.findByParentId(parentId)

    if (!acceptance || acceptance.termsVersion !== currentTerms.version) {
      throw new TermsNotAcceptedError('Terms have not been accepted')
    }

    return true
  }
