import { describe, expect, it } from 'vitest'
import { InvalidMacroTargetValueError } from '../../domain/errors/MacroTargetsError'
import { InMemoryMacroTargetsRepositoryAdapter } from '../../infrastructure/in-memory/InMemoryMacroTargetsRepositoryAdapter'
import { buildGetMacroTargetsHistoryQuery } from '../queries/getMacroTargetsHistoryQuery'
import { buildSetMacroTargetsCommand } from './setMacroTargetsCommand'

describe('buildSetMacroTargetsCommand', () => {
  it('creates active targets and writes first history entry with null previous values', async () => {
    const repository = new InMemoryMacroTargetsRepositoryAdapter()
    const setTargets = buildSetMacroTargetsCommand(repository)
    const getHistory = buildGetMacroTargetsHistoryQuery(repository)

    const result = await setTargets({
      childId: 'child-1',
      parentId: 'parent-1',
      proteinTargetGrams: 45,
      carbsTargetGrams: 30,
      fatsTargetGrams: 80,
    })

    const history = await getHistory('child-1')

    expect(result.proteinTargetGrams).toBe(45)
    expect(result.updatedByParentId).toBe('parent-1')
    expect(history).toHaveLength(1)
    expect(history[0].previousTargets).toBeNull()
    expect(history[0].newTargets).toEqual({
      proteinTargetGrams: 45,
      carbsTargetGrams: 30,
      fatsTargetGrams: 80,
    })
    expect(history[0].changedByParentId).toBe('parent-1')
  })

  it('preserves previous and new values in history when updating targets', async () => {
    const repository = new InMemoryMacroTargetsRepositoryAdapter()
    const setTargets = buildSetMacroTargetsCommand(repository)
    const getHistory = buildGetMacroTargetsHistoryQuery(repository)

    await setTargets({
      childId: 'child-1',
      parentId: 'parent-1',
      proteinTargetGrams: 40,
      carbsTargetGrams: 20,
      fatsTargetGrams: 90,
    })

    await setTargets({
      childId: 'child-1',
      parentId: 'parent-1',
      proteinTargetGrams: 50,
      carbsTargetGrams: 25,
      fatsTargetGrams: 95,
    })

    const history = await getHistory('child-1')

    expect(history).toHaveLength(2)
    expect(history[0].previousTargets).toEqual({
      proteinTargetGrams: 40,
      carbsTargetGrams: 20,
      fatsTargetGrams: 90,
    })
    expect(history[0].newTargets).toEqual({
      proteinTargetGrams: 50,
      carbsTargetGrams: 25,
      fatsTargetGrams: 95,
    })
  })

  it('rejects invalid macro values', async () => {
    const repository = new InMemoryMacroTargetsRepositoryAdapter()
    const setTargets = buildSetMacroTargetsCommand(repository)

    await expect(
      setTargets({
        childId: 'child-1',
        parentId: 'parent-1',
        proteinTargetGrams: -1,
        carbsTargetGrams: 25,
        fatsTargetGrams: 95,
      }),
    ).rejects.toBeInstanceOf(InvalidMacroTargetValueError)
  })
})
