<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="header">
    <div class="header-left">
      <img src="@/assets/logo.jpeg" alt="KarIU" class="logo" />
      <h1>KarIU AI Career Assistant</h1>
    </div>

    <div class="header-right">
      <div class="user-info">
        <span>{{ authStore.user?.name || 'Пользователь' }}</span>
      </div>
      <button @click="logout" class="logout-btn">Выйти</button>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: 70px;
}

.logo {
  height: 50px;
  margin-right: 15px;
}

h1 {
  font-size: 1.4rem;
  color: #1e40af;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logout-btn {
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>