<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const profile = ref({
  fullName: 'Николай Иванов',
  birthDate: '2003-05-15',
  phone: '+7 777 123 4567',
  city: 'Караганда',
  educationProgram: 'Информационные технологии',
  experience: [
    { id: 1, position: 'Frontend Developer Intern', company: 'TechVision', period: '2024 — настоящее время' }
  ],
  certificates: [
    { id: 1, name: 'Google IT Support Professional Certificate' }
  ],
  skills: ['JavaScript', 'Vue.js', 'React', 'Python', 'SQL', 'Git']
})

const profileCompleteness = computed(() => {
  let score = 40 // базовые данные
  if (profile.value.experience.length > 0) score += 20
  if (profile.value.certificates.length > 0) score += 15
  if (profile.value.skills.length > 4) score += 25
  return Math.min(score, 100)
})

const newExperience = ref({ position: '', company: '', period: '' })
const newSkill = ref('')

const addExperience = () => {
  if (newExperience.value.position && newExperience.value.company) {
    profile.value.experience.push({
      id: Date.now(),
      ...newExperience.value
    })
    newExperience.value = { position: '', company: '', period: '' }
  }
}

const removeExperience = (id) => {
  profile.value.experience = profile.value.experience.filter(exp => exp.id !== id)
}

const addSkill = () => {
  if (newSkill.value.trim()) {
    profile.value.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

const removeSkill = (index) => {
  profile.value.skills.splice(index, 1)
}
</script>

<template>
  <div class="profile-page">
    <h1 class="page-title">Мой профиль</h1>

    <!-- Прогресс заполнения -->
    <div class="progress-section">
      <div class="progress-header">
        <span>Полнота профиля</span>
        <strong>{{ profileCompleteness }}%</strong>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: profileCompleteness + '%' }"></div>
      </div>
    </div>

    <div class="profile-grid">
      <!-- Личные данные -->
      <div class="card">
        <h3>Личные данные</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>ФИО</label>
            <input v-model="profile.fullName" type="text" />
          </div>
          <div class="form-group">
            <label>Дата рождения</label>
            <input v-model="profile.birthDate" type="date" />
          </div>
          <div class="form-group">
            <label>Телефон</label>
            <input v-model="profile.phone" type="tel" />
          </div>
          <div class="form-group">
            <label>Город</label>
            <input v-model="profile.city" type="text" />
          </div>
          <div class="form-group">
            <label>Образовательная программа</label>
            <input v-model="profile.educationProgram" type="text" />
          </div>
        </div>
      </div>

      <!-- Опыт работы -->
      <div class="card">
        <h3>Опыт работы</h3>
        <div v-for="exp in profile.experience" :key="exp.id" class="list-item">
          <div>
            <strong>{{ exp.position }}</strong><br>
            <span>{{ exp.company }} • {{ exp.period }}</span>
          </div>
          <button @click="removeExperience(exp.id)" class="delete-btn">✕</button>
        </div>

        <div class="add-form">
          <input v-model="newExperience.position" placeholder="Должность" />
          <input v-model="newExperience.company" placeholder="Компания" />
          <input v-model="newExperience.period" placeholder="Период" />
          <button @click="addExperience" class="add-btn">Добавить</button>
        </div>
      </div>

      <!-- Навыки -->
      <div class="card">
        <h3>Профессиональные навыки</h3>
        <div class="skills-list">
          <span v-for="(skill, i) in profile.skills" :key="i" class="skill-tag">
            {{ skill }}
            <button @click="removeSkill(i)" class="skill-remove">×</button>
          </span>
        </div>
        <div class="add-skill">
          <input v-model="newSkill" placeholder="Новый навык" @keyup.enter="addSkill" />
          <button @click="addSkill" class="add-btn">Добавить</button>
        </div>
      </div>
    </div>

    <button class="save-btn">Сохранить изменения</button>
  </div>
</template>

<style scoped>
.profile-page { max-width: 1100px; margin: 0 auto; }
.page-title { color: #1e3a8a; margin-bottom: 1.5rem; }

.progress-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.progress-bar {
  height: 12px;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1e40af, #3b82f6);
  border-radius: 9999px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.card {
  background: white;
  padding: 1.8rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
}

h3 { margin-bottom: 1.2rem; color: #1e3a8a; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.add-form {
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr auto;
  gap: 10px;
  margin-top: 1rem;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 1rem;
}

.skill-tag {
  background: #e0f2fe;
  color: #1e40af;
  padding: 6px 14px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-btn {
  margin-top: 2rem;
  padding: 14px 32px;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
}
</style>