import { useEffect } from 'react'
import { Alert } from 'react-native'

export const useHandleError = (isError, error) => {
  useEffect(() => {
    isError && Alert.alert('Error', error.message || 'Something went wrong!')
  }, [isError, error])
}
