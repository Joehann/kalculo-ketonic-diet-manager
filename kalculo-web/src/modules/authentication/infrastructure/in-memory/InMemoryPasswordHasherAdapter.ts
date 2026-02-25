import type { PasswordHasherPort } from '../../application/ports/PasswordHasherPort'

/**
 * Simple password hasher for in-memory development use.
 * WARNING: Not suitable for production. Use bcrypt, Argon2, or similar in production.
 */
export class InMemoryPasswordHasherAdapter implements PasswordHasherPort {
  async hash(password: string): Promise<string> {
    // Simple hash for development: just prefix with 'hashed-'
    // This is NOT cryptographically secure
    return `hashed-${btoa(password)}`
  }

  async verify(password: string, hash: string): Promise<boolean> {
    const expectedHash = `hashed-${btoa(password)}`
    return hash === expectedHash
  }
}
