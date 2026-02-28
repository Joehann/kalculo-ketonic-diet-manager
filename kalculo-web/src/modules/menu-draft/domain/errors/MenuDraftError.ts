export class MenuDraftError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MenuDraftError'
  }
}

export class FoodItemNotFoundError extends MenuDraftError {}
export class InvalidQuantityError extends MenuDraftError {}
export class IncompleteFoodNutritionDataError extends MenuDraftError {}
export class IncoherentFoodNutritionDataError extends MenuDraftError {}
export class DraftLineNotFoundError extends MenuDraftError {}
export class MenuNotCompliantForSharingError extends MenuDraftError {}
