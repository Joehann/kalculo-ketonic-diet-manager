import { describe, expect, it } from 'vitest'
import { MacroTargetsNotConfiguredError } from '../../domain/errors/MacroTargetsError'
import { InMemoryMacroTargetsRepositoryAdapter } from '../../infrastructure/in-memory/InMemoryMacroTargetsRepositoryAdapter'
import { buildSetMacroTargetsCommand } from '../commands/setMacroTargetsCommand'
import { buildGetActiveMacroTargetsQuery } from './getActiveMacroTargetsQuery'

describe('buildGetActiveMacroTargetsQuery', () => {
  it('returns active targets for a child', async () => {
    const repository = new InMemoryMacroTargetsRepositoryAdapter()
    const setTargets = buildSetMacroTargetsCommand(repository)
    const getActiveTargets = buildGetActiveMacroTargetsQuery(repository)

    await setTargets({
      childId: 'child-1',
      parentId: 'parent-1',
      proteinTargetGrams: 45,
      carbsTargetGrams: 30,
      fatsTargetGrams: 80,
    })

    await expect(getActiveTargets('child-1')).resolves.toMatchObject({
      childId: 'child-1',
      proteinTargetGrams: 45,
      carbsTargetGrams: 30,
      fatsTargetGrams: 80,
      updatedByParentId: 'parent-1',
    })
  })

  it('throws when no active targets are configured', async () => {
    const repository = new InMemoryMacroTargetsRepositoryAdapter()
    const getActiveTargets = buildGetActiveMacroTargetsQuery(repository)

    await expect(getActiveTargets('missing-child')).rejects.toBeInstanceOf(
      MacroTargetsNotConfiguredError,
    )
  })
})
