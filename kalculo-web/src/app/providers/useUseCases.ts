import { useContext } from 'react'
import { UseCasesContext } from './UseCasesContext'

export const useUseCases = () => {
  const useCases = useContext(UseCasesContext)

  if (!useCases) {
    throw new Error('useUseCases must be used within UseCasesProvider')
  }

  return useCases
}
