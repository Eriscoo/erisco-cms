import { useState, useCallback } from 'react'
import * as authApi from '../api'
import { setToken, removeToken, isLoggedIn } from '../token'

export function useAuth() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn())
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email: string, password: string, remember: boolean) => {
    setLoading(true)
    try {
      const data = await authApi.login(email, password)
      setToken(data.token, remember)
      setLoggedIn(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    removeToken()
    setLoggedIn(false)
  }, [])

  return { loggedIn, loading, login, logout }
}
