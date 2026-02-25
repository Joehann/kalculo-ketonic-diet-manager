import type { Terms } from '../../domain/TermsAcceptance'

export interface TermsStoragePort {
  getCurrentTerms(): Promise<Terms>
  getTermsByVersion(version: string): Promise<Terms | null>
}
