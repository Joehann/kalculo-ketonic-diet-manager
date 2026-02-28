import { describe, expect, it } from 'vitest'
import { InMemoryMacroTargetsRepositoryAdapter } from '../../infrastructure/in-memory/InMemoryMacroTargetsRepositoryAdapter'
import { buildSetMacroTargetsCommand } from '../commands/setMacroTargetsCommand'
import { buildGetMacroTargetsHistoryQuery } from './getMacroTargetsHistoryQuery'

describe('buildGetMacroTargetsHistoryQuery', () => {
  it('returns timestamped history entries including actor and values', async () => {
    const repository = new InMemoryMacroTargetsRepositoryAdapter()
    const setTargets = buildSetMacroTargetsCommand(repository)
    const getHistory = buildGetMacroTargetsHistoryQuery(repository)

    await setTargets({
      childId: 'child-1',
      parentId: 'parent-1',
      proteinTargetGrams: 45,
      carbsTargetGrams: 30,
      fatsTargetGrams: 80,
    })

    const history = await getHistory('child-1')

    expect(history).toHaveLength(1)
    expect(history[0].changedByParentId).toBe('parent-1')
    expect(history[0].changedAt).toBeInstanceOf(Date)
    expect(history[0].newTargets).toEqual({
      proteinTargetGrams: 45,
      carbsTargetGrams: 30,
      fatsTargetGrams: 80,
    })
  })
})
