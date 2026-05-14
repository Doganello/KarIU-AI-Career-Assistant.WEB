<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(true)
const saving = ref(false)

const resumeData = ref({
  last_name: '',
  first_name: '',
  middle_name: '',
  birth_date: '',
  phone: '',
  city: 'Темиртау',
  program_id: null,
  grad_year: null,
  personal_qualities: '',
  experiences: [],
  certificates: [],
  skills: []
})

// Временные поля для удобства редактирования
const tempExperience = ref([
  { company: '', position: '', description: '', start_date: '', end_date: '', is_internship: false },
  { company: '', position: '', description: '', start_date: '', end_date: '', is_internship: false }
])

const loadResumeData = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/resume/profile', {
      credentials: 'include'  // ← Отправляем куки
    })

    if (!response.ok) {
      if (response.status === 401) {
        // Если не авторизованы, перенаправляем на логин
        authStore.logout()
        window.location.href = '/login'
        return
      }
      throw new Error('Ошибка загрузки')
    }

    const data = await response.json()
    resumeData.value = { ...resumeData.value, ...data }

    // Загружаем опыт работы в удобную форму
    if (data.experiences && data.experiences.length) {
      data.experiences.forEach((exp, index) => {
        if (index < 2) {
          tempExperience.value[index] = exp
        }
      })
    }
  } catch (err) {
    console.error('Ошибка загрузки профиля:', err)
  } finally {
    loading.value = false
  }
}

const saveResume = async () => {
  saving.value = true
  try {
    // Подготавливаем данные для отправки
    const payload = {
      ...resumeData.value,
      experiences: tempExperience.value.filter(exp => exp.company && exp.position)
    }

    const response = await fetch('http://localhost:8000/api/resume/profile', {
      method: 'PUT',  // ← Используем PUT для обновления
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',  // ← Отправляем куки
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      if (response.status === 401) {
        authStore.logout()
        window.location.href = '/login'
        return
      }
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка сохранения')
    }

    alert('✅ Резюме успешно сохранено!')
  } catch (err) {
    console.error('Ошибка:', err)
    alert('❌ Ошибка сохранения: ' + err.message)
  } finally {
    saving.value = false
  }
}

// Добавляем опыт работы
const addExperience = () => {
  tempExperience.value.push({
    company: '',
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    is_internship: false
  })
}

// Удаляем опыт работы
const removeExperience = (index) => {
  tempExperience.value.splice(index, 1)
}

onMounted(() => {
  // Проверяем авторизацию перед загрузкой
  if (authStore.isAuthenticated) {
    loadResumeData()
  } else {
    authStore.checkAuth().then(isAuth => {
      if (isAuth) {
        loadResumeData()
      } else {
        window.location.href = '/login'
      }
    })
  }
})
</script>

<template>
  <div class="resume-page">
    <div class="resume-container">
      <div class="header-actions">
        <button @click="saveResume" :disabled="saving" class="save-btn">
          {{ saving ? 'Сохранение...' : '💾 Сохранить резюме' }}
        </button>
      </div>

      <header class="resume-header">
        <div class="header-content">
          <img src="@/assets/logo.jpeg" alt="KarIU" class="resume-logo" />
          <div class="header-text">
            <h1>KarIU Career Assistant</h1>
            <p class="subtitle">Помогаем строить успешную карьеру</p>
          </div>
        </div>
      </header>

      <div class="resume-body" v-if="!loading">
        <!-- Основная информация -->
        <section class="section">
          <h2>Основная информация</h2>

          <div class="form-group">
            <label>Фамилия</label>
            <input v-model="resumeData.last_name" class="input-field" placeholder="Иванов" />
          </div>

          <div class="form-group">
            <label>Имя</label>
            <input v-model="resumeData.first_name" class="input-field" placeholder="Иван" />
          </div>

          <div class="form-group">
            <label>Отчество</label>
            <input v-model="resumeData.middle_name" class="input-field" placeholder="Иванович" />
          </div>

          <div class="form-group">
            <label>Дата рождения</label>
            <input v-model="resumeData.birth_date" type="date" class="input-field" />
          </div>

          <div class="form-group">
            <label>Город</label>
            <input v-model="resumeData.city" class="input-field" placeholder="Темиртау" />
          </div>

          <div class="form-group">
            <label>Телефон</label>
            <input v-model="resumeData.phone" class="input-field" placeholder="+7 (700) 123-45-67" />
          </div>

          <div class="form-group">
            <label>Год окончания</label>
            <input v-model="resumeData.grad_year" type="number" class="input-field" placeholder="2024" />
          </div>
        </section>

        <!-- Опыт работы -->
        <section class="section">
          <h2>Опыт работы</h2>

          <div v-for="(exp, index) in tempExperience" :key="index" class="sub-section">
            <h3>Место работы {{ index + 1 }}</h3>
            <button v-if="index > 1" @click="removeExperience(index)" class="remove-btn">Удалить</button>

            <div class="form-group">
              <label>Компания</label>
              <input v-model="exp.company" class="input-field" placeholder="Название компании" />
            </div>

            <div class="form-group">
              <label>Должность</label>
              <input v-model="exp.position" class="input-field" placeholder="Должность" />
            </div>

            <div class="form-group">
              <label>Дата начала</label>
              <input v-model="exp.start_date" type="date" class="input-field" />
            </div>

            <div class="form-group">
              <label>Дата окончания</label>
              <input v-model="exp.end_date" type="date" class="input-field" />
            </div>

            <div class="form-group">
              <label>
                <input v-model="exp.is_internship" type="checkbox" />
                Стажировка
              </label>
            </div>

            <div class="form-group">
              <label>Описание обязанностей</label>
              <textarea v-model="exp.description" class="input-field" rows="4" placeholder="Что вы делали..."></textarea>
            </div>
          </div>

          <button @click="addExperience" class="add-btn">+ Добавить место работы</button>
        </section>

        <!-- Личные качества -->
        <section class="section">
          <h2>Личные качества</h2>
          <textarea v-model="resumeData.personal_qualities" class="input-field" rows="4" placeholder="Ответственный, Коммуникабельный, Целеустремлённый..."></textarea>
        </section>
      </div>

      <div v-else class="loading">
        Загрузка...
      </div>

      <footer class="resume-footer">
        Карагандинский Индустриальный Университет<br>
        8 (7213) 91-56-26 &nbsp; | &nbsp; ✉️ info@tttu.edu.kz &nbsp; | &nbsp; г. Темиртау, пр. Республики 30
      </footer>
    </div>
  </div>
</template>

<style scoped>
.resume-page {
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
}

.resume-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 35px rgba(0,0,0,0.08);
  overflow: hidden;
}

.header-actions {
  padding: 1rem 3rem;
  text-align: right;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.save-btn {
  background: #1e40af;
  color: white;
  padding: 12px 32px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn:hover:not(:disabled) {
  background: #1e3a8a;
  transform: translateY(-2px);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.resume-header {
  background: white;
  padding: 2rem 3rem;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.resume-logo {
  height: 75px;
  width: auto;
}

.header-text h1 {
  margin: 0;
  font-size: 1.85rem;
  color: #1e3a8a;
}

.subtitle {
  margin: 4px 0 0 0;
  color: #64748b;
  font-size: 1.05rem;
}

.section {
  padding: 2rem 3rem;
  border-bottom: 1px solid #f1f5f9;
}

.section:last-child {
  border-bottom: none;
}

.section h2 {
  color: #1e3a8a;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.sub-section {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  position: relative;
}

.sub-section h3 {
  margin: 0 0 1rem 0;
  color: #1e40af;
  font-size: 1.2rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #374151;
}

.input-field {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.add-btn, .remove-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.add-btn {
  background: #10b981;
  color: white;
  margin-top: 1rem;
}

.add-btn:hover {
  background: #059669;
}

.remove-btn {
  background: #ef4444;
  color: white;
  margin-bottom: 1rem;
}

.remove-btn:hover {
  background: #dc2626;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-size: 1.1rem;
}

.resume-footer {
  background: #0f172a;
  color: #cbd5e1;
  padding: 2rem 3rem;
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.6;
}
</style>