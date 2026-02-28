import { useEffect, useMemo, useState } from 'react'
import type { ChildProfile } from '../../../../modules/child-profile'
import type {
  DailyMenuDraft,
  DraftComplianceResult,
  FoodItem,
} from '../../../../modules/menu-draft'
import {
  DraftLineNotFoundError,
  FoodItemNotFoundError,
  IncoherentFoodNutritionDataError,
  IncompleteFoodNutritionDataError,
  InvalidQuantityError,
  MenuNotCompliantForSharingError,
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
  const [lineQuantities, setLineQuantities] = useState<Record<string, string>>({})
  const [selectedFoodId, setSelectedFoodId] = useState('')
  const [quantityGrams, setQuantityGrams] = useState('100')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [complianceResult, setComplianceResult] = useState<DraftComplianceResult | null>(null)
  const [shareMessage, setShareMessage] = useState<string | null>(null)

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

  useEffect(() => {
    if (!draft) {
      return
    }

    setLineQuantities((previous) => {
      const nextLineQuantities: Record<string, string> = {}

      draft.lines.forEach((line) => {
        nextLineQuantities[line.id] = previous[line.id] ?? String(line.quantityGrams)
      })

      return nextLineQuantities
    })
  }, [draft])

  const handleAddFood = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setShareMessage(null)

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
      setComplianceResult(null)
      setQuantityGrams('100')
    } catch (caught) {
      if (
        caught instanceof FoodItemNotFoundError ||
        caught instanceof InvalidQuantityError ||
        caught instanceof IncompleteFoodNutritionDataError ||
        caught instanceof IncoherentFoodNutritionDataError ||
        caught instanceof DraftLineNotFoundError
      ) {
        setError(caught.message)
      } else {
        setError(caught instanceof Error ? caught.message : 'Erreur inconnue')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateLineQuantity = async (lineId: string) => {
    setError(null)
    setShareMessage(null)

    try {
      setIsSubmitting(true)

      const updatedDraft = await useCases.menuDraft.updateDraftLineQuantityCommand({
        parentId,
        childId: childProfile.id,
        day: currentDay,
        lineId,
        quantityGrams: Number(lineQuantities[lineId]),
      })

      setDraft(updatedDraft)
      setComplianceResult(null)
    } catch (caught) {
      if (
        caught instanceof InvalidQuantityError ||
        caught instanceof DraftLineNotFoundError
      ) {
        setError(caught.message)
      } else {
        setError(caught instanceof Error ? caught.message : 'Erreur inconnue')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveLine = async (lineId: string) => {
    setError(null)
    setShareMessage(null)

    try {
      setIsSubmitting(true)

      const updatedDraft = await useCases.menuDraft.removeDraftLineCommand({
        parentId,
        childId: childProfile.id,
        day: currentDay,
        lineId,
      })

      setDraft(updatedDraft)
      setComplianceResult(null)
    } catch (caught) {
      if (caught instanceof DraftLineNotFoundError) {
        setError(caught.message)
      } else {
        setError(caught instanceof Error ? caught.message : 'Erreur inconnue')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMoveLine = async (lineId: string, direction: 'up' | 'down') => {
    setError(null)
    setShareMessage(null)

    try {
      setIsSubmitting(true)

      const updatedDraft = await useCases.menuDraft.moveDraftLineCommand({
        parentId,
        childId: childProfile.id,
        day: currentDay,
        lineId,
        direction,
      })

      setDraft(updatedDraft)
      setComplianceResult(null)
    } catch (caught) {
      if (caught instanceof DraftLineNotFoundError) {
        setError(caught.message)
      } else {
        setError(caught instanceof Error ? caught.message : 'Erreur inconnue')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCalculateCompliance = async () => {
    setError(null)
    setShareMessage(null)

    try {
      setIsSubmitting(true)

      const result = await useCases.menuDraft.calculateDraftComplianceQuery({
        parentId,
        childId: childProfile.id,
        day: currentDay,
      })

      setComplianceResult(result)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erreur inconnue')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenShareFlow = async () => {
    setError(null)
    setShareMessage(null)

    try {
      setIsSubmitting(true)

      const result = await useCases.menuDraft.authorizeDraftShareQuery({
        parentId,
        childId: childProfile.id,
        day: currentDay,
      })

      setComplianceResult(result)
      setShareMessage(
        'Partage autorise: le menu est conforme et peut entrer dans le flow de partage.',
      )
    } catch (caught) {
      if (caught instanceof MenuNotCompliantForSharingError) {
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
          {shareMessage && <Alert type="success">{shareMessage}</Alert>}

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
                <div className="menu-draft-page__line-actions">
                  <Input
                    label="Quantite (g)"
                    type="number"
                    min={1}
                    step="1"
                    value={lineQuantities[line.id] ?? String(line.quantityGrams)}
                    onChange={(event) =>
                      setLineQuantities((previous) => ({
                        ...previous,
                        [line.id]: event.target.value,
                      }))
                    }
                    disabled={isSubmitting}
                  />
                  <div className="menu-draft-page__line-buttons">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={isSubmitting}
                      onClick={() => handleMoveLine(line.id, 'up')}
                    >
                      Monter
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={isSubmitting}
                      onClick={() => handleMoveLine(line.id, 'down')}
                    >
                      Descendre
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={isSubmitting}
                      onClick={() => handleUpdateLineQuantity(line.id)}
                    >
                      Mettre a jour
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      disabled={isSubmitting}
                      onClick={() => handleRemoveLine(line.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
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

          <section className="menu-draft-page__compliance">
            <div className="menu-draft-page__compliance-header">
              <h2 className="menu-draft-page__lines-title">Calcul de conformite</h2>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isSubmitting}
                onClick={handleCalculateCompliance}
              >
                Calculer conformite
              </Button>
            </div>

            {!complianceResult && (
              <p className="menu-draft-page__empty">
                Lancez le calcul pour voir les totaux et le statut.
              </p>
            )}

            {complianceResult && (
              <article className="menu-draft-page__compliance-card">
                <p
                  className={
                    complianceResult.status === 'compliant'
                      ? 'menu-draft-page__status menu-draft-page__status--ok'
                      : 'menu-draft-page__status menu-draft-page__status--ko'
                  }
                >
                  Statut: {complianceResult.status === 'compliant' ? 'Conforme' : 'Non conforme'}
                </p>
                <p className="menu-draft-page__line-macros">
                  Totaux: {complianceResult.totals.caloriesKcal} kcal, P {complianceResult.totals.proteinGrams}g, C {complianceResult.totals.carbsGrams}g, L {complianceResult.totals.fatsGrams}g
                </p>
                <p className="menu-draft-page__line-macros">
                  Cibles: P {complianceResult.targets.proteinTargetGrams}g, C {complianceResult.targets.carbsTargetGrams}g, L {complianceResult.targets.fatsTargetGrams}g
                </p>
                <p className="menu-draft-page__line-macros">
                  Ecarts: P {formatDelta(complianceResult.deltas.proteinGrams)}g, C {formatDelta(complianceResult.deltas.carbsGrams)}g, L {formatDelta(complianceResult.deltas.fatsGrams)}g
                </p>
              </article>
            )}

            <div className="menu-draft-page__share-action">
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                onClick={handleOpenShareFlow}
              >
                Ouvrir partage
              </Button>
            </div>
          </section>
        </CardBody>
      </Card>
    </div>
  )
}

const formatDelta = (value: number): string => {
  if (value > 0) {
    return `+${value}`
  }

  return `${value}`
}
