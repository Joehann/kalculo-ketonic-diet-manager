import { useCallback, useState } from 'react'

interface UseMutationOptions<TData, TError> {
  onSuccess?: (data: TData) => void
  onError?: (error: TError) => void
}

interface UseMutationResult<TData, TError, TVariables> {
  mutate: (variables: TVariables) => Promise<void>
  data: TData | null
  error: TError | null
  isLoading: boolean
}

export const useMutation = <TData, TError extends Error, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError>,
): UseMutationResult<TData, TError, TVariables> => {
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<TError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await mutationFn(variables)
        setData(result)
        options?.onSuccess?.(result)
      } catch (err) {
        const error = err as TError
        setError(error)
        options?.onError?.(error)
      } finally {
        setIsLoading(false)
      }
    },
    [mutationFn, options],
  )

  return {
    mutate,
    data,
    error,
    isLoading,
  }
}
