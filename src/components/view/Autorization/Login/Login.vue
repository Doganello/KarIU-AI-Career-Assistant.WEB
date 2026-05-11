<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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
    await authStore.login(form.value.email, form.value.password)
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
  padding: 20px;
}

.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  height: 80px;
  margin-bottom: 1rem;
  border-radius: 8px;
}

.auth-header h1 {
  margin: 0 0 8px 0;
  color: #1e40af;
  font-size: 1.85rem;
  font-weight: 700;
}

.auth-header p {
  color: #64748b;
  margin: 0;
}

.form-group {
  margin-bottom: 1.3rem;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
}

input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
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
  margin-top: 0.5rem;
  transition: background 0.2s;
}

.login-btn:hover:not(:disabled) {
  background: #1e3a8a;
}

.error-message {
  color: #ef4444;
  text-align: center;
  margin: 12px 0;
  font-size: 0.95rem;
}

.auth-footer {
  text-align: center;
  margin-top: 1.8rem;
  color: #6b7280;
  font-size: 0.95rem;
}

.auth-footer a {
  color: #1e40af;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>