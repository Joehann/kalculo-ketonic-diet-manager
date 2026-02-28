import type { FoodCatalogQueryPort } from '../../application/ports/FoodCatalogQueryPort'
import type { FoodItem } from '../../domain/FoodItem'

const FOOD_CATALOG: FoodItem[] = [
  {
    id: 'food-egg',
    name: 'Oeuf',
    nutritionPer100g: {
      caloriesKcal: 155,
      proteinGrams: 13,
      carbsGrams: 1.1,
      fatsGrams: 11,
    },
  },
  {
    id: 'food-avocado',
    name: 'Avocat',
    nutritionPer100g: {
      caloriesKcal: 160,
      proteinGrams: 2,
      carbsGrams: 8.5,
      fatsGrams: 14.7,
    },
  },
  {
    id: 'food-salmon',
    name: 'Saumon',
    nutritionPer100g: {
      caloriesKcal: 208,
      proteinGrams: 20,
      carbsGrams: 0,
      fatsGrams: 13,
    },
  },
  {
    id: 'food-invalid-missing',
    name: 'Yaourt test (donnees incompletes)',
    nutritionPer100g: {
      caloriesKcal: Number.NaN,
      proteinGrams: 5,
      carbsGrams: 4,
      fatsGrams: 3,
    },
  },
  {
    id: 'food-invalid-incoherent',
    name: 'Barre test (donnees incoherentes)',
    nutritionPer100g: {
      caloriesKcal: 15,
      proteinGrams: 20,
      carbsGrams: 20,
      fatsGrams: 10,
    },
  },
]

export class InMemoryFoodCatalogQueryAdapter implements FoodCatalogQueryPort {
  async listFoods(): Promise<FoodItem[]> {
    return FOOD_CATALOG
  }

  async findFoodById(foodId: string): Promise<FoodItem | null> {
    return FOOD_CATALOG.find((food) => food.id === foodId) ?? null
  }
}
