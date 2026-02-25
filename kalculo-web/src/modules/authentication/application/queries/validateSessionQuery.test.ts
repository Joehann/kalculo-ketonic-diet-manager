import { describe, expect, it } from 'vitest'
import { buildValidateSessionQuery } from './validateSessionQuery'
import type { SessionStoragePort } from '../ports/SessionStoragePort'
import { SessionExpiredError } from '../../domain/errors/AuthenticationError'

describe('ValidateSessionQuery', () => {
  it('returns valid session for non-expired token', async () => {
    const validSession = {
      token: 'token-123',
      parentId: 'parent-1',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      createdAt: new Date(),
    }

    const sessionPort: SessionStoragePort = {
      async getSession(token) {
        if (token === 'token-123') {
          return validSession
        }
        return null
      },
      async saveSession() {},
      async deleteSession() {},
    }

    const query = buildValidateSessionQuery(sessionPort)
    const result = await query('token-123')

    expect(result.parentId).toBe('parent-1')
    expect(result.token).toBe('token-123')
  })

  it('throws SessionExpiredError for expired token', async () => {
    const expiredSession = {
      token: 'token-123',
      parentId: 'parent-1',
      expiresAt: new Date(Date.now() - 1000), // Expired
      createdAt: new Date(),
    }

    const sessionPort: SessionStoragePort = {
      async getSession(token) {
        if (token === 'token-123') {
          return expiredSession
        }
        return null
      },
      async saveSession() {},
      async deleteSession() {},
    }

    const query = buildValidateSessionQuery(sessionPort)

    await expect(query('token-123')).rejects.toThrow(SessionExpiredError)
  })

  it('throws SessionExpiredError for non-existent token', async () => {
    const sessionPort: SessionStoragePort = {
      async getSession() {
        return null
      },
      async saveSession() {},
      async deleteSession() {},
    }

    const query = buildValidateSessionQuery(sessionPort)

    await expect(query('invalid-token')).rejects.toThrow(SessionExpiredError)
  })
})
