import { createContext, useContext, useEffect, useState } from 'react'

const GlobalContext = createContext()
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState({
    username: 'Julia',
    email: 'julia@test.com'
  })
  const [isLoading, setIsLoading] = useState(true)

  function auth() {
    return
  }

  // useEffect(() => {
  //   auth()
  // }, [])

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isLoading,
        user,
        setUser
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
