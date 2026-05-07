<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const login = async () => {
  loading.value = true
  error.value = ''

  try {
    if (!form.value.email || !form.value.password) {
      throw new Error('Заполните все поля')
    }

    // Симуляция входа (позже заменишь на реальный API)
    const mockToken = 'jwt-token-' + Date.now()
    const mockUser = {
      id: 1,
      name: 'Николай',
      email: form.value.email
    }

    authStore.login(mockToken, mockUser)
    router.push('/dashboard')

  } catch (err) {
    error.value = err.message || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <img src="@/assets/logo.jpeg" alt="KarIU" class="logo" />
        <h1>KarIU Career Assistant</h1>
        <p>Войдите в аккаунт</p>
      </div>

      <form @submit.prevent="login">
        <div class="form-group">
          <label>Email</label>
          <input
              v-model="form.email"
              type="email"
              placeholder="your@email.com"
              required
          />
        </div>

        <div class="form-group">
          <label>Пароль</label>
          <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              required
          />
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>

      <div class="auth-footer">
        Нет аккаунта?
        <router-link to="/register">Зарегистрироваться</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
}

.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  height: 70px;
  margin-bottom: 1rem;
}

.auth-header h1 {
  margin: 0;
  color: #1e40af;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

.login-btn:hover:not(:disabled) {
  background: #1e3a8a;
}

.error-message {
  color: #ef4444;
  text-align: center;
  margin: 10px 0;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #6b7280;
}

.auth-footer a {
  color: #1e40af;
  text-decoration: none;
}
</style>