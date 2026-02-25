import { describe, expect, it } from 'vitest'
import { buildLogoutParentCommand } from './logoutParentCommand'
import type { SessionStoragePort } from '../ports/SessionStoragePort'

describe('LogoutParentCommand', () => {
  it('successfully logs out a parent by deleting session', async () => {
    const deletedTokens: string[] = []

    const sessionPort: SessionStoragePort = {
      async saveSession() {},
      async getSession() {
        return null
      },
      async deleteSession(token) {
        deletedTokens.push(token)
      },
    }

    const logoutCommand = buildLogoutParentCommand(sessionPort)
    await logoutCommand('token-123')

    expect(deletedTokens).toContain('token-123')
  })
})
