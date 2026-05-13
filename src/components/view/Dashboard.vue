<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="dashboard">
    <h1 class="page-title">
      Добро пожаловать, {{ authStore.user?.name || 'Студент' }}! 👋
    </h1>

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
        <p>Профиль заполнен</p>
      </div>
      <div class="stat-card">
        <h3>8</h3>
        <p>Моих откликов</p>
      </div>
    </div>

    <div class="info-section">
      <h2>🎯 Как начать карьеру</h2>
      <div class="tips-grid">
        <div class="tip-card">
          <h4>1. Заполните профиль</h4>
          <p>Добавьте навыки, опыт и образование — это повышает видимость для работодателей.</p>
        </div>
        <div class="tip-card">
          <h4>2. Создайте сильное резюме</h4>
          <p>Используйте наш конструктор резюме с ИИ-подсказками.</p>
        </div>
        <div class="tip-card">
          <h4>3. Практикуйтесь с ИИ</h4>
          <p>Тренируйте ответы на собеседованиях и улучшайте навыки общения.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: #1e3a8a;
  margin-bottom: 2.5rem;
  font-size: 2.2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  text-align: center;
}

.stat-card h3 {
  font-size: 2.8rem;
  margin: 0 0 0.5rem 0;
  color: #1e40af;
}

.info-section h2 {
  margin-bottom: 1.5rem;
  color: #1e3a8a;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.tip-card {
  background: white;
  padding: 1.8rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.07);
}
</style>