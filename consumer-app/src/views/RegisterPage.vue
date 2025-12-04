<script setup>
/**
 * 註冊頁（預留）
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    error.value = '密碼不一致'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // TODO: 實作註冊 API
    // await authApi.register(name.value, email.value, password.value)
    // router.push('/login')
    
    error.value = '註冊功能尚未實作'
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-card">
      <h1>註冊</h1>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>姓名</label>
          <input 
            type="text" 
            v-model="name" 
            placeholder="請輸入姓名"
            required
          />
        </div>
        
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
        
        <div class="form-group">
          <label>確認密碼</label>
          <input 
            type="password" 
            v-model="confirmPassword" 
            placeholder="請再次輸入密碼"
            required
          />
        </div>
        
        <p v-if="error" class="error">{{ error }}</p>
        
        <button type="submit" :disabled="loading">
          {{ loading ? '註冊中...' : '註冊' }}
        </button>
      </form>
      
      <p class="login-link">
        已有帳號？ <router-link to="/login">登入</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.register-card {
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

.login-link {
  margin-top: 20px;
  text-align: center;
  color: #666;
}

.login-link a {
  color: #3498db;
}
</style>

