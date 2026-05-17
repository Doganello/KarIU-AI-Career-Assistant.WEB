<template>
  <div class="profile-page">
    <h1 class="page-title">Мой профиль</h1>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка профиля...</p>
    </div>

    <div v-else class="profile-content">
      <div class="card">
        <h2>Основная информация</h2>
        <p><strong>ФИО:</strong> {{ fullName }}</p>
        <p><strong>Специальность:</strong> {{ profile.specialty || 'Не указана' }}</p>
        <p><strong>Дата рождения:</strong> {{ profile.birth_date || 'Не указана' }}</p>
        <p><strong>Город:</strong> {{ profile.city || 'Не указан' }}</p>
        <p><strong>Телефон:</strong> {{ profile.phone || 'Не указан' }}</p>
        <p><strong>Полнота профиля:</strong> {{ profile.profile_completeness || 0 }}%</p>
      </div>

      <div class="card">
        <h2>Образование</h2>
        <p><strong>Университет:</strong> {{ profile.university || 'Карагандинский Индустриальный Университет' }}</p>
        <p><strong>Образовательная программа:</strong> {{ programName || 'Не выбрана' }}</p>
        <p><strong>Год окончания:</strong> {{ profile.grad_year || 'Не указан' }}</p>
      </div>

      <div class="card">
        <h2>Опыт работы</h2>
        <div v-if="profile.experiences && profile.experiences.length > 0">
          <div v-for="(exp, idx) in profile.experiences" :key="idx" class="experience-item">
            <strong>{{ exp.company }}</strong> — {{ exp.position }}
            <br>
            <small v-if="exp.start_date || exp.end_date">
              {{ exp.start_date || '?' }} — {{ exp.end_date || 'настоящее время' }}
              <span v-if="exp.is_internship" class="internship-badge">Стажировка</span>
            </small>
            <p v-if="exp.description">{{ exp.description }}</p>
          </div>
        </div>
        <p v-else class="empty">Опыт работы не добавлен</p>
      </div>

      <div class="card">
        <h2>Навыки</h2>
        <p v-if="skillsText" class="skills-text">{{ skillsText }}</p>
        <p v-else class="empty">Навыки не указаны</p>
      </div>

      <div class="card">
        <h2>Личные качества</h2>
        <p v-if="profile.personal_qualities" class="personal-qualities-text">{{ profile.personal_qualities }}</p>
        <p v-else class="empty">Личные качества не указаны</p>
      </div>
    </div>

    <div class="actions">
      <button @click="$router.push('/resume')" class="edit-btn">
        ✏️ Редактировать резюме
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(true)
const profile = ref({})
const programs = ref([])

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const fullName = computed(() => {
  const parts = [profile.value.last_name, profile.value.first_name, profile.value.middle_name]
  return parts.filter(p => p && p !== 'null').join(' ') || 'Не указано'
})

const programName = computed(() => {
  if (!profile.value.program_id) return null
  const program = programs.value.find(p => p.id === profile.value.program_id)
  return program ? `${program.code} - ${program.name}` : null
})

const skillsText = computed(() => {
  if (profile.value.skills && profile.value.skills.length > 0) {
    return profile.value.skills.map(s => s.name).join(', ')
  }
  return null
})

const loadPrograms = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/resume/educational-programs`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })

    if (response.ok) {
      programs.value = await response.json()
    }
  } catch (err) {
    console.error('Ошибка загрузки программ:', err)
  }
}

const loadProfile = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/api/resume/profile`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })

    if (!response.ok) {
      if (response.status === 401) {
        await authStore.logout()
        router.push('/login')
        return
      }
      throw new Error(`HTTP ${response.status}`)
    }

    profile.value = await response.json()

  } catch (err) {
    console.error('Ошибка загрузки профиля:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
  loadPrograms()
})
</script>

<style scoped>
.profile-page {
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #f5f7fa 0%, #f8fafc 100%);
}

.page-title {
  color: #1e3a8a;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.card h2 {
  color: #1e3a8a;
  margin-bottom: 1.2rem;
  border-bottom: 2px solid #e0f2fe;
  padding-bottom: 10px;
  font-size: 1.3rem;
}

.card p {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.experience-item {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.experience-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.internship-badge {
  display: inline-block;
  background: #fef3c7;
  color: #d97706;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  margin-left: 8px;
}

.skills-text,
.personal-qualities-text {
  background: #f8fafc;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  color: #1e293b;
  line-height: 1.6;
  margin-top: 0.5rem;
}

.empty {
  color: #94a3b8;
  font-style: italic;
}

.actions {
  margin-top: 2rem;
  text-align: center;
}

.edit-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(30, 64, 175, 0.3);
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem;
  }

  .card {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>