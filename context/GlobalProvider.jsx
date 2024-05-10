import { router } from 'expo-router'
import { createContext, useContext, useEffect, useState } from 'react'
import { loginWithJWT } from '../utils/service'
import AsyncStorage from '@react-native-async-storage/async-storage'

const GlobalContext = createContext()
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  function signIn(user) {
    setUser(user)
    router.push('/home')
  }

  async function signOut() {
    setUser(null)
    await AsyncStorage.removeItem('token')
  }

  useEffect(() => {
    AsyncStorage.getItem('token')
      .then((currentToken) => {
        if (currentToken) {
          loginWithJWT(currentToken)
            .then((user) => signIn(user.data))
            .catch(() => {
              signOut()
            })
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        signIn,
        signOut
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
