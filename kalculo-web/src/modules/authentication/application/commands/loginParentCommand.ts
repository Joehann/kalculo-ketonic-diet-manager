import type { SessionToken } from '../../domain/Parent'
import { createSessionToken } from '../../domain/Parent'
import { InvalidCredentialsError } from '../../domain/errors/AuthenticationError'
import type { ParentRepositoryPort } from '../ports/ParentRepositoryPort'
import type { PasswordHasherPort } from '../ports/PasswordHasherPort'
import type { SessionStoragePort } from '../ports/SessionStoragePort'
import { isValidEmail } from '../../domain/Parent'

export type LoginParentCommand = (
  email: string,
  password: string,
) => Promise<SessionToken>

export const buildLoginParentCommand =
  (
    repositoryPort: ParentRepositoryPort,
    hasherPort: PasswordHasherPort,
    sessionPort: SessionStoragePort,
  ): LoginParentCommand =>
  async (email: string, password: string) => {
    // Validate email format (without exposing internal details)
    if (!isValidEmail(email)) {
      throw new InvalidCredentialsError('Invalid email or password')
    }

    // Find parent by email
    const parent = await repositoryPort.findByEmail(email)
    if (!parent) {
      throw new InvalidCredentialsError('Invalid email or password')
    }

    // Verify password
    const isPasswordValid = await hasherPort.verify(password, parent.passwordHash)
    if (!isPasswordValid) {
      throw new InvalidCredentialsError('Invalid email or password')
    }

    // Create session token
    const session = createSessionToken(parent.id)

    // Persist session
    await sessionPort.saveSession(session)

    return session
  }
