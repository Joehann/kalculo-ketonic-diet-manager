import type { SessionToken } from '../../domain/Parent'
import { isSessionValid } from '../../domain/Parent'
import { SessionExpiredError } from '../../domain/errors/AuthenticationError'
import type { SessionStoragePort } from '../ports/SessionStoragePort'

export type ValidateSessionQuery = (token: string) => Promise<SessionToken>

export const buildValidateSessionQuery =
  (sessionPort: SessionStoragePort): ValidateSessionQuery =>
  async (token: string) => {
    const session = await sessionPort.getSession(token)

    if (!session) {
      throw new SessionExpiredError('Session not found or expired')
    }

    if (!isSessionValid(session)) {
      throw new SessionExpiredError('Session has expired')
    }

    return session
  }
