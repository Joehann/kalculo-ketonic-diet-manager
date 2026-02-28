import { describe, expect, it } from 'vitest'
import { MenuNotCompliantForSharingError } from '../../domain/errors/MenuDraftError'
import { buildAuthorizeDraftShareQuery } from './authorizeDraftShareQuery'

describe('buildAuthorizeDraftShareQuery', () => {
  it('allows share flow when draft is compliant', async () => {
    const query = buildAuthorizeDraftShareQuery(async () => ({
      status: 'compliant',
      totals: {
        caloriesKcal: 500,
        proteinGrams: 20,
        carbsGrams: 10,
        fatsGrams: 30,
      },
      targets: {
        proteinTargetGrams: 20,
        carbsTargetGrams: 10,
        fatsTargetGrams: 30,
      },
      deltas: {
        proteinGrams: 0,
        carbsGrams: 0,
        fatsGrams: 0,
      },
    }))

    await expect(
      query({
        parentId: 'parent-1',
        childId: 'child-1',
        day: '2026-02-28',
      }),
    ).resolves.toMatchObject({ status: 'compliant' })
  })

  it('blocks share flow when draft is non-compliant', async () => {
    const query = buildAuthorizeDraftShareQuery(async () => ({
      status: 'non-compliant',
      totals: {
        caloriesKcal: 600,
        proteinGrams: 30,
        carbsGrams: 20,
        fatsGrams: 35,
      },
      targets: {
        proteinTargetGrams: 20,
        carbsTargetGrams: 10,
        fatsTargetGrams: 30,
      },
      deltas: {
        proteinGrams: 10,
        carbsGrams: 10,
        fatsGrams: 5,
      },
    }))

    await expect(
      query({
        parentId: 'parent-1',
        childId: 'child-1',
        day: '2026-02-28',
      }),
    ).rejects.toBeInstanceOf(MenuNotCompliantForSharingError)
  })
})
