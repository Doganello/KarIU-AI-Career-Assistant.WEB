<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(true)
const profileData = ref({
  lastName: '',
  firstName: '',
  middleName: '',
  gender: '',
  birthDate: '',
  phone: '',
  city: '',
  specialty: '',
  educationProgram: '',
  experience: [],
  certificates: '',
  skills: '',
  personalQualities: ''
})

const loadProfile = async () => {
  try {
    const res = await fetch('http://localhost:8000/api/resume/profile', {
      credentials: 'include'
    })
    if (res.ok) {
      const data = await res.json()
      profileData.value = { ...profileData.value, ...data }
    }
  } catch (err) {
    console.error('Ошибка загрузки профиля:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <div class="profile-page">
    <h1 class="page-title">Мой профиль</h1>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else class="profile-content">
      <!-- Основная информация -->
      <div class="card">
        <h2>Основная информация</h2>
        <p><strong>ФИО:</strong> {{ profileData.lastName }} {{ profileData.firstName }} {{ profileData.middleName }}</p>
        <p><strong>Пол:</strong> {{ profileData.gender === 'male' ? 'Мужской' : profileData.gender === 'female' ? 'Женский' : 'Не указан' }}</p>
        <p><strong>Дата рождения:</strong> {{ profileData.birthDate }}</p>
        <p><strong>Город:</strong> {{ profileData.city }}</p>
        <p><strong>Телефон:</strong> {{ profileData.phone }}</p>
        <p><strong>Специальность:</strong> {{ profileData.specialty || 'Не указана' }}</p>
      </div>

      <!-- Образование -->
      <div class="card">
        <h2>Образование</h2>
        <p><strong>Университет:</strong> Карагандский Индустриальный Университет</p>
        <p><strong>Программа:</strong> {{ profileData.educationProgram || 'Не указана' }}</p>
      </div>

      <!-- Опыт работы -->
      <div class="card">
        <h2>Опыт работы</h2>
        <div v-for="(exp, i) in [profileData.experience1, profileData.experience2]" :key="i" v-if="exp && (exp.company || exp.position)" class="experience-item">
          <strong>Место работы {{ i+1 }}</strong><br>
          <strong>{{ exp.company }}</strong> — {{ exp.position }}<br>
          <small>{{ exp.period }}</small>
          <p v-if="exp.description">{{ exp.description }}</p>
        </div>
        <p v-if="!profileData.experience1?.company && !profileData.experience2?.company" class="empty">Опыт работы не добавлен</p>
      </div>

      <!-- Сертификаты -->
      <div class="card">
        <h2>Сертификаты и достижения</h2>
        <p class="pre-wrap">{{ profileData.certificates || 'Не добавлены' }}</p>
      </div>

      <!-- Навыки -->
      <div class="card">
        <h2>Профессиональные навыки</h2>
        <p class="pre-wrap">{{ profileData.skills || 'Не указаны' }}</p>
      </div>

      <!-- Личные качества -->
      <div class="card">
        <h2>Личные качества</h2>
        <p class="pre-wrap">{{ profileData.personalQualities || 'Не указаны' }}</p>
      </div>
    </div>

    <div class="actions">
      <button @click="$router.push('/resume')" class="edit-btn">
        ✏️ Редактировать резюме
      </button>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.page-title {
  color: #1e3a8a;
  margin-bottom: 2rem;
  text-align: center;
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
}

.card h2 {
  color: #1e3a8a;
  margin-bottom: 1.2rem;
  border-bottom: 2px solid #e0f2fe;
  padding-bottom: 10px;
}

.experience-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.experience-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.empty {
  color: #94a3b8;
  font-style: italic;
}

.pre-wrap {
  white-space: pre-wrap;
  line-height: 1.6;
}

.actions {
  margin-top: 2rem;
  text-align: center;
}

.edit-btn {
  padding: 14px 32px;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #64748b;
  padding: 3rem;
}
</style>