import { useEffect } from 'react'

export const useHandleError = (isError, error, handleError) => {
  useEffect(() => {
    isError && handleError(error.message || 'Something went wrong!')
  }, [isError, error])
}
