import type { Parent } from '../../domain/Parent'
import type { ParentRepositoryPort } from '../../application/ports/ParentRepositoryPort'

/**
 * API adapter for Parent Repository - ready for backend integration.
 * Stub implementation; will be completed when backend is available.
 */
export class ApiParentRepositoryAdapter implements ParentRepositoryPort {
  async findByEmail(): Promise<Parent | null> {
    throw new Error('API adapter not yet implemented - use in-memory adapter for now')
  }

  async save(): Promise<void> {
    throw new Error('API adapter not yet implemented - use in-memory adapter for now')
  }

  async findById(): Promise<Parent | null> {
    throw new Error('API adapter not yet implemented - use in-memory adapter for now')
  }
}
