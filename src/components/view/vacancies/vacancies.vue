<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="page">
    <h1 class="page-title">Вакансии</h1>

    <div class="vacancies-grid">
      <div class="vacancy-card">
        <h3>Frontend Developer (Vue.js)</h3>
        <p class="company">ТОО "TechVision" • Алматы</p>
        <p class="salary">450 000 — 600 000 ₸</p>
        <button class="apply-btn">Откликнуться</button>
      </div>

      <div class="vacancy-card">
        <h3>Junior Full Stack Developer</h3>
        <p class="company">АО "KarIU Digital" • Караганда</p>
        <p class="salary">350 000 — 480 000 ₸</p>
        <button class="apply-btn">Откликнуться</button>
      </div>

      <div class="vacancy-card">
        <h3>React Developer</h3>
        <p class="company">Kaspi.kz • Алматы</p>
        <p class="salary">500 000 — 700 000 ₸</p>
        <button class="apply-btn">Откликнуться</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { padding: 1.5rem; }

.vacancies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
}

.vacancy-card {
  background: white;
  padding: 1.8rem;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  transition: all 0.3s;
}

.vacancy-card:hover {
  transform: translateY(-5px);
}

.company { color: #64748b; margin: 8px 0; }
.salary {
  font-weight: 700;
  color: #16a34a;
  font-size: 1.1rem;
  margin: 12px 0;
}

.apply-btn {
  margin-top: 1rem;
  width: 100%;
  padding: 12px;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>