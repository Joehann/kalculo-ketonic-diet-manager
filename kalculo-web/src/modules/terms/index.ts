// Domain
export * from './domain/TermsAcceptance'
export * from './domain/errors/TermsError'

// Application
export { type TermsAcceptanceRepositoryPort } from './application/ports/TermsAcceptanceRepositoryPort'
export { type TermsStoragePort } from './application/ports/TermsStoragePort'
export {
  buildAcceptTermsCommand,
  type AcceptTermsCommand,
} from './application/commands/acceptTermsCommand'
export {
  buildCheckTermsAcceptanceQuery,
  type CheckTermsAcceptanceQuery,
} from './application/queries/checkTermsAcceptanceQuery'
export {
  buildGetTermsTextQuery,
  type GetTermsTextQuery,
} from './application/queries/getTermsTextQuery'

// Infrastructure
export { InMemoryTermsAcceptanceRepositoryAdapter } from './infrastructure/in-memory/InMemoryTermsAcceptanceRepositoryAdapter'
export { InMemoryTermsStorageAdapter } from './infrastructure/in-memory/InMemoryTermsStorageAdapter'
export { ApiTermsAcceptanceRepositoryAdapter } from './infrastructure/api/ApiTermsAcceptanceRepositoryAdapter'
export { ApiTermsStorageAdapter } from './infrastructure/api/ApiTermsStorageAdapter'

// Factory for use cases
import type { TermsAcceptanceRepositoryPort } from './application/ports/TermsAcceptanceRepositoryPort'
import type { TermsStoragePort } from './application/ports/TermsStoragePort'
import { buildAcceptTermsCommand } from './application/commands/acceptTermsCommand'
import { buildCheckTermsAcceptanceQuery } from './application/queries/checkTermsAcceptanceQuery'
import { buildGetTermsTextQuery } from './application/queries/getTermsTextQuery'

export const buildTermsUseCases = (
  acceptanceRepositoryPort: TermsAcceptanceRepositoryPort,
  storagePort: TermsStoragePort,
) => ({
  acceptTermsCommand: buildAcceptTermsCommand(acceptanceRepositoryPort, storagePort),
  checkTermsAcceptanceQuery: buildCheckTermsAcceptanceQuery(
    acceptanceRepositoryPort,
    storagePort,
  ),
  getTermsTextQuery: buildGetTermsTextQuery(storagePort),
})

export type TermsUseCases = ReturnType<typeof buildTermsUseCases>
