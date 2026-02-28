import type { FoodCatalogQueryPort } from '../../application/ports/FoodCatalogQueryPort'
import type { FoodItem } from '../../domain/FoodItem'

export class ApiFoodCatalogQueryAdapter implements FoodCatalogQueryPort {
  async listFoods(): Promise<FoodItem[]> {
    throw new Error('Not implemented: API food catalog query adapter')
  }

  async findFoodById(_foodId: string): Promise<FoodItem | null> {
    void _foodId
    throw new Error('Not implemented: API food catalog query adapter')
  }
}
