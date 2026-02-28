import { InvalidMacroTargetValueError } from './errors/MacroTargetsError'

export type MacroTargetsValues = {
  proteinTargetGrams: number
  carbsTargetGrams: number
  fatsTargetGrams: number
}

export type MacroTargets = MacroTargetsValues & {
  childId: string
  updatedAt: Date
  updatedByParentId: string
}

export type MacroTargetsHistoryEntry = {
  id: string
  childId: string
  changedAt: Date
  changedByParentId: string
  previousTargets: MacroTargetsValues | null
  newTargets: MacroTargetsValues
}

type SetMacroTargetsInput = {
  childId: string
  parentId: string
} & MacroTargetsValues

export const createMacroTargets = (input: SetMacroTargetsInput): MacroTargets => {
  assertValidChildId(input.childId)
  assertValidParentId(input.parentId)
  assertValidValues(input)

  return {
    childId: input.childId,
    updatedByParentId: input.parentId,
    updatedAt: new Date(),
    proteinTargetGrams: input.proteinTargetGrams,
    carbsTargetGrams: input.carbsTargetGrams,
    fatsTargetGrams: input.fatsTargetGrams,
  }
}

export const createMacroTargetsHistoryEntry = (
  childId: string,
  parentId: string,
  previousTargets: MacroTargetsValues | null,
  newTargets: MacroTargetsValues,
): MacroTargetsHistoryEntry => {
  assertValidChildId(childId)
  assertValidParentId(parentId)
  assertValidValues(newTargets)

  if (previousTargets) {
    assertValidValues(previousTargets)
  }

  return {
    id: `macro-history-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    childId,
    changedAt: new Date(),
    changedByParentId: parentId,
    previousTargets,
    newTargets,
  }
}

const assertValidChildId = (childId: string): void => {
  if (!childId || childId.trim().length === 0) {
    throw new Error('Child ID cannot be empty')
  }
}

const assertValidParentId = (parentId: string): void => {
  if (!parentId || parentId.trim().length === 0) {
    throw new Error('Parent ID cannot be empty')
  }
}

const assertValidValues = (values: MacroTargetsValues): void => {
  const entries: Array<[keyof MacroTargetsValues, number]> = [
    ['proteinTargetGrams', values.proteinTargetGrams],
    ['carbsTargetGrams', values.carbsTargetGrams],
    ['fatsTargetGrams', values.fatsTargetGrams],
  ]

  for (const [fieldName, fieldValue] of entries) {
    if (!Number.isFinite(fieldValue) || fieldValue < 0) {
      throw new InvalidMacroTargetValueError(
        `La valeur ${fieldName} doit etre un nombre positif ou nul`,
      )
    }
  }
}
