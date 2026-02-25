import { describe, expect, it } from 'vitest'
import { buildLoginParentCommand } from './loginParentCommand'
import type { ParentRepositoryPort } from '../ports/ParentRepositoryPort'
import type { PasswordHasherPort } from '../ports/PasswordHasherPort'
import type { SessionStoragePort } from '../ports/SessionStoragePort'
import type { SessionToken } from '../../domain/Parent'
import { InvalidCredentialsError } from '../../domain/errors/AuthenticationError'

describe('LoginParentCommand', () => {
  it('logs in a parent with valid credentials', async () => {
    const existingParent = {
      id: 'parent-1',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      role: 'parent' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const sessions: SessionToken[] = []

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
      async verify(password, hash) {
        return hash === 'hashed-password' && password === 'password'
      },
    }

    const sessionPort: SessionStoragePort = {
      async saveSession(session) {
        sessions.push(session)
      },
      async getSession() {
        return null
      },
      async deleteSession() {},
    }

    const loginCommand = buildLoginParentCommand(
      repositoryPort,
      hasherPort,
      sessionPort,
    )

    const result = await loginCommand('test@example.com', 'password')

    expect(result.parentId).toBe('parent-1')
    expect(result.token).toBeDefined()
    expect(sessions).toHaveLength(1)
  })

  it('throws InvalidCredentialsError when password is incorrect', async () => {
    const existingParent = {
      id: 'parent-1',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
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
        return false
      },
    }

    const sessionPort: SessionStoragePort = {
      async saveSession() {},
      async getSession() {
        return null
      },
      async deleteSession() {},
    }

    const loginCommand = buildLoginParentCommand(
      repositoryPort,
      hasherPort,
      sessionPort,
    )

    await expect(loginCommand('test@example.com', 'wrongpassword')).rejects.toThrow(
      InvalidCredentialsError,
    )
  })

  it('throws InvalidCredentialsError when email not found', async () => {
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
        return false
      },
    }

    const sessionPort: SessionStoragePort = {
      async saveSession() {},
      async getSession() {
        return null
      },
      async deleteSession() {},
    }

    const loginCommand = buildLoginParentCommand(
      repositoryPort,
      hasherPort,
      sessionPort,
    )

    await expect(
      loginCommand('nonexistent@example.com', 'password'),
    ).rejects.toThrow(InvalidCredentialsError)
  })
})
