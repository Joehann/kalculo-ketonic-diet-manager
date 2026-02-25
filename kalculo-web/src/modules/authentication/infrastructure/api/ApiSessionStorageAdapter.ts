import type { SessionToken } from '../../domain/Parent'
import type { SessionStoragePort } from '../../application/ports/SessionStoragePort'

/**
 * API adapter for Session Storage - ready for backend integration.
 * Backend will handle session persistence with Redis or similar.
 * Stub implementation; will be completed when backend is available.
 */
export class ApiSessionStorageAdapter implements SessionStoragePort {
  async saveSession(): Promise<void> {
    throw new Error('API adapter not yet implemented - use in-memory adapter for now')
  }

  async getSession(): Promise<SessionToken | null> {
    throw new Error('API adapter not yet implemented - use in-memory adapter for now')
  }

  async deleteSession(): Promise<void> {
    throw new Error('API adapter not yet implemented - use in-memory adapter for now')
  }
}
