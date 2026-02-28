// Domain
export * from './domain/ChildProfile'
export * from './domain/errors/ChildProfileError'

// Application
export { type ChildProfileRepositoryPort } from './application/ports/ChildProfileRepositoryPort'
export {
  buildUpsertChildProfileCommand,
  type UpsertChildProfileCommand,
  type UpsertChildProfileCommandInput,
} from './application/commands/upsertChildProfileCommand'
export {
  buildGetChildProfileQuery,
  type GetChildProfileQuery,
} from './application/queries/getChildProfileQuery'

// Infrastructure
export { InMemoryChildProfileRepositoryAdapter } from './infrastructure/in-memory/InMemoryChildProfileRepositoryAdapter'
export { ApiChildProfileRepositoryAdapter } from './infrastructure/api/ApiChildProfileRepositoryAdapter'

// Factory for use cases
import type { ChildProfileRepositoryPort } from './application/ports/ChildProfileRepositoryPort'
import { buildGetChildProfileQuery } from './application/queries/getChildProfileQuery'
import { buildUpsertChildProfileCommand } from './application/commands/upsertChildProfileCommand'
import { ApiChildProfileRepositoryAdapter } from './infrastructure/api/ApiChildProfileRepositoryAdapter'
import { InMemoryChildProfileRepositoryAdapter } from './infrastructure/in-memory/InMemoryChildProfileRepositoryAdapter'

export type ChildProfileDataSource = 'inmemory' | 'api'

export const buildChildProfileUseCases = (dataSource: ChildProfileDataSource) => {
  const repositoryPort: ChildProfileRepositoryPort =
    dataSource === 'api'
      ? new ApiChildProfileRepositoryAdapter()
      : new InMemoryChildProfileRepositoryAdapter()

  return {
    getChildProfileQuery: buildGetChildProfileQuery(repositoryPort),
    upsertChildProfileCommand: buildUpsertChildProfileCommand(repositoryPort),
  }
}

export type ChildProfileUseCases = ReturnType<typeof buildChildProfileUseCases>
