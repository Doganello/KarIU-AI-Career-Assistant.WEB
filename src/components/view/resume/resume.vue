<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(true)
const saving = ref(false)

const resumeData = ref({
  lastName: '',
  firstName: '',
  middleName: '',
  gender: '',
  birthDate: '',
  phone: '',
  city: 'Темиртау',
  specialty: '',
  educationProgram: '',
  experience1: { company: '', position: '', period: '', description: '' },
  experience2: { company: '', position: '', period: '', description: '' },
  certificates: '',
  skills: '',
  personalQualities: ''
})

const loadResumeData = async () => {
  try {
    const res = await fetch('http://localhost:8000/api/resume/profile', { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      resumeData.value = { ...resumeData.value, ...data }
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const saveResume = async () => {
  saving.value = true
  try {
    const fullName = [resumeData.value.lastName, resumeData.value.firstName, resumeData.value.middleName]
        .filter(Boolean).join(' ')

    await fetch('http://localhost:8000/api/resume/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        full_name: fullName,
        last_name: resumeData.value.lastName,
        first_name: resumeData.value.firstName,
        middle_name: resumeData.value.middleName,
        gender: resumeData.value.gender,
        birth_date: resumeData.value.birthDate,
        phone: resumeData.value.phone,
        city: resumeData.value.city,
        specialty: resumeData.value.specialty,
        education_program: resumeData.value.educationProgram,
        experience: [resumeData.value.experience1, resumeData.value.experience2]
            .filter(exp => exp.company || exp.position),
        certificates: resumeData.value.certificates,
        skills: resumeData.value.skills,
        personal_qualities: resumeData.value.personalQualities
      })
    })
    alert('✅ Резюме успешно сохранено!')
  } catch (err) {
    alert('❌ Ошибка сохранения')
  } finally {
    saving.value = false
  }
}

onMounted(loadResumeData)
</script>

<template>
  <div class="resume-page">
    <div class="resume-container">
      <div class="header-actions">
        <button @click="saveResume" :disabled="saving" class="save-btn">
          {{ saving ? 'Сохранение...' : '💾 Сохранить резюме' }}
        </button>
      </div>

      <!-- Шапка -->
      <header class="resume-header">
        <div class="header-content">
          <img src="@/assets/logo.jpeg" alt="KarIU" class="resume-logo" />
          <div class="header-text">
            <h1>KarIU Career Assistant</h1>
            <p class="subtitle">Помогаем строить успешную карьеру</p>
          </div>
        </div>
      </header>

      <div class="resume-body">
        <!-- Основная информация -->
        <section class="section">
          <h2>Основная информация</h2>
          <div class="form-group"><label>Фамилия</label><input v-model="resumeData.lastName" class="input-field" /></div>
          <div class="form-group"><label>Имя</label><input v-model="resumeData.firstName" class="input-field" /></div>
          <div class="form-group"><label>Отчество</label><input v-model="resumeData.middleName" class="input-field" /></div>

          <div class="form-group">
            <label>Пол</label>
            <div class="gender-buttons">
              <button :class="{ active: resumeData.gender === 'male' }" @click="resumeData.gender = 'male'">Мужской</button>
              <button :class="{ active: resumeData.gender === 'female' }" @click="resumeData.gender = 'female'">Женский</button>
            </div>
          </div>

          <div class="form-group"><label>Специальность / Профессия</label><input v-model="resumeData.specialty" class="input-field" placeholder="Например: Frontend Developer" /></div>
          <div class="form-group"><label>Город</label><input v-model="resumeData.city" class="input-field" /></div>
          <div class="form-group"><label>Телефон</label><input v-model="resumeData.phone" class="input-field" placeholder="+7 (___) ___ __ __" /></div>
          <div class="form-group"><label>Дата рождения</label><input v-model="resumeData.birthDate" type="date" class="input-field" /></div>
          <div class="form-group"><label>Образовательная программа</label><input v-model="resumeData.educationProgram" class="input-field" placeholder="Информационные технологии" /></div>
        </section>

        <!-- Опыт работы -->
        <section class="section">
          <h2>Опыт работы</h2>

          <div class="sub-section">
            <h3>Место работы 1</h3>
            <div class="form-group"><label>Компания</label><input v-model="resumeData.experience1.company" class="input-field" placeholder="Компания" /></div>
            <div class="form-group"><label>Должность</label><input v-model="resumeData.experience1.position" class="input-field" placeholder="Должность" /></div>
            <div class="form-group"><label>Период</label><input v-model="resumeData.experience1.period" class="input-field" placeholder="Например: Июнь 2024 — настоящее время" /></div>
            <div class="form-group"><label>Описание обязанностей</label><textarea v-model="resumeData.experience1.description" class="input-field" rows="4" placeholder="Что вы делали..."></textarea></div>
          </div>

          <div class="sub-section">
            <h3>Место работы 2</h3>
            <div class="form-group"><label>Компания</label><input v-model="resumeData.experience2.company" class="input-field" placeholder="Компания" /></div>
            <div class="form-group"><label>Должность</label><input v-model="resumeData.experience2.position" class="input-field" placeholder="Должность" /></div>
            <div class="form-group"><label>Период</label><input v-model="resumeData.experience2.period" class="input-field" placeholder="Например: Июнь 2024 — настоящее время" /></div>
            <div class="form-group"><label>Описание обязанностей</label><textarea v-model="resumeData.experience2.description" class="input-field" rows="4" placeholder="Что вы делали..."></textarea></div>
          </div>
        </section>

        <!-- Сертификаты -->
        <section class="section">
          <h2>Сертификаты и достижения</h2>
          <textarea v-model="resumeData.certificates" class="input-field" rows="4" placeholder="Перечислите сертификаты"></textarea>
        </section>

        <!-- Навыки -->
        <section class="section">
          <h2>Профессиональные навыки</h2>
          <textarea v-model="resumeData.skills" class="input-field" rows="4" placeholder="JavaScript, Vue.js, Git, Английский..."></textarea>
        </section>

        <!-- Личные качества -->
        <section class="section">
          <h2>Личные качества</h2>
          <textarea v-model="resumeData.personalQualities" class="input-field" rows="4" placeholder="Ответственный, Коммуникабельный, Целеустремлённый..."></textarea>
        </section>
      </div>

      <footer class="resume-footer">
        Карагандский Индустриальный Университет<br>
        📞 8 (7213) 91-56-26 &nbsp; | &nbsp; ✉️ info@tttu.edu.kz &nbsp; | &nbsp; 📍 г. Темиртау, пр. Республики 30
      </footer>
    </div>
  </div>
</template>

<style scoped>
.resume-page { padding: 2rem; background: #f8fafc; min-height: 100vh; }
.resume-container { max-width: 900px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 10px 35px rgba(0,0,0,0.08); overflow: hidden; }

.header-actions { padding: 1rem 3rem; text-align: right; background: #f8fafc; }
.save-btn { background: #1e40af; color: white; padding: 14px 36px; border: none; border-radius: 12px; font-size: 1.1rem; cursor: pointer; }

.resume-header {
  background: white;
  padding: 2rem 3rem;
  border-bottom: 1px solid #e5e7eb;
}

.header-content { display: flex; align-items: center; gap: 20px; }
.resume-logo { height: 75px; width: auto; }
.header-text h1 { margin: 0; font-size: 1.85rem; color: #1e3a8a; }
.subtitle { margin: 4px 0 0 0; color: #64748b; font-size: 1.05rem; }

.section {
  padding: 2rem 3rem;
  border-bottom: 1px solid #f1f5f9;
}
.section:last-child { border-bottom: none; }

.sub-section {
  margin-bottom: 2.5rem;
}

.sub-section h3 {
  margin: 0 0 1.2rem 0;
  color: #1e3a8a;
  font-size: 1.25rem;
}

.form-group {
  margin-bottom: 1.8rem;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}

.input-field {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 1.02rem;
}

.gender-buttons { display: flex; gap: 12px; }
.gender-buttons button {
  flex: 1; padding: 14px; border: 2px solid #e5e7eb; border-radius: 10px; background: white; cursor: pointer;
}
.gender-buttons button.active { border-color: #3b82f6; background: #eff6ff; color: #1e40af; font-weight: 600; }

.resume-footer {
  background: #0f172a;
  color: #cbd5e1;
  padding: 2rem 3rem;
  text-align: center;
}
</style>