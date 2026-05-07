<script setup>
import { ref } from 'vue'
import logo from '@/assets/logo.jpeg'

const user = ref({
  name: 'Николай',
  role: 'Студент ИТ-21'
})
</script>

<template>
  <div class="app">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <img :src="logo" alt="KarIU Logo" class="logo" />
        <div class="title">
          <h1>KarIU Career Assistant</h1>
          <p class="subtitle">Помогаем строить успешную карьеру</p>
        </div>
      </div>

      <div class="user-info">
        <div class="user-text">
          <div class="user-name">{{ user.name }}</div>
          <div class="user-role">{{ user.role }}</div>
        </div>
      </div>
    </header>

    <div class="main-container">
      <aside class="sidebar">
        <nav class="nav-menu">
          <a href="#" class="nav-item active">🏠 Дашборд</a>
          <a href="#" class="nav-item">💼 Вакансии</a>
          <a href="#" class="nav-item">📋 Стажировки</a>
          <a href="#" class="nav-item">👔 Мои отклики</a>
          <a href="#" class="nav-item">📝 Моё резюме</a>
          <a href="#" class="nav-item">🎯 Карьерные события</a>
          <a href="#" class="nav-item">🤝 Менторы</a>
        </nav>
      </aside>

      <main class="content">
        <h2 class="welcome-title">Добро пожаловать, {{ user.name }}!</h2>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">47</div>
            <div class="stat-label">Актуальных вакансий</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">18</div>
            <div class="stat-label">Стажировок</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">8</div>
            <div class="stat-label">Моих откликов</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">12</div>
            <div class="stat-label">Событий</div>
          </div>
        </div>

        <div class="quick-actions">
          <h3>Быстрые действия</h3>
          <div class="actions">
            <button class="action-btn primary">📤 Обновить резюме</button>
            <button class="action-btn">🔍 Искать вакансии</button>
            <button class="action-btn">📅 Записаться на консультацию</button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Стили оставил те же (можно скопировать из предыдущего сообщения, если нужно) */
.app { min-height: 100vh; background: #f8fafc; font-family: system-ui, sans-serif; }
.header { background: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
.logo { height: 60px; width: auto; }
.title h1 { margin: 0; font-size: 1.75rem; color: #1e40af; }
.subtitle { margin: 0; color: #64748b; }

.user-info { text-align: right; }
.user-name { font-weight: 600; font-size: 1.1rem; }
.user-role { font-size: 0.95rem; color: #64748b; }

.main-container { display: flex; }
.sidebar { width: 260px; background: white; padding: 2rem 1rem; min-height: calc(100vh - 78px); border-right: 1px solid #e2e8f0; }
.nav-item {
  display: flex; align-items: center; gap: 12px; padding: 14px 18px;
  color: #475569; text-decoration: none; border-radius: 10px; margin-bottom: 6px;
}
.nav-item.active, .nav-item:hover { background: #dbeafe; color: #1e40af; }

.content { flex: 1; padding: 2rem; }
.welcome-title { font-size: 1.9rem; color: #1e3a8a; margin-bottom: 2rem; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}
.stat-card {
  background: white;
  padding: 1.6rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
}
.stat-number { font-size: 2.6rem; font-weight: 700; color: #1e40af; }

.action-btn {
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  font-size: 1.05rem;
  cursor: pointer;
  margin-right: 12px;
}
.primary { background: #1e40af; color: white; }
</style>