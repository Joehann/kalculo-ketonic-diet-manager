import { useMemo, type ReactNode } from 'react'
import { buildDiContainer } from '../di/buildDiContainer'
import { UseCasesContext } from './UseCasesContext'

type UseCasesProviderProps = {
  children: ReactNode
}

export const UseCasesProvider = ({ children }: UseCasesProviderProps) => {
  const container = useMemo(() => buildDiContainer(), [])

  return (
    <UseCasesContext.Provider value={container.useCases}>
      {children}
    </UseCasesContext.Provider>
  )
}
