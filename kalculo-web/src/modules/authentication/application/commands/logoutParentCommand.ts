import type { SessionStoragePort } from '../ports/SessionStoragePort'

export type LogoutParentCommand = (token: string) => Promise<void>

export const buildLogoutParentCommand =
  (sessionPort: SessionStoragePort): LogoutParentCommand =>
  async (token: string) => {
    await sessionPort.deleteSession(token)
  }
