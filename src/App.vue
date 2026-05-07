<script setup>
import { RouterView } from 'vue-router'

// Компоненты
import Header from './components/layout/Header.vue'
import Sidebar from './components/layout/Sidebar.vue'

// Pinia store
import { useAuthStore } from './stores/auth'

// Получаем store
const authStore = useAuthStore()
</script>

<template>
  <div class="app">
    <!-- Авторизованный пользователь — полный интерфейс -->
    <template v-if="authStore.isAuthenticated">
      <Header />
      <div class="main-layout">
        <Sidebar />
        <main class="content-area">
          <RouterView />
        </main>
      </div>
    </template>

    <!-- Неавторизованный пользователь — только страницы авторизации -->
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: #f8fafc;
}

.main-layout {
  display: flex;
  min-height: calc(100vh - 70px); /* 70px — примерная высота Header */
}

.content-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: #f8fafc;
}
</style>