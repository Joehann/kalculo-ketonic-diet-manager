import type { PasswordHasherPort } from '../../application/ports/PasswordHasherPort'

/**
 * API adapter for Password Hasher - ready for backend integration.
 * Backend will handle all password hashing with bcrypt/Argon2.
 * Stub implementation; will be completed when backend is available.
 */
export class ApiPasswordHasherAdapter implements PasswordHasherPort {
  async hash(): Promise<string> {
    throw new Error('API adapter not yet implemented - use in-memory adapter for now')
  }

  async verify(): Promise<boolean> {
    throw new Error('API adapter not yet implemented - use in-memory adapter for now')
  }
}
