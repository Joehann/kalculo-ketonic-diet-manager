import type { FoodItem } from '../../domain/FoodItem'
import type { FoodCatalogQueryPort } from '../ports/FoodCatalogQueryPort'

export type ListFoodCatalogQuery = () => Promise<FoodItem[]>

export const buildListFoodCatalogQuery = (
  foodCatalogQueryPort: FoodCatalogQueryPort,
): ListFoodCatalogQuery => {
  return async () => {
    return foodCatalogQueryPort.listFoods()
  }
}
