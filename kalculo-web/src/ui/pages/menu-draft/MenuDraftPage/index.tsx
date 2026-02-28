import { useEffect, useMemo, useState } from 'react'
import type { ChildProfile } from '../../../../modules/child-profile'
import type { DailyMenuDraft, FoodItem } from '../../../../modules/menu-draft'
import {
  FoodItemNotFoundError,
  IncoherentFoodNutritionDataError,
  IncompleteFoodNutritionDataError,
  InvalidQuantityError,
} from '../../../../modules/menu-draft'
import { useUseCases } from '../../../../app/providers/useUseCases'
import { Alert, Button, Card, CardBody, CardHeader, Input } from '../../../design-system'
import './MenuDraftPage.css'

interface MenuDraftPageProps {
  parentId: string
  childProfile: ChildProfile
}

export const MenuDraftPage = ({ parentId, childProfile }: MenuDraftPageProps) => {
  const useCases = useUseCases()
  const currentDay = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const [foods, setFoods] = useState<FoodItem[]>([])
  const [draft, setDraft] = useState<DailyMenuDraft | null>(null)
  const [selectedFoodId, setSelectedFoodId] = useState('')
  const [quantityGrams, setQuantityGrams] = useState('100')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [foodCatalog, menuDraft] = await Promise.all([
          useCases.menuDraft.listFoodCatalogQuery(),
          useCases.menuDraft.getDailyDraftMenuQuery({
            parentId,
            childId: childProfile.id,
            day: currentDay,
          }),
        ])

        setFoods(foodCatalog)
        setDraft(menuDraft)

        if (foodCatalog.length > 0) {
          setSelectedFoodId(foodCatalog[0].id)
        }
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Erreur de chargement')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [childProfile.id, currentDay, parentId, useCases])

  const handleAddFood = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      setIsSubmitting(true)

      const updatedDraft = await useCases.menuDraft.addFoodToDraftMenuCommand({
        parentId,
        childId: childProfile.id,
        day: currentDay,
        foodId: selectedFoodId,
        quantityGrams: Number(quantityGrams),
      })

      setDraft(updatedDraft)
      setQuantityGrams('100')
    } catch (caught) {
      if (
        caught instanceof FoodItemNotFoundError ||
        caught instanceof InvalidQuantityError ||
        caught instanceof IncompleteFoodNutritionDataError ||
        caught instanceof IncoherentFoodNutritionDataError
      ) {
        setError(caught.message)
      } else {
        setError(caught instanceof Error ? caught.message : 'Erreur inconnue')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !draft) {
    return (
      <div className="menu-draft-page">
        <Card>
          <CardBody>
            <p>Chargement du menu brouillon...</p>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="menu-draft-page">
      <Card>
        <CardHeader className="menu-draft-page__header">
          <h1 className="menu-draft-page__title">Menu brouillon du jour</h1>
          <p className="menu-draft-page__subtitle">
            {childProfile.firstName} - {currentDay}
          </p>
        </CardHeader>

        <CardBody>
          {error && <Alert type="error">{error}</Alert>}

          <form className="menu-draft-page__form" onSubmit={handleAddFood}>
            <div className="menu-draft-page__field">
              <label className="menu-draft-page__label" htmlFor="food-select">
                Aliment
              </label>
              <select
                id="food-select"
                className="menu-draft-page__select"
                value={selectedFoodId}
                onChange={(event) => setSelectedFoodId(event.target.value)}
                disabled={isSubmitting}
              >
                {foods.map((food) => (
                  <option key={food.id} value={food.id}>
                    {food.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Quantite (g)"
              type="number"
              min={1}
              step="1"
              value={quantityGrams}
              onChange={(event) => setQuantityGrams(event.target.value)}
              disabled={isSubmitting}
              required
            />

            <Button type="submit" isLoading={isSubmitting}>
              Ajouter au menu
            </Button>
          </form>

          <section className="menu-draft-page__lines">
            <h2 className="menu-draft-page__lines-title">Lignes du brouillon</h2>

            {draft.lines.length === 0 && (
              <p className="menu-draft-page__empty">Aucune ligne pour le moment.</p>
            )}

            {draft.lines.map((line) => (
              <article key={line.id} className="menu-draft-page__line-item">
                <p className="menu-draft-page__line-title">
                  {line.foodName} - {line.quantityGrams}g
                </p>
                <p className="menu-draft-page__line-macros">
                  Totaux: {line.nutritionTotals.caloriesKcal} kcal, P {line.nutritionTotals.proteinGrams}g,
                  C {line.nutritionTotals.carbsGrams}g, L {line.nutritionTotals.fatsGrams}g
                </p>
                <p className="menu-draft-page__line-macros menu-draft-page__line-macros--snapshot">
                  Snapshot /100g: {line.nutritionPer100gSnapshot.caloriesKcal} kcal, P {line.nutritionPer100gSnapshot.proteinGrams}g,
                  C {line.nutritionPer100gSnapshot.carbsGrams}g, L {line.nutritionPer100gSnapshot.fatsGrams}g
                </p>
              </article>
            ))}
          </section>
        </CardBody>
      </Card>
    </div>
  )
}
