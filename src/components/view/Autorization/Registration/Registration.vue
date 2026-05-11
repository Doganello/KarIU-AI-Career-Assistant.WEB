<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

const register = async () => {
  loading.value = true
  error.value = ''

  try {
    // Валидация на фронте
    if (!form.value.fullName || !form.value.email || !form.value.password) {
      throw new Error('Заполните все обязательные поля')
    }

    if (form.value.password !== form.value.confirmPassword) {
      throw new Error('Пароли не совпадают')
    }

    if (form.value.password.length < 6) {
      throw new Error('Пароль должен быть не менее 6 символов')
    }

    // Отправка на бэкенд
    await authStore.register({
      email: form.value.email,
      password: form.value.password,
      // full_name: form.value.fullName, // раскомментируй, если добавишь в схему
    })

    router.push('/dashboard')

  } catch (err) {
    error.value = err.message || 'Ошибка регистрации'
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
        <p>Создайте аккаунт</p>
      </div>

      <form @submit.prevent="register">
        <div class="form-group">
          <label>ФИО <span class="required">*</span></label>
          <input
              v-model="form.fullName"
              type="text"
              placeholder="Иванов Иван Иванович"
              required
          />
        </div>

        <div class="form-group">
          <label>Email <span class="required">*</span></label>
          <input
              v-model="form.email"
              type="email"
              placeholder="your@email.com"
              required
          />
        </div>

        <div class="form-group">
          <label>Пароль <span class="required">*</span></label>
          <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              required
          />
        </div>

        <div class="form-group">
          <label>Подтвердите пароль <span class="required">*</span></label>
          <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="••••••••"
              required
          />
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <button type="submit" class="register-btn" :disabled="loading">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <div class="auth-footer">
        Уже есть аккаунт?
        <router-link to="/login">Войти</router-link>
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

.required {
  color: #ef4444;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.register-btn {
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