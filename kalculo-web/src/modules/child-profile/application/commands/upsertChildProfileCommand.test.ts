import { describe, expect, it } from 'vitest'
import { buildUpsertChildProfileCommand } from './upsertChildProfileCommand'
import { InMemoryChildProfileRepositoryAdapter } from '../../infrastructure/in-memory/InMemoryChildProfileRepositoryAdapter'
import { InvalidDietProtocolError } from '../../domain/errors/ChildProfileError'

describe('buildUpsertChildProfileCommand', () => {
  it('creates a child profile for an authenticated parent', async () => {
    const repository = new InMemoryChildProfileRepositoryAdapter()
    const command = buildUpsertChildProfileCommand(repository)

    const result = await command({
      parentId: 'parent-1',
      firstName: 'Noa',
      protocol: 'ketogenic',
    })

    expect(result.parentId).toBe('parent-1')
    expect(result.firstName).toBe('Noa')
    expect(result.protocol).toBe('ketogenic')
  })

  it('updates existing child profile with new values', async () => {
    const repository = new InMemoryChildProfileRepositoryAdapter()
    const command = buildUpsertChildProfileCommand(repository)

    const created = await command({
      parentId: 'parent-1',
      firstName: 'Noa',
      protocol: 'ketogenic',
    })

    const updated = await command({
      parentId: 'parent-1',
      firstName: 'Mila',
      protocol: 'modified-atkins',
    })

    expect(updated.id).toBe(created.id)
    expect(updated.firstName).toBe('Mila')
    expect(updated.protocol).toBe('modified-atkins')
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
      created.updatedAt.getTime(),
    )
  })

  it('rejects invalid protocol with actionable message', async () => {
    const repository = new InMemoryChildProfileRepositoryAdapter()
    const command = buildUpsertChildProfileCommand(repository)

    await expect(
      command({
        parentId: 'parent-1',
        firstName: 'Noa',
        protocol: 'classic' as never,
      }),
    ).rejects.toBeInstanceOf(InvalidDietProtocolError)
  })
})
