import { useState } from 'react'
import { Button } from '../../../design-system'
import './TermsAcceptanceForm.css'

interface TermsAcceptanceFormProps {
  onAccept: () => Promise<void>
  isLoading: boolean
  onSkip?: () => void
  isAlreadyAccepted?: boolean
}

export const TermsAcceptanceForm = ({
  onAccept,
  isLoading,
  onSkip,
  isAlreadyAccepted = false,
}: TermsAcceptanceFormProps) => {
  const [isChecked, setIsChecked] = useState(isAlreadyAccepted)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isChecked || isAlreadyAccepted) {
      await onAccept()
    }
  }

  return (
    <form className="terms-acceptance-form" onSubmit={handleSubmit}>
      <div className="terms-acceptance-form__checkbox-group">
        <input
          id="terms-acceptance-checkbox"
          type="checkbox"
          className="terms-acceptance-form__checkbox"
          checked={isChecked || isAlreadyAccepted}
          onChange={(e) => setIsChecked(e.target.checked)}
          disabled={isLoading || isAlreadyAccepted}
          required
        />
        <label
          htmlFor="terms-acceptance-checkbox"
          className="terms-acceptance-form__checkbox-label"
        >
          J'accepte les conditions d'utilisation et reconnais la limitation de
          responsabilité médicale.
        </label>
      </div>

      <div className="terms-acceptance-form__actions">
        {onSkip && !isAlreadyAccepted && (
          <Button
            type="button"
            variant="secondary"
            onClick={onSkip}
            disabled={isLoading}
            className="terms-acceptance-form__button"
          >
            Plus tard
          </Button>
        )}

        <Button
          type="submit"
          disabled={(!isChecked && !isAlreadyAccepted) || isLoading}
          isLoading={isLoading}
          className="terms-acceptance-form__button"
        >
          {isAlreadyAccepted ? 'Continuer' : 'Accepter et continuer'}
        </Button>
      </div>
    </form>
  )
}
