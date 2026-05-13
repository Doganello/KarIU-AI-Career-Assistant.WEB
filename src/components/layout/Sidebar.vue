<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const menuItems = [
  { path: '/dashboard', icon: '🏠', label: 'Главная страница' },
  { path: '/profile', icon: '👤', label: 'Профиль' },
  { path: '/resume', icon: '📄', label: 'Резюме' },
  { path: '/vacancies', icon: '💼', label: 'Вакансии' },
  { path: '/ai-chat', icon: '🤖', label: 'AI Чат' },
  { path: '/interview-simulator', icon: '🎤', label: 'Симулятор собеседования' },
]

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="sidebar">
    <nav class="nav-menu">
      <a
          v-for="item in menuItems"
          :key="item.path"
          @click.prevent="router.push(item.path)"
          :class="['nav-item', { active: route.path === item.path }]"
      >
        <span class="icon">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </a>
    </nav>

    <!-- Кнопка "Выйти" внизу сайдбара -->
    <div class="sidebar-footer">
      <button @click="logout" class="logout-btn">
        🚪 Выйти
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 2rem 1rem;
  min-height: calc(100vh - 70px);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.nav-menu {
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  color: #475569;
  text-decoration: none;
  border-radius: 10px;
  margin-bottom: 6px;
  font-size: 1.05rem;
  transition: all 0.2s;
  cursor: pointer;
}

.nav-item:hover {
  background: #f1f5f9;
}

.nav-item.active {
  background: #dbeafe;
  color: #1e40af;
  font-weight: 600;
}

/* Нижняя часть с кнопкой выхода */
.sidebar-footer {
  margin-top: auto;
  padding-top: 2rem;
}

.logout-btn {
  width: 100%;
  padding: 12px 16px;
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.logout-btn:hover {
  background: #fecaca;
  color: #dc2626;
}
</style>