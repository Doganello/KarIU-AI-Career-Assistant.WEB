<script setup>
import { RouterView } from 'vue-router'
import Header from './components/layout/Header.vue'
import Sidebar from './components/layout/Sidebar.vue'
import { useAuthStore } from './stores/auth'

// Инициализация store
const authStore = useAuthStore()
</script>

<template>
  <div class="app">
    <!-- Авторизованный пользователь -->
    <template v-if="authStore.isAuthenticated">
      <Header />
      <div class="main-layout">
        <Sidebar />
        <main class="content-area">
          <RouterView />
        </main>
      </div>
    </template>

    <!-- Страницы авторизации (логин/регистрация) -->
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
  min-height: calc(100vh - 70px);
}

.content-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: #f8fafc;
}

/* Скроллбар */
.content-area::-webkit-scrollbar {
  width: 8px;
}
.content-area::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
</style>