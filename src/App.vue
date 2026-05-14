<script setup>
import { RouterView, useRouter } from 'vue-router'
import Header from './components/layout/Header.vue'
import Sidebar from './components/layout/Sidebar.vue'
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  // Проверяем аутентификацию при загрузке приложения
  await authStore.checkAuth()
})
</script>

<template>
  <div class="app">
    <template v-if="authStore.isAuthenticated">
      <Header />
      <div class="main-layout">
        <Sidebar />
        <main class="content-area">
          <RouterView />
        </main>
      </div>
    </template>

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

.content-area::-webkit-scrollbar {
  width: 8px;
}

.content-area::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.content-area::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>