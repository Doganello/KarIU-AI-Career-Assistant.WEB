<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <header class="header">
    <div class="header-left">
      <img src="@/assets/logo.jpeg" alt="KarIU" class="logo" />
      <div class="title">
        <h1>KarIU Career Assistant</h1>
        <p class="subtitle">Помогаем строить успешную карьеру</p>
      </div>
    </div>

    <div class="university-contacts">
      <span>📞 8 (7213) 91-56-26</span>
      <span>📍 г. Темиртау, пр. Республики 30</span>
    </div>

    <div v-if="authStore.user" class="user-info">
      <span class="user-name">{{ authStore.user.name || authStore.user.fullName }}</span>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: white;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  height: 54px;
  width: auto;
}

.title h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #1e40af;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
}

/* Изменено: теперь в одну строку */
.university-contacts {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 0.9rem;
  color: #475569;
  white-space: nowrap;
}

.university-contacts span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-name {
  font-weight: 600;
  color: #1e3a8a;
  font-size: 1.1rem;
  white-space: nowrap;
}

/* Адаптивность */
@media (max-width: 900px) {
  .university-contacts {
    gap: 15px;
    font-size: 0.85rem;
  }
}

@media (max-width: 768px) {
  .university-contacts {
    display: none; /* скрываем на маленьких экранах, чтобы не было тесно */
  }
}
</style>