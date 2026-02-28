import { assertFoodItemNutritionUsable } from '../../domain/FoodItem'
import {
  appendLineToDraft,
  createDraftIfMissing,
  createDraftLine,
  type DailyMenuDraft,
} from '../../domain/MenuDraft'
import { FoodItemNotFoundError } from '../../domain/errors/MenuDraftError'
import type { FoodCatalogQueryPort } from '../ports/FoodCatalogQueryPort'
import type { MenuDraftRepositoryPort } from '../ports/MenuDraftRepositoryPort'

export type AddFoodToDraftMenuCommandInput = {
  parentId: string
  childId: string
  day: string
  foodId: string
  quantityGrams: number
}

export type AddFoodToDraftMenuCommand = (
  input: AddFoodToDraftMenuCommandInput,
) => Promise<DailyMenuDraft>

export const buildAddFoodToDraftMenuCommand = (
  draftRepositoryPort: MenuDraftRepositoryPort,
  foodCatalogQueryPort: FoodCatalogQueryPort,
): AddFoodToDraftMenuCommand => {
  return async (input) => {
    const food = await foodCatalogQueryPort.findFoodById(input.foodId)

    if (!food) {
      throw new FoodItemNotFoundError('Aliment introuvable dans le catalogue')
    }

    const validFood = assertFoodItemNutritionUsable(food)

    const existingDraft = await draftRepositoryPort.findDraftByParentChildAndDay(
      input.parentId,
      input.childId,
      input.day,
    )

    const draft = createDraftIfMissing(
      existingDraft,
      input.parentId,
      input.childId,
      input.day,
    )

    const newLine = createDraftLine(validFood, input.quantityGrams)
    const updatedDraft = appendLineToDraft(draft, newLine)

    await draftRepositoryPort.saveDraft(updatedDraft)

    return updatedDraft
  }
}
