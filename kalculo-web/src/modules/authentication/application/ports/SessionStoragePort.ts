import type { SessionToken } from '../../domain/Parent'

export interface SessionStoragePort {
  saveSession(session: SessionToken): Promise<void>
  getSession(token: string): Promise<SessionToken | null>
  deleteSession(token: string): Promise<void>
}
