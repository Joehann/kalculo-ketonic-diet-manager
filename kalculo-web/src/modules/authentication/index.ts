// Domain
export * from './domain/Parent'
export * from './domain/errors/AuthenticationError'

// Application
export { type ParentRepositoryPort } from './application/ports/ParentRepositoryPort'
export { type PasswordHasherPort } from './application/ports/PasswordHasherPort'
export { type SessionStoragePort } from './application/ports/SessionStoragePort'
export {
  buildRegisterParentCommand,
  type RegisterParentCommand,
} from './application/commands/registerParentCommand'
export {
  buildLoginParentCommand,
  type LoginParentCommand,
} from './application/commands/loginParentCommand'
export {
  buildLogoutParentCommand,
  type LogoutParentCommand,
} from './application/commands/logoutParentCommand'
export {
  buildValidateSessionQuery,
  type ValidateSessionQuery,
} from './application/queries/validateSessionQuery'

// Infrastructure
export { InMemoryParentRepositoryAdapter } from './infrastructure/in-memory/InMemoryParentRepositoryAdapter'
export { InMemoryPasswordHasherAdapter } from './infrastructure/in-memory/InMemoryPasswordHasherAdapter'
export { InMemorySessionStorageAdapter } from './infrastructure/in-memory/InMemorySessionStorageAdapter'
export { ApiParentRepositoryAdapter } from './infrastructure/api/ApiParentRepositoryAdapter'
export { ApiPasswordHasherAdapter } from './infrastructure/api/ApiPasswordHasherAdapter'
export { ApiSessionStorageAdapter } from './infrastructure/api/ApiSessionStorageAdapter'

// Factory for use cases
import type { ParentRepositoryPort } from './application/ports/ParentRepositoryPort'
import type { PasswordHasherPort } from './application/ports/PasswordHasherPort'
import type { SessionStoragePort } from './application/ports/SessionStoragePort'
import { buildRegisterParentCommand } from './application/commands/registerParentCommand'
import { buildLoginParentCommand } from './application/commands/loginParentCommand'
import { buildLogoutParentCommand } from './application/commands/logoutParentCommand'
import { buildValidateSessionQuery } from './application/queries/validateSessionQuery'

export const buildAuthenticationUseCases = (
  parentRepositoryPort: ParentRepositoryPort,
  passwordHasherPort: PasswordHasherPort,
  sessionStoragePort: SessionStoragePort,
) => ({
  registerParentCommand: buildRegisterParentCommand(
    parentRepositoryPort,
    passwordHasherPort,
  ),
  loginParentCommand: buildLoginParentCommand(
    parentRepositoryPort,
    passwordHasherPort,
    sessionStoragePort,
  ),
  logoutParentCommand: buildLogoutParentCommand(sessionStoragePort),
  validateSessionQuery: buildValidateSessionQuery(sessionStoragePort),
})

export type AuthenticationUseCases = ReturnType<typeof buildAuthenticationUseCases>
