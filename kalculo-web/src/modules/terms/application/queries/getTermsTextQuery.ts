import type { Terms } from '../../domain/TermsAcceptance'
import type { TermsStoragePort } from '../ports/TermsStoragePort'

export type GetTermsTextQuery = (version?: string) => Promise<Terms>

export const buildGetTermsTextQuery =
  (storagePort: TermsStoragePort): GetTermsTextQuery =>
  async (version?: string) => {
    if (version) {
      const specific = await storagePort.getTermsByVersion(version)
      if (!specific) {
        throw new Error(`Terms version ${version} not found`)
      }
      return specific
    }

    return await storagePort.getCurrentTerms()
  }
