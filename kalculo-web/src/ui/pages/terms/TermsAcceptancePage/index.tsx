import { useEffect, useState } from 'react'
import type { TermsAcceptance } from '../../../../modules/terms'
import {
  DuplicateAcceptanceError,
} from '../../../../modules/terms'
import { useUseCases } from '../../../../app/providers/useUseCases'
import { Card, CardHeader, CardBody, Alert } from '../../../design-system'
import { TermsAcceptanceForm } from '../forms/TermsAcceptanceForm'
import './TermsAcceptancePage.css'

interface TermsAcceptancePageProps {
  parentId: string
  onAcceptanceSuccess?: (acceptance: TermsAcceptance) => void
  onSkip?: () => void
}

export const TermsAcceptancePage = ({
  parentId,
  onAcceptanceSuccess,
  onSkip,
}: TermsAcceptancePageProps) => {
  const useCases = useUseCases()
  const [termsText, setTermsText] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [alreadyAccepted, setAlreadyAccepted] = useState(false)

  useEffect(() => {
    const loadTerms = async () => {
      try {
        setIsLoading(true)
        const terms = await useCases.terms.getTermsTextQuery()
        setTermsText(terms.text)

        // Check if already accepted
        try {
          await useCases.terms.checkTermsAcceptanceQuery(parentId)
          setAlreadyAccepted(true)
        } catch {
          // Terms not accepted yet, which is expected
          setAlreadyAccepted(false)
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load terms',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadTerms()
  }, [useCases, parentId])

  const handleAccept = async () => {
    try {
      setIsSubmitting(true)
      setError(null)
      const acceptance = await useCases.terms.acceptTermsCommand(parentId)
      onAcceptanceSuccess?.(acceptance)
    } catch (err) {
      if (err instanceof DuplicateAcceptanceError) {
        setAlreadyAccepted(true)
        onAcceptanceSuccess?.(
          {
            parentId,
            termsVersion: '1.0',
            acceptedAt: new Date(),
          },
        )
      } else {
        setError(
          err instanceof Error ? err.message : 'Failed to accept terms',
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="terms-page">
        <Card className="terms-page__card">
          <CardBody>
            <p>Chargement des conditions...</p>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="terms-page">
      <Card className="terms-page__card">
        <CardHeader className="terms-page__header">
          <h1 className="terms-page__title">Conditions d'utilisation</h1>
          <p className="terms-page__subtitle">
            Veuillez lire et accepter avant de continuer
          </p>
        </CardHeader>

        <CardBody className="terms-page__content">
          {error && <Alert type="error">{error}</Alert>}

          {alreadyAccepted && (
            <Alert type="success">
              Vous avez déjà accepté ces conditions d'utilisation.
            </Alert>
          )}

          <div
            style={{
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              fontFamily: 'inherit',
            }}
          >
            {termsText}
          </div>
        </CardBody>

        <div className="terms-page__footer">
          <div className="terms-page__notice">
            En acceptant, vous reconnaissez avoir lu et compris ces conditions
            d'utilisation.
          </div>

          <TermsAcceptanceForm
            onAccept={handleAccept}
            isLoading={isSubmitting}
            onSkip={onSkip}
            isAlreadyAccepted={alreadyAccepted}
          />
        </div>
      </Card>
    </div>
  )
}
