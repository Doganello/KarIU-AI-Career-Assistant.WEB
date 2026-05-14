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
          <h2>Основная информация <span class="required-mark">*</span></h2>

          <div class="form-row">
            <div class="form-group required">
              <label>Фамилия <span class="required-star">*</span></label>
              <input v-model="form.last_name" type="text" class="input-field" placeholder="Введите фамилию" />
            </div>

            <div class="form-group required">
              <label>Имя <span class="required-star">*</span></label>
              <input v-model="form.first_name" type="text" class="input-field" placeholder="Введите имя" />
            </div>

            <div class="form-group">
              <label>Отчество</label>
              <input v-model="form.middle_name" type="text" class="input-field" placeholder="Введите отчество (необязательно)" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Дата рождения</label>
              <input v-model="form.birth_date" type="date" class="input-field" />
            </div>

            <div class="form-group required">
              <label>Город <span class="required-star">*</span></label>
              <input v-model="form.city" type="text" class="input-field" placeholder="Например: Темиртау" />
            </div>

            <div class="form-group required">
              <label>Телефон <span class="required-star">*</span></label>
              <input v-model="form.phone" type="tel" class="input-field" placeholder="+7 (700) 123-45-67" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group required">
              <label>Специальность / Профессия <span class="required-star">*</span></label>
              <input v-model="form.specialty" type="text" class="input-field" placeholder="Например: Frontend Developer" />
            </div>

            <div class="form-group">
              <label>Год окончания</label>
              <input v-model="form.grad_year" type="number" class="input-field" placeholder="Например: 2024" />
            </div>

            <div class="form-group">
              <label>Образовательная программа</label>
              <select v-model="form.program_id" class="input-field">
                <option :value="null">Выберите программу</option>
                <option :value="1">Информационные технологии (IT-21)</option>
                <option :value="2">Экономика (EC-21)</option>
                <option :value="3">Менеджмент (MG-21)</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Опыт работы (необязательно) -->
        <section class="section">
          <h2>Опыт работы <span class="optional-mark">(необязательно)</span></h2>

          <div v-for="(exp, index) in experiences" :key="index" class="experience-item">
            <div class="experience-header">
              <h3>Опыт #{{ index + 1 }}</h3>
              <button type="button" @click="removeExperience(index)" class="remove-btn">Удалить</button>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Компания</label>
                <input v-model="exp.company" type="text" class="input-field" placeholder="Название компании" />
              </div>

              <div class="form-group">
                <label>Должность</label>
                <input v-model="exp.position" type="text" class="input-field" placeholder="Должность" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Дата начала</label>
                <input v-model="exp.start_date" type="date" class="input-field" />
              </div>

              <div class="form-group">
                <label>Дата окончания</label>
                <input v-model="exp.end_date" type="date" class="input-field" />
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="exp.is_internship" type="checkbox" />
                Это была стажировка
              </label>
            </div>

            <div class="form-group">
              <label>Описание обязанностей</label>
              <textarea v-model="exp.description" class="input-field" rows="3" placeholder="Чем вы занимались? (необязательно)"></textarea>
            </div>
          </div>

          <button type="button" @click="addExperience" class="add-btn">+ Добавить место работы</button>
        </section>

        <!-- Навыки (необязательно) -->
        <section class="section">
          <h2>Ключевые навыки <span class="optional-mark">(необязательно)</span></h2>
          <div class="skills-container">
            <div v-for="(skill, index) in skills" :key="index" class="skill-item">
              <input v-model="skill.name" type="text" class="skill-input" placeholder="Например: Python, JavaScript, Figma" />
              <select v-model="skill.level" class="skill-level">
                <option value="beginner">Начинающий</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
              </select>
              <button type="button" @click="removeSkill(index)" class="remove-skill-btn">✕</button>
            </div>
            <button type="button" @click="addSkill" class="add-skill-btn">+ Добавить навык</button>
          </div>
        </section>

        <!-- Личные качества (необязательно) -->
        <section class="section">
          <h2>Личные качества <span class="optional-mark">(необязательно)</span></h2>
          <textarea v-model="form.personal_qualities" class="input-field" rows="4"
                    placeholder="Ответственность, коммуникабельность, целеустремленность..."></textarea>
        </section>
      </div>

      <div v-else class="loading">
        <div class="spinner"></div>
        <p>Загрузка профиля...</p>
      </div>

      <footer class="resume-footer">
        <p>Карагандинский Индустриальный Университет</p>
        <p>8 (7213) 91-56-26 | ✉️ info@tttu.edu.kz | г. Темиртау, пр. Республики 30</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(true)
const saving = ref(false)

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

// Форма с пустыми значениями
const form = reactive({
  last_name: '',
  first_name: '',
  middle_name: '',
  birth_date: '',
  phone: '',
  city: '',
  specialty: '',
  program_id: null,
  grad_year: null,
  personal_qualities: ''
})

const experiences = ref([])
const skills = ref([])

const addExperience = () => {
  experiences.value.push({
    company: '',
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    is_internship: false
  })
}

const removeExperience = (index) => {
  experiences.value.splice(index, 1)
}

const addSkill = () => {
  skills.value.push({
    name: '',
    level: 'intermediate'
  })
}

const removeSkill = (index) => {
  skills.value.splice(index, 1)
}

const loadResumeData = async () => {
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

    const data = await response.json()

    // Заполняем только если данные есть
    form.last_name = data.last_name || ''
    form.first_name = data.first_name || ''
    form.middle_name = data.middle_name || ''
    form.birth_date = data.birth_date || ''
    form.phone = data.phone || ''
    form.city = data.city || ''
    form.specialty = data.specialty || ''
    form.program_id = data.program_id || null
    form.grad_year = data.grad_year || null
    form.personal_qualities = data.personal_qualities || ''

    experiences.value = data.experiences && data.experiences.length > 0
        ? data.experiences
        : []

    skills.value = data.skills && data.skills.length > 0
        ? data.skills
        : []

  } catch (err) {
    console.error('Ошибка загрузки:', err)
  } finally {
    loading.value = false
  }
}

const saveResume = async () => {
  // Проверяем обязательные поля
  if (!form.last_name || !form.first_name || !form.phone || !form.city || !form.specialty) {
    alert('❌ Пожалуйста, заполните обязательные поля: Фамилия, Имя, Телефон, Город, Специальность')
    return
  }

  saving.value = true

  try {
    const payload = {}

    // Обязательные поля
    payload.last_name = form.last_name
    payload.first_name = form.first_name
    payload.phone = form.phone
    payload.city = form.city
    payload.specialty = form.specialty

    // Необязательные поля - добавляем только если заполнены
    if (form.middle_name) payload.middle_name = form.middle_name
    if (form.birth_date) payload.birth_date = form.birth_date
    if (form.personal_qualities) payload.personal_qualities = form.personal_qualities
    if (form.program_id) payload.program_id = form.program_id
    if (form.grad_year) payload.grad_year = form.grad_year

    // Опыт работы - только заполненные
    const validExperiences = experiences.value.filter(exp => exp.company && exp.position)
    if (validExperiences.length > 0) {
      payload.experiences = validExperiences
    }

    // Навыки - только с названием
    const validSkills = skills.value.filter(skill => skill.name)
    if (validSkills.length > 0) {
      payload.skills = validSkills
    }

    const response = await fetch(`${API_BASE}/api/resume/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка сохранения')
    }

    alert('✅ Резюме успешно сохранено!')
    await loadResumeData()

  } catch (err) {
    console.error('Ошибка сохранения:', err)
    alert('❌ Ошибка: ' + err.message)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadResumeData()
})
</script>

<style scoped>
.resume-page {
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #f8fafc 100%);
  min-height: 100vh;
}

.resume-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
  overflow: hidden;
}

.header-actions {
  padding: 1.5rem 2rem;
  text-align: right;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.save-btn {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  padding: 12px 32px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(30, 64, 175, 0.3);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.resume-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 2rem;
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.resume-logo {
  height: 70px;
  width: auto;
  background: white;
  border-radius: 12px;
  padding: 5px;
}

.header-text h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.subtitle {
  margin: 8px 0 0 0;
  opacity: 0.9;
  font-size: 1rem;
}

.section {
  padding: 2rem;
  border-bottom: 1px solid #f1f5f9;
}

.section:last-child {
  border-bottom: none;
}

.section h2 {
  color: #1e3a8a;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.required-mark, .required-star {
  color: #ef4444;
  font-size: 0.9rem;
}

.optional-mark {
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: normal;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group.required label {
  font-weight: 700;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.input-field {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.experience-item {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.experience-header h3 {
  margin: 0;
  color: #1e40af;
  font-size: 1.1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input {
  width: auto;
  cursor: pointer;
}

.add-btn, .remove-btn, .add-skill-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.add-btn, .add-skill-btn {
  background: #10b981;
  color: white;
}

.add-btn:hover, .add-skill-btn:hover {
  background: #059669;
}

.remove-btn {
  background: #ef4444;
  color: white;
}

.remove-btn:hover {
  background: #dc2626;
}

.skills-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-item {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.skill-input {
  flex: 2;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.skill-level {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}

.remove-skill-btn {
  padding: 8px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
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

.resume-footer {
  background: #0f172a;
  color: #cbd5e1;
  padding: 1.5rem;
  text-align: center;
  font-size: 0.85rem;
}

.resume-footer p {
  margin: 0.25rem 0;
}

@media (max-width: 768px) {
  .resume-page {
    padding: 1rem;
  }

  .section {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .skill-item {
    flex-direction: column;
  }

  .skill-input, .skill-level {
    width: 100%;
  }
}
</style>