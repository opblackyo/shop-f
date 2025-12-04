/**
 * Auth Store（預留）
 * 管理 JWT Token 和使用者狀態
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('auth_token') || null)
  const user = ref(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  function setToken(newToken) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  function setUser(userData) {
    user.value = userData
  }

  function login(newToken, userData = null) {
    setToken(newToken)
    setUser(userData)
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  // 預留：Token 刷新機制
  // async function refreshToken() {
  //   try {
  //     const response = await http.post('/auth/refresh')
  //     setToken(response.token)
  //     return response.token
  //   } catch (error) {
  //     logout()
  //     throw error
  //   }
  // }

  return {
    token,
    user,
    isLoggedIn,
    setToken,
    setUser,
    login,
    logout
  }
})

