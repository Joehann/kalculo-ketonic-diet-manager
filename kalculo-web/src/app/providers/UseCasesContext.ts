import { createContext } from 'react'
import type { AppUseCases } from '../di/buildDiContainer'

export const UseCasesContext = createContext<AppUseCases | null>(null)
