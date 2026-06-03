<template>
  <div class="resume-page">
    <div class="resume-container">
      <div class="header-actions">
        <button @click="generateCV" :disabled="generating" class="generate-btn">
          {{ generating ? 'Генерация...' : '📄 Скачать резюме (DOCX)' }}
        </button>
        <button @click="saveResume" :disabled="saving" class="save-btn">
          {{ saving ? 'Сохранение...' : '💾 Сохранить резюме' }}
        </button>
      </div>

      <header class="resume-header">
        <div class="header-content">
          <img
              src="//dot.tttu.edu.kz/pluginfile.php/1/theme_space/customlogo/1766124818/logo-header.png"
              class="resume-logo"
              alt="Қарағанды индустриялық университеті"
          />
          <div class="header-text">
            <h1>KarIU Career Assistant</h1>
            <p class="subtitle">Помогаем строить успешную карьеру</p>
          </div>
        </div>
      </header>

      <div class="resume-body" v-if="!loading">
        <section class="section">
          <h2>Основная информация <span class="required-mark">*</span></h2>

          <div class="form-row">
            <div class="form-group required" :class="{ 'error': errors.last_name }">
              <label>Фамилия <span class="required-star">*</span></label>
              <input v-model="form.last_name" type="text" class="input-field" @blur="validateField('last_name')" />
              <div class="error-message" v-if="errors.last_name">{{ errors.last_name }}</div>
            </div>

            <div class="form-group required" :class="{ 'error': errors.first_name }">
              <label>Имя <span class="required-star">*</span></label>
              <input v-model="form.first_name" type="text" class="input-field" @blur="validateField('first_name')" />
              <div class="error-message" v-if="errors.first_name">{{ errors.first_name }}</div>
            </div>

            <div class="form-group">
              <label>Отчество</label>
              <input v-model="form.middle_name" type="text" class="input-field"/>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group required" :class="{ 'error': errors.birth_date }">
              <label>Дата рождения <span class="required-star">*</span></label>
              <input v-model="form.birth_date" type="date" class="input-field" :max="maxDate" @blur="validateField('birth_date')" />
              <div class="error-message" v-if="errors.birth_date">{{ errors.birth_date }}</div>
            </div>

            <div class="form-group required" :class="{ 'error': errors.city }">
              <label>Город <span class="required-star">*</span></label>
              <input v-model="form.city" type="text" class="input-field" @blur="validateField('city')" />
              <div class="error-message" v-if="errors.city">{{ errors.city }}</div>
            </div>

            <div class="form-group required" :class="{ 'error': errors.phone }">
              <label>Телефон <span class="required-star">*</span></label>
              <input v-model="form.phone" type="tel" class="input-field" @blur="validateField('phone')" />
              <div class="error-message" v-if="errors.phone">{{ errors.phone }}</div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group required" :class="{ 'error': errors.specialty }">
              <label>Специальность <span class="required-star">*</span></label>
              <input v-model="form.specialty" type="text" class="input-field" @blur="validateField('specialty')" />
              <div class="error-message" v-if="errors.specialty">{{ errors.specialty }}</div>
            </div>

            <div class="form-group">
              <label>Год окончания</label>
              <input v-model="form.grad_year" type="number" class="input-field" min="1950" :max="currentYear" @blur="validateField('grad_year')" />
              <div class="error-message" v-if="errors.grad_year">{{ errors.grad_year }}</div>
            </div>

            <div class="form-group">
              <label>Образовательная программа</label>
              <select v-model="form.program_id" class="input-field program-select">
                <option :value="null">📚 Выберите программу</option>
                <option v-for="program in programs" :key="program.id" :value="program.id">
                  {{ program.code }} - {{ program.name }}
                </option>
              </select>
            </div>
          </div>
        </section>

        <section class="section">
          <h2>Опыт работы</h2>

          <div v-for="(exp, index) in experiences" :key="index" class="experience-item">
            <div class="experience-header">
              <h3>Опыт #{{ index + 1 }}</h3>
              <button type="button" @click="removeExperience(index)" class="remove-btn">Удалить</button>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Компания</label>
                <input v-model="exp.company" type="text" class="input-field"/>
              </div>

              <div class="form-group">
                <label>Должность</label>
                <input v-model="exp.position" type="text" class="input-field"/>
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
                <small class="hint">Если работаете до сих пор - оставьте пустым</small>
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="exp.is_internship" type="checkbox" />
                Стажировка
              </label>
            </div>

            <div class="form-group">
              <label>Описание</label>
              <textarea v-model="exp.description" class="textarea-description" placeholder="Опишите ваши обязанности, проекты и достижения..."></textarea>
            </div>
          </div>

          <button type="button" @click="addExperience" class="add-btn">+ Добавить место работы</button>
        </section>

        <section class="section">
          <h2>Сертификаты и достижения</h2>

          <div v-for="(cert, index) in certificates" :key="index" class="certificate-item">
            <div class="certificate-header">
              <h3>Сертификат #{{ index + 1 }}</h3>
              <button type="button" @click="removeCertificate(index)" class="remove-btn">Удалить</button>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Название сертификата</label>
                <input v-model="cert.title" type="text" class="input-field" placeholder="Например: Сертификат о прохождении курса Python" />
              </div>

              <div class="form-group">
                <label>Организация / Курс</label>
                <input v-model="cert.issuer" type="text" class="input-field" placeholder="Например: Coursera, Stepik, НИШ" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Дата получения</label>
                <input v-model="cert.issued_date" type="date" class="input-field" />
              </div>

              <div class="form-group">
                <label>Ссылка на сертификат</label>
                <input v-model="cert.url" type="url" class="input-field" placeholder="https://example.com/certificate" />
              </div>
            </div>
          </div>

          <button type="button" @click="addCertificate" class="add-btn">+ Добавить сертификат</button>
        </section>

        <section class="section">
          <h2>Ключевые навыки</h2>
          <textarea v-model="form.skills_text" class="textarea-skills" placeholder="Перечислите ваши навыки через запятую или каждый с новой строки..."></textarea>
        </section>

        <section class="section">
          <h2>Личные качества</h2>
          <textarea v-model="form.personal_qualities" class="textarea-qualities" placeholder="Опишите ваши личные качества..."></textarea>
        </section>
      </div>

      <div v-else class="loading">
        <div class="spinner"></div>
        <p>Загрузка...</p>
      </div>

      <footer class="resume-footer">
        <p>Карагандинский Индустриальный Университет</p>
        <p>8 (7213) 91-56-26 | info@tttu.edu.kz | Темиртау, пр. Республики 30</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const generating = ref(false)

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const getAuthHeaders = () => {
  const token = authStore.token
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  }
}

const currentYear = computed(() => new Date().getFullYear())
const maxDate = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 16)
  return date.toISOString().split('T')[0]
})

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
  personal_qualities: '',
  skills_text: ''
})

const experiences = ref([])
const certificates = ref([])
const programs = ref([])

const errors = reactive({
  last_name: '',
  first_name: '',
  birth_date: '',
  phone: '',
  city: '',
  specialty: '',
  grad_year: ''
})

const validateField = (field) => {
  switch (field) {
    case 'last_name':
      if (!form.last_name.trim()) {
        errors.last_name = 'Фамилия обязательна для заполнения'
      } else if (!/^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(form.last_name)) {
        errors.last_name = 'Фамилия должна содержать только буквы'
      } else {
        errors.last_name = ''
      }
      break
    case 'first_name':
      if (!form.first_name.trim()) {
        errors.first_name = 'Имя обязательно для заполнения'
      } else if (!/^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(form.first_name)) {
        errors.first_name = 'Имя должно содержать только буквы'
      } else {
        errors.first_name = ''
      }
      break
    case 'birth_date':
      if (!form.birth_date) {
        errors.birth_date = 'Дата рождения обязательна для заполнения'
      } else {
        const birthYear = new Date(form.birth_date).getFullYear()
        const age = currentYear.value - birthYear
        if (age < 16) {
          errors.birth_date = 'Вам должно быть не менее 16 лет'
        } else if (age > 100) {
          errors.birth_date = 'Проверьте корректность даты рождения'
        } else {
          errors.birth_date = ''
        }
      }
      break
    case 'phone':
      if (!form.phone.trim()) {
        errors.phone = 'Телефон обязателен для заполнения'
      } else if (!/^[\+\d\s\(\)-]{10,20}$/.test(form.phone)) {
        errors.phone = 'Введите корректный номер телефона'
      } else {
        errors.phone = ''
      }
      break
    case 'city':
      if (!form.city.trim()) {
        errors.city = 'Город обязателен для заполнения'
      } else if (!/^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(form.city)) {
        errors.city = 'Город должен содержать только буквы'
      } else {
        errors.city = ''
      }
      break
    case 'specialty':
      if (!form.specialty.trim()) {
        errors.specialty = 'Специальность обязательна для заполнения'
      } else {
        errors.specialty = ''
      }
      break
    case 'grad_year':
      if (form.grad_year && (form.grad_year < 1950 || form.grad_year > currentYear.value + 5)) {
        errors.grad_year = `Год должен быть между 1950 и ${currentYear.value + 5}`
      } else {
        errors.grad_year = ''
      }
      break
  }
}

const validateForm = () => {
  validateField('last_name')
  validateField('first_name')
  validateField('birth_date')
  validateField('phone')
  validateField('city')
  validateField('specialty')
  validateField('grad_year')
  return !errors.last_name && !errors.first_name && !errors.birth_date && !errors.phone && !errors.city && !errors.specialty
}

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

const addCertificate = () => {
  certificates.value.push({
    title: '',
    issuer: '',
    issued_date: '',
    url: ''
  })
}

const removeCertificate = (index) => {
  certificates.value.splice(index, 1)
}

const loadPrograms = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/resume/educational-programs`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    if (response.ok) {
      programs.value = await response.json()
    }
  } catch (err) {
    console.error('Ошибка загрузки программ:', err)
  }
}

const loadResumeData = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/api/resume/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      if (response.status === 401) {
        await authStore.logout()
        router.push('/login')
        return
      }
      if (response.status === 404) {
        console.log('Профиль не найден, будет создан при сохранении')
        return
      }
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()

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

    if (data.skills && data.skills.length > 0) {
      form.skills_text = data.skills.map(s => s.name).join(', ')
    } else {
      form.skills_text = ''
    }

    experiences.value = data.experiences || []
    certificates.value = data.certificates || []

  } catch (err) {
    console.error('Ошибка загрузки:', err)
  } finally {
    loading.value = false
  }
}

const saveResume = async () => {
  if (!validateForm()) {
    alert('Пожалуйста, исправьте ошибки в форме')
    return
  }

  saving.value = true

  try {
    const payload = {
      last_name: form.last_name,
      first_name: form.first_name,
      phone: form.phone,
      city: form.city,
      specialty: form.specialty,
      birth_date: form.birth_date,
      middle_name: form.middle_name || undefined,
      personal_qualities: form.personal_qualities || '',
      grad_year: form.grad_year || undefined,
      program_id: form.program_id === null ? null : form.program_id,
      experiences: experiences.value.filter(exp => exp.company && exp.position).map(exp => ({
        ...exp,
        end_date: exp.end_date || null
      })),
      certificates: certificates.value.filter(cert => cert.title),
      skills: form.skills_text.trim()
          ? form.skills_text.split(',').map(s => s.trim()).filter(s => s).map(name => ({ name, level: 'intermediate' }))
          : []
    }

    const response = await fetch(`${API_BASE}/api/resume/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка сохранения')
    }

    alert('Резюме сохранено!')
    await loadResumeData()

  } catch (err) {
    console.error('Ошибка:', err)
    alert('Ошибка: ' + err.message)
  } finally {
    saving.value = false
  }
}

const generateCV = async () => {
  generating.value = true
  try {
    const response = await fetch(`${API_BASE}/api/resume/generate-cv?lang=ru`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Ошибка генерации')
    }

    const data = await response.json()
    window.open(`${API_BASE}${data.download_url}`, '_blank')

  } catch (err) {
    console.error('Ошибка:', err)
    alert('Ошибка при генерации резюме')
  } finally {
    generating.value = false
  }
}

onMounted(() => {
  loadResumeData()
  loadPrograms()
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
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.generate-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

/* Шапка в стиле Header.vue — на всю ширину */
.resume-header {
  background: #0a1e5c;
  padding: 0 2rem;
  height: 80px;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  justify-content: flex-start;
}

.resume-logo {
  height: 54px;
  width: auto;
}

.header-text h1 {
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

.resume-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
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

.textarea-skills {
  width: 100%;
  height: 300px;
  resize: vertical;
  font-size: 1rem;
  line-height: 1.6;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: inherit;
}

.textarea-qualities {
  width: 100%;
  height: 200px;
  resize: vertical;
  font-size: 1rem;
  line-height: 1.6;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: inherit;
}

.textarea-description {
  width: 100%;
  height: 350px;
  resize: vertical;
  font-size: 1rem;
  line-height: 1.6;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: inherit;
}

.error-message {
  color: #ef4444;
  font-size: 0.7rem;
  margin-top: 4px;
}

.form-group.error .input-field {
  border-color: #ef4444;
}

.form-group.error label {
  color: #ef4444;
}

.hint {
  font-size: 0.7rem;
  color: #6b7280;
  margin-top: 4px;
  display: block;
}

.program-select {
  cursor: pointer;
  background-color: white;
  text-align: left;
}

.program-select:hover {
  border-color: #3b82f6;
}

.program-select option {
  padding: 10px;
  text-align: left;
}

.experience-item,
.certificate-item {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.experience-header,
.certificate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.experience-header h3,
.certificate-header h3 {
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
}

.add-btn:hover {
  background: #059669;
}

.remove-btn {
  background: #ef4444;
  color: white;
}

.remove-btn:hover {
  background: #dc2626;
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
    padding: 1rem;
  }
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .header-actions {
    flex-direction: column;
  }
  .generate-btn, .save-btn {
    width: 100%;
  }
  .resume-header {
    padding: 0 1rem;
    height: 70px;
  }
  .resume-logo {
    height: 45px;
  }
  .header-text h1 {
    font-size: 1rem;
  }
  .subtitle {
    display: none;
  }
}
</style>