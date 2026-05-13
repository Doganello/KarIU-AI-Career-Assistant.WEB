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
  padding: 45px 40px;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.28);
}

.auth-header {
  margin-bottom: 2.8rem;
  text-align: center;
}

.logo {
  height: 82px;
  margin-bottom: 1.3rem;
}

.auth-header h1 {
  margin: 0 0 10px 0;
  color: #1e40af;
  font-size: 1.82rem;
  font-weight: 700;
}

.auth-header p {
  color: #64748b;
  margin: 0;
}

.form-group {
  margin-bottom: 1.75rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 9px;
  font-weight: 500;
  color: #374151;
}

input {
  width: 100%;
  padding: 15px 20px;           /* ← Увеличил отступ справа */
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.18);
}

.login-btn {
  width: 100%;
  padding: 16px;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.12rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}

.login-btn:hover:not(:disabled) {
  background: #1e3a8a;
}

.error-message {
  color: #ef4444;
  text-align: center;
  margin: 14px 0;
}

.auth-footer {
  text-align: center;
  margin-top: 2.4rem;
  color: #6b7280;
}

.auth-footer a {
  color: #1e40af;
  text-decoration: none;
  font-weight: 500;
}
</style>