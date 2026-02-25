import type { SessionToken } from '../../domain/Parent'
import type { SessionStoragePort } from '../../application/ports/SessionStoragePort'

const sessions: Map<string, SessionToken> = new Map()

export class InMemorySessionStorageAdapter implements SessionStoragePort {
  async saveSession(session: SessionToken): Promise<void> {
    sessions.set(session.token, session)
  }

  async getSession(token: string): Promise<SessionToken | null> {
    return sessions.get(token) || null
  }

  async deleteSession(token: string): Promise<void> {
    sessions.delete(token)
  }
}
