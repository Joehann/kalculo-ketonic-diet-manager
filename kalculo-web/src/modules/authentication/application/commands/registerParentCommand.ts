import type { Parent } from '../../domain/Parent'
import { createParent, isValidPasswordFormat } from '../../domain/Parent'
import {
  DuplicateEmailError,
  InvalidPasswordError,
} from '../../domain/errors/AuthenticationError'
import type { ParentRepositoryPort } from '../ports/ParentRepositoryPort'
import type { PasswordHasherPort } from '../ports/PasswordHasherPort'

export type RegisterParentCommand = (
  email: string,
  password: string,
) => Promise<Parent>

export const buildRegisterParentCommand =
  (
    repositoryPort: ParentRepositoryPort,
    hasherPort: PasswordHasherPort,
  ): RegisterParentCommand =>
  async (email: string, password: string) => {
    // Validate password format
    if (!isValidPasswordFormat(password)) {
      throw new InvalidPasswordError(
        'Password must be 8-128 characters long',
      )
    }

    // Check for duplicate email
    const existing = await repositoryPort.findByEmail(email)
    if (existing) {
      throw new DuplicateEmailError(
        'An account with this email already exists',
      )
    }

    // Hash password
    const passwordHash = await hasherPort.hash(password)

    // Create parent domain object
    const parent = createParent(email, passwordHash)

    // Persist
    await repositoryPort.save(parent)

    return parent
  }
