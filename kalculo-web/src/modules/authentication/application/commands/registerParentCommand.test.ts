import { describe, expect, it } from 'vitest'
import { buildRegisterParentCommand } from './registerParentCommand'
import type { ParentRepositoryPort } from '../ports/ParentRepositoryPort'
import type { PasswordHasherPort } from '../ports/PasswordHasherPort'
import type { Parent } from '../../domain/Parent'
import { DuplicateEmailError, InvalidPasswordError } from '../../domain/errors/AuthenticationError'

describe('RegisterParentCommand', () => {
  it('registers a new parent with valid email and password', async () => {
    const parents: Parent[] = []

    const repositoryPort: ParentRepositoryPort = {
      async findByEmail() {
        return null
      },
      async save(parent) {
        parents.push(parent)
      },
      async findById() {
        return null
      },
    }

    const hasherPort: PasswordHasherPort = {
      async hash(password) {
        return `hashed-${password}`
      },
      async verify() {
        return true
      },
    }

    const registerCommand = buildRegisterParentCommand(repositoryPort, hasherPort)
    const result = await registerCommand('test@example.com', 'SecurePassword123!')

    expect(parents).toHaveLength(1)
    expect(parents[0].email).toBe('test@example.com')
    expect(parents[0].passwordHash).toBe('hashed-SecurePassword123!')
    expect(result.email).toBe('test@example.com')
  })

  it('throws DuplicateEmailError when email already exists', async () => {
    const existingParent = {
      id: 'parent-1',
      email: 'test@example.com',
      passwordHash: 'hash',
      role: 'parent' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const repositoryPort: ParentRepositoryPort = {
      async findByEmail(email) {
        if (email === 'test@example.com') {
          return existingParent
        }
        return null
      },
      async save() {},
      async findById() {
        return null
      },
    }

    const hasherPort: PasswordHasherPort = {
      async hash() {
        return 'hash'
      },
      async verify() {
        return true
      },
    }

    const registerCommand = buildRegisterParentCommand(repositoryPort, hasherPort)

    await expect(
      registerCommand('test@example.com', 'SecurePassword123!'),
    ).rejects.toThrow(DuplicateEmailError)
  })

  it('throws InvalidPasswordError when password is too short', async () => {
    const repositoryPort: ParentRepositoryPort = {
      async findByEmail() {
        return null
      },
      async save() {},
      async findById() {
        return null
      },
    }

    const hasherPort: PasswordHasherPort = {
      async hash() {
        return 'hash'
      },
      async verify() {
        return true
      },
    }

    const registerCommand = buildRegisterParentCommand(repositoryPort, hasherPort)

    await expect(registerCommand('test@example.com', 'short')).rejects.toThrow(
      InvalidPasswordError,
    )
  })
})
