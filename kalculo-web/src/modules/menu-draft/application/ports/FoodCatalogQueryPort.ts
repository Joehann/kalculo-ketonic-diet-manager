import type { FoodItem } from '../../domain/FoodItem'

export interface FoodCatalogQueryPort {
  listFoods(): Promise<FoodItem[]>
  findFoodById(foodId: string): Promise<FoodItem | null>
}
