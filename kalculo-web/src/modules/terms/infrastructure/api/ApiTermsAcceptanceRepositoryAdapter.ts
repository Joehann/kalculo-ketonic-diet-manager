import type { TermsAcceptance } from '../../domain/TermsAcceptance'
import type { TermsAcceptanceRepositoryPort } from '../../application/ports/TermsAcceptanceRepositoryPort'

/**
 * API adapter for Terms Acceptance Repository - ready for backend integration.
 * Stub implementation; will be completed when backend is available.
 */
export class ApiTermsAcceptanceRepositoryAdapter
  implements TermsAcceptanceRepositoryPort {
  async save(): Promise<void> {
    throw new Error('API adapter not yet implemented - use in-memory adapter for now')
  }

  async findByParentId(): Promise<TermsAcceptance | null> {
    throw new Error('API adapter not yet implemented - use in-memory adapter for now')
  }
}
