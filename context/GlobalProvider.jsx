import { router } from 'expo-router'
import { createContext, useContext, useEffect, useState } from 'react'

const GlobalContext = createContext()
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  function signIn(user) {
    setUser(user)
    router.push('/home')
  }

  function signOut() {
    setUser(null)
    router.replace('/sign-in')
  }

  return (
    <GlobalContext.Provider
      value={{
        user,
        signIn,
        signOut
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
