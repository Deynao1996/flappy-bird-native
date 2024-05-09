import { useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo'

export const useHandleError = (isError, error, handleError) => {
  useEffect(() => {
    isError && handleError(error.message || 'Something went wrong!')
  }, [isError, error])

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (!state.isConnected)
        handleError('No internet connection.\nPlease connect to the internet.')
    })
  }, [])
}
