import { useEffect, useState } from 'react'
import { useUseCases } from '../../../../app/providers/useUseCases'
import './TermsModal.css'

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const TermsModal = ({ isOpen, onClose }: TermsModalProps) => {
  const useCases = useUseCases()
  const [termsText, setTermsText] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const loadTerms = async () => {
      try {
        setIsLoading(true)
        const terms = await useCases.terms.getTermsTextQuery()
        setTermsText(terms.text)
        setError(null)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load terms',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadTerms()
  }, [isOpen, useCases])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className={`terms-modal-overlay ${isOpen ? 'terms-modal-overlay--open' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className="terms-modal">
        <div className="terms-modal__header">
          <h2 className="terms-modal__title">Conditions d'utilisation</h2>
          <button
            type="button"
            className="terms-modal__close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="terms-modal__content">
          {isLoading && <p>Chargement des conditions...</p>}
          {error && <p style={{ color: '#ef4444' }}>Erreur : {error}</p>}
          {!isLoading && !error && (
            <div
              style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                fontFamily: 'inherit',
              }}
            >
              {termsText}
            </div>
          )}
        </div>

        <div className="terms-modal__footer">
          <button
            type="button"
            className="terms-modal__button terms-modal__button--secondary"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
