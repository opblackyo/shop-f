<script setup>
/**
 * 登入頁（預留）
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    // TODO: 實作登入 API
    // const response = await authApi.login(email.value, password.value)
    // authStore.login(response.token, response.user)
    // router.push('/')
    
    error.value = '登入功能尚未實作'
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1>登入</h1>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>電子郵件</label>
          <input 
            type="email" 
            v-model="email" 
            placeholder="請輸入電子郵件"
            required
          />
        </div>
        
        <div class="form-group">
          <label>密碼</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="請輸入密碼"
            required
          />
        </div>
        
        <p v-if="error" class="error">{{ error }}</p>
        
        <button type="submit" :disabled="loading">
          {{ loading ? '登入中...' : '登入' }}
        </button>
      </form>
      
      <p class="register-link">
        還沒有帳號？ <router-link to="/register">註冊</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0 0 24px 0;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #3498db;
}

.error {
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 16px;
}

button {
  width: 100%;
  padding: 14px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #2980b9;
}

button:disabled {
  background: #ccc;
}

.register-link {
  margin-top: 20px;
  text-align: center;
  color: #666;
}

.register-link a {
  color: #3498db;
}
</style>

