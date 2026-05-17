<template>
  <div class="vacancies-page">
    <div class="vacancies-header">
      <h1 class="page-title">💼 Вакансии</h1>
      <button @click="parseVacancies" :disabled="parsing" class="refresh-btn">
        {{ parsing ? 'Обновление...' : '🔄 Обновить вакансии' }}
      </button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка вакансий...</p>
    </div>

    <div v-else class="vacancies-grid">
      <a
          v-for="vacancy in vacancies"
          :key="vacancy.id"
          :href="vacancy.source_url"
          class="vacancy-card"
          target="_blank"
          rel="noopener noreferrer"
      >
        <div class="vacancy-icon">
          <i class="fas fa-building"></i>
        </div>
        <div class="vacancy-company">{{ vacancy.company }}</div>
      </a>

      <div v-if="vacancies.length === 0 && !loading" class="empty-state">
        <p>😕 Нет доступных вакансий</p>
        <button @click="parseVacancies" class="retry-btn">Обновить вакансии</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const vacancies = ref([])
const loading = ref(true)
const parsing = ref(false)

const loadVacancies = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/api/jobs/?source=kariu_partner`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })

    if (response.ok) {
      vacancies.value = await response.json()
      console.log('Загружены вакансии:', vacancies.value.length)
    } else {
      console.error('Ошибка загрузки:', response.status)
    }
  } catch (err) {
    console.error('Ошибка загрузки вакансий:', err)
  } finally {
    loading.value = false
  }
}

const parseVacancies = async () => {
  parsing.value = true
  try {
    const response = await fetch(`${API_BASE}/api/jobs/parse/kariu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })

    if (response.ok) {
      const data = await response.json()
      alert(data.message)
      await loadVacancies()
    } else {
      alert('Ошибка при обновлении вакансий')
    }
  } catch (err) {
    console.error('Ошибка парсинга:', err)
    alert('Ошибка при обновлении вакансий')
  } finally {
    parsing.value = false
  }
}

onMounted(() => {
  loadVacancies()
})
</script>

<style scoped>
.vacancies-page {
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8fafc 100%);
  min-height: calc(100vh - 70px);
}

.vacancies-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  color: #1e3a8a;
  font-size: 1.8rem;
  margin: 0;
}

.refresh-btn {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(30, 64, 175, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.vacancies-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.vacancy-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
}

.vacancy-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.vacancy-icon {
  font-size: 2.5rem;
  color: #1e40af;
  margin-bottom: 1rem;
}

.vacancy-company {
  font-size: 1rem;
  font-weight: 600;
  color: #1e3a8a;
  line-height: 1.4;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 0.6s linear infinite;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.retry-btn {
  margin-top: 1rem;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .vacancies-page {
    padding: 1rem;
  }

  .vacancies-header {
    flex-direction: column;
    text-align: center;
  }

  .vacancies-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .vacancy-card {
    padding: 1rem;
  }

  .vacancy-icon {
    font-size: 2rem;
  }

  .vacancy-company {
    font-size: 0.9rem;
  }
}
</style>