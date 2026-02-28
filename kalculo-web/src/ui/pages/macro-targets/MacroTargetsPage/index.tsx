import { useEffect, useState } from 'react'
import type {
  ChildProfile,
} from '../../../../modules/child-profile'
import type {
  MacroTargets,
  MacroTargetsHistoryEntry,
} from '../../../../modules/macro-targets'
import {
  InvalidMacroTargetValueError,
  MacroTargetsNotConfiguredError,
} from '../../../../modules/macro-targets'
import { useUseCases } from '../../../../app/providers/useUseCases'
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
} from '../../../design-system'
import './MacroTargetsPage.css'

interface MacroTargetsPageProps {
  parentId: string
  childProfile: ChildProfile
  onTargetsSaved?: (targets: MacroTargets) => void
}

export const MacroTargetsPage = ({
  parentId,
  childProfile,
  onTargetsSaved,
}: MacroTargetsPageProps) => {
  const useCases = useUseCases()
  const [proteinTargetGrams, setProteinTargetGrams] = useState('')
  const [carbsTargetGrams, setCarbsTargetGrams] = useState('')
  const [fatsTargetGrams, setFatsTargetGrams] = useState('')
  const [history, setHistory] = useState<MacroTargetsHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadTargetsAndHistory = async () => {
      try {
        setIsLoading(true)
        setError(null)

        try {
          const active = await useCases.macroTargets.getActiveMacroTargetsQuery(
            childProfile.id,
          )
          setProteinTargetGrams(String(active.proteinTargetGrams))
          setCarbsTargetGrams(String(active.carbsTargetGrams))
          setFatsTargetGrams(String(active.fatsTargetGrams))
        } catch (caught) {
          if (!(caught instanceof MacroTargetsNotConfiguredError)) {
            throw caught
          }
        }

        const entries = await useCases.macroTargets.getMacroTargetsHistoryQuery(
          childProfile.id,
        )
        setHistory(entries)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Erreur de chargement')
      } finally {
        setIsLoading(false)
      }
    }

    loadTargetsAndHistory()
  }, [childProfile.id, useCases])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)

    try {
      setIsSubmitting(true)

      const targets = await useCases.macroTargets.setMacroTargetsCommand({
        childId: childProfile.id,
        parentId,
        proteinTargetGrams: Number(proteinTargetGrams),
        carbsTargetGrams: Number(carbsTargetGrams),
        fatsTargetGrams: Number(fatsTargetGrams),
      })

      setProteinTargetGrams(String(targets.proteinTargetGrams))
      setCarbsTargetGrams(String(targets.carbsTargetGrams))
      setFatsTargetGrams(String(targets.fatsTargetGrams))

      const entries = await useCases.macroTargets.getMacroTargetsHistoryQuery(
        childProfile.id,
      )
      setHistory(entries)

      setSuccessMessage(
        'Cibles macros enregistrees. Les prochains calculs utiliseront cette configuration.',
      )
      onTargetsSaved?.(targets)
    } catch (caught) {
      if (caught instanceof InvalidMacroTargetValueError) {
        setError(caught.message)
      } else {
        setError(caught instanceof Error ? caught.message : 'Erreur inconnue')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="macro-targets-page">
        <Card className="macro-targets-page__card">
          <CardBody>
            <p>Chargement des cibles macros...</p>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="macro-targets-page">
      <Card className="macro-targets-page__card">
        <CardHeader className="macro-targets-page__header">
          <h1 className="macro-targets-page__title">Cibles macros</h1>
          <p className="macro-targets-page__subtitle">
            Definissez les objectifs nutritionnels de {childProfile.firstName}.
          </p>
        </CardHeader>

        <CardBody>
          {error && <Alert type="error">{error}</Alert>}
          {successMessage && <Alert type="success">{successMessage}</Alert>}

          <form className="macro-targets-page__form" onSubmit={handleSubmit}>
            <Input
              label="Proteines cible (g)"
              type="number"
              min={0}
              step="1"
              value={proteinTargetGrams}
              onChange={(event) => setProteinTargetGrams(event.target.value)}
              required
              disabled={isSubmitting}
            />

            <Input
              label="Glucides cible (g)"
              type="number"
              min={0}
              step="1"
              value={carbsTargetGrams}
              onChange={(event) => setCarbsTargetGrams(event.target.value)}
              required
              disabled={isSubmitting}
            />

            <Input
              label="Lipides cible (g)"
              type="number"
              min={0}
              step="1"
              value={fatsTargetGrams}
              onChange={(event) => setFatsTargetGrams(event.target.value)}
              required
              disabled={isSubmitting}
            />

            <Button type="submit" isLoading={isSubmitting}>
              Enregistrer les cibles
            </Button>
          </form>

          <div className="macro-targets-page__history">
            <h2 className="macro-targets-page__history-title">Historique des changements</h2>

            {history.length === 0 && (
              <p className="macro-targets-page__history-empty">
                Aucun historique pour le moment.
              </p>
            )}

            {history.map((entry) => (
              <article key={entry.id} className="macro-targets-page__history-item">
                <p className="macro-targets-page__history-meta">
                  {entry.changedAt.toLocaleString('fr-FR')} - acteur: {entry.changedByParentId}
                </p>
                <p className="macro-targets-page__history-values">
                  Ancien: {formatTargets(entry.previousTargets)}
                </p>
                <p className="macro-targets-page__history-values">
                  Nouveau: {formatTargets(entry.newTargets)}
                </p>
              </article>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

const formatTargets = (
  targets:
    | {
        proteinTargetGrams: number
        carbsTargetGrams: number
        fatsTargetGrams: number
      }
    | null,
): string => {
  if (!targets) {
    return 'n/a (premiere configuration)'
  }

  return `P:${targets.proteinTargetGrams}g C:${targets.carbsTargetGrams}g L:${targets.fatsTargetGrams}g`
}
