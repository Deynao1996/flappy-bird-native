import { useState } from 'react'
import Snackbar from '../components/Snackbar'

const defaultSnackBarState = {
  isVisible: false,
  message: '',
  snackBarType: 'Failure',
  duration: 4000
}

export const withSnackBar = (BaseComponent) => {
  return (props) => {
    const [snackbarState, setSnackbarState] = useState(defaultSnackBarState)

    const setVisibleSnackBar = (
      message,
      snackBarType = 'Failure',
      duration = 4000
    ) => {
      setSnackbarState({ isVisible: true, message, snackBarType, duration })
    }

    const resetSnackBar = () => {
      setSnackbarState(defaultSnackBarState)
    }

    return (
      <>
        <BaseComponent {...props} setVisibleSnackBar={setVisibleSnackBar} />
        <Snackbar {...snackbarState} resetSnackBar={resetSnackBar} />
      </>
    )
  }
}
