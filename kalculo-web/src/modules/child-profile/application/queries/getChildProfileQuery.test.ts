import { describe, expect, it } from 'vitest'
import { buildGetChildProfileQuery } from './getChildProfileQuery'
import { buildUpsertChildProfileCommand } from '../commands/upsertChildProfileCommand'
import { InMemoryChildProfileRepositoryAdapter } from '../../infrastructure/in-memory/InMemoryChildProfileRepositoryAdapter'
import { ChildProfileNotFoundError } from '../../domain/errors/ChildProfileError'

describe('buildGetChildProfileQuery', () => {
  it('returns the persisted profile for the parent', async () => {
    const repository = new InMemoryChildProfileRepositoryAdapter()
    const saveProfile = buildUpsertChildProfileCommand(repository)
    const getProfile = buildGetChildProfileQuery(repository)

    await saveProfile({
      parentId: 'parent-1',
      firstName: 'Noa',
      protocol: 'ketogenic',
    })

    await expect(getProfile('parent-1')).resolves.toMatchObject({
      parentId: 'parent-1',
      firstName: 'Noa',
      protocol: 'ketogenic',
    })
  })

  it('throws when profile does not exist', async () => {
    const repository = new InMemoryChildProfileRepositoryAdapter()
    const getProfile = buildGetChildProfileQuery(repository)

    await expect(getProfile('missing-parent')).rejects.toBeInstanceOf(
      ChildProfileNotFoundError,
    )
  })
})
