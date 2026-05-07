<script setup>
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<template>
  <div class="dashboard">
    <h1 class="page-title">Добро пожаловать, {{ authStore.user?.name || 'Студент' }}!</h1>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>47</h3>
        <p>Актуальных вакансий</p>
      </div>
      <div class="stat-card">
        <h3>12</h3>
        <p>Стажировок</p>
      </div>
      <div class="stat-card">
        <h3>85%</h3>
        <p>Заполненность профиля</p>
      </div>
      <div class="stat-card">
        <h3>8</h3>
        <p>Моих откликов</p>
      </div>
    </div>

    <div class="section">
      <h2>Рекомендуемые вакансии</h2>
      <div class="quick-vacancies">
        <div class="vacancy-card">
          <h4>Frontend Developer (React)</h4>
          <p>ТОО "TechVision" • Алматы • 450 000 ₸</p>
          <button class="btn-primary">Откликнуться</button>
        </div>
        <div class="vacancy-card">
          <h4>Junior Data Analyst</h4>
          <p>Kaspi.kz • Караганда • 380 000 ₸</p>
          <button class="btn-primary">Откликнуться</button>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Быстрые действия</h2>
      <div class="actions-grid">
        <router-link to="/profile" class="action-card">
          👤 Заполнить профиль
        </router-link>
        <router-link to="/resume" class="action-card">
          📄 Создать резюме
        </router-link>
        <router-link to="/ai-chat" class="action-card">
          🤖 Спросить ИИ
        </router-link>
        <router-link to="/interview-simulator" class="action-card">
          🎤 Практика собеседования
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard h1 { color: #1e3a8a; margin-bottom: 2rem; }
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}
.stat-card {
  background: white;
  padding: 1.8rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.07);
  text-align: center;
}
.stat-card h3 {
  font-size: 2.8rem;
  margin: 0;
  color: #1e40af;
}

.quick-vacancies, .actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
.vacancy-card, .action-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.07);
}
.btn-primary {
  margin-top: 10px;
  padding: 10px 20px;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 8px;
}
</style>