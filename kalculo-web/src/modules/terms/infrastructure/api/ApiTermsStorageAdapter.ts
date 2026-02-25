import type { Terms } from '../../domain/TermsAcceptance'
import type { TermsStoragePort } from '../../application/ports/TermsStoragePort'

/**
 * API adapter for Terms Storage - ready for backend integration.
 * Backend will manage terms versioning and content delivery.
 * Stub implementation; will be completed when backend is available.
 */
export class ApiTermsStorageAdapter implements TermsStoragePort {
  async getCurrentTerms(): Promise<Terms> {
    throw new Error('API adapter not yet implemented - use in-memory adapter for now')
  }

  async getTermsByVersion(): Promise<Terms | null> {
    throw new Error('API adapter not yet implemented - use in-memory adapter for now')
  }
}
