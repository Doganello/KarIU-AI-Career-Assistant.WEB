<template>
  <header class="header">
    <div class="header-left">
      <img
          src="//dot.tttu.edu.kz/pluginfile.php/1/theme_space/customlogo/1766124818/logo-header.png"
          class="logo"
          alt="Қарағанды индустриялық университеті"
      />
      <div class="title">
        <h1>KarIU Career Assistant</h1>
        <p class="subtitle">Помогаем строить успешную карьеру</p>
      </div>
    </div>

    <div class="university-contacts">
      <span>📞 8 (7213) 91-56-26</span>
      <span>✉️ info@tttu.edu.kz</span>
      <span>📍 г. Темиртау, пр. Республики 30</span>
    </div>

    <div v-if="authStore.user" class="user-info">
      <span class="user-name">{{ authStore.user?.email || 'Пользователь' }}</span>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.header {
  background: #0a1e5c;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  height: 80px;
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
  color: white;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: #cbd5e6;
}

.university-contacts {
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 0.85rem;
  color: white;
  white-space: nowrap;
}

.university-contacts span {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e2e8f0;
}

.user-info {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.12);
  padding: 8px 18px;
  border-radius: 40px;
}

.user-name {
  font-weight: 500;
  color: white;
  font-size: 0.9rem;
  white-space: nowrap;
}

@media (max-width: 1024px) {
  .university-contacts {
    gap: 15px;
    font-size: 0.75rem;
  }

  .title h1 {
    font-size: 1.2rem;
  }
}

@media (max-width: 900px) {
  .university-contacts span:last-child {
    display: none;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0 1rem;
    height: 70px;
  }

  .university-contacts {
    display: none;
  }

  .title h1 {
    font-size: 1rem;
  }

  .subtitle {
    display: none;
  }

  .logo {
    height: 45px;
  }
}
</style>