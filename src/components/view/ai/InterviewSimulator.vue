<template>
  <div class="interview-page">
    <div class="interview-header">
      <h1 class="page-title">🎯 Симулятор собеседования</h1>
      <button @click="resetInterview" class="reset-btn" title="Начать заново">
        🔄 Заново
      </button>
    </div>

    <!-- Проверка заполненности резюме -->
    <div v-if="!isProfileComplete" class="warning-card">
      <div class="warning-icon">⚠️</div>
      <h2>Резюме не заполнено</h2>
      <p>Для доступа к симулятору собеседования необходимо полностью заполнить резюме.</p>
      <p class="warning-details">Обязательные поля: Фамилия, Имя, Дата рождения, Телефон, Город, Специальность</p>
      <button @click="goToResume" class="go-to-resume-btn">
        📝 Перейти к заполнению резюме
      </button>
    </div>

    <!-- Начало собеседования -->
    <div v-else-if="!started && !hasHistory" class="setup-card">
      <h2>Настройки собеседования</h2>

      <div class="form-group">
        <label>Тип собеседования:</label>
        <select v-model="settings.type" class="input-field">
          <option value="hr">HR-интервью (Soft skills)</option>
          <option value="technical">Техническое интервью</option>
          <option value="case">Кейс-интервью</option>
        </select>
      </div>

      <div class="form-group">
        <label>Сложность собеседования:</label>
        <select v-model="settings.difficulty" class="input-field">
          <option value="easy">🟢 Лёгкий</option>
          <option value="medium">🟡 Средний</option>
          <option value="hard">🔴 Сложный</option>
        </select>
      </div>

      <div class="form-group required" :class="{ 'error': vacancyError }">
        <label>Вакансия <span class="required-star">*</span>:</label>
        <input
            v-model="settings.vacancy"
            type="text"
            class="input-field"
            placeholder=""
            @blur="validateVacancy"
            @input="validateVacancy"
        />
        <div v-if="vacancyError" class="error-message">{{ vacancyError }}</div>
        <div class="hint">Укажите должность, на которую проходите собеседование</div>
      </div>

      <div class="form-group">
        <label>Язык:</label>
        <select v-model="settings.lang" class="input-field">
          <option value="ru">Русский</option>
          <option value="en">English</option>
          <option value="kz">Қазақша</option>
        </select>
      </div>

      <button @click="startInterview" class="start-btn" :disabled="loading || !isVacancyValid">
        {{ loading ? 'Загрузка...' : '🚀 Начать собеседование' }}
      </button>
    </div>

    <!-- Процесс собеседования -->
    <div v-else class="interview-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
        <span class="progress-text">{{ currentQuestion }} / {{ maxQuestions }} вопросов</span>
      </div>

      <div class="messages-container">
        <div class="messages" ref="messagesContainer">
          <div v-for="(msg, idx) in messages" :key="idx" :class="['message', msg.role]">
            <div class="message-content">
              <span class="message-icon">{{ msg.role === 'user' ? '👤' : '🤖' }}</span>
              <div class="message-text" v-html="renderMarkdown(msg.content)"></div>
            </div>
          </div>
          <div v-if="loading" class="message bot">
            <div class="message-content">
              <span class="message-icon">🤖</span>
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!finished" class="answer-area">
        <textarea
            v-model="answer"
            @keydown.ctrl.enter="sendAnswer"
            placeholder="Напишите ваш ответ здесь..."
            class="answer-input"
            rows="4"
        ></textarea>
        <button @click="sendAnswer" class="send-btn" :disabled="loading">
          ✉️ Отправить ответ
        </button>
        <p class="hint">💡 Подсказка: Ctrl+Enter для отправки</p>
      </div>

      <div v-else class="finished-card">
        <div class="finished-icon">🎉</div>
        <h2>Собеседование завершено!</h2>
        <p class="finished-message">Вы успешно прошли собеседование. Финальный отчёт представлен выше.</p>
        <div class="finished-actions">
          <button @click="resetAndStartNew" class="restart-btn">
            🔄 Начать новое собеседование
          </button>
          <button @click="clearAndGoToSettings" class="settings-btn">
            ⚙️ Изменить настройки
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { marked } from 'marked'

const router = useRouter()
const authStore = useAuthStore()

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const STORAGE_KEY = 'kariu_interview_history'
const STORAGE_SETTINGS_KEY = 'kariu_interview_settings'

const started = ref(false)
const finished = ref(false)
const loading = ref(false)
const currentQuestion = ref(0)
const maxQuestions = 6
const sessionId = ref('')
const messages = ref([])
const answer = ref('')
const messagesContainer = ref(null)
const vacancyError = ref('')
const profileData = ref(null)
const isProfileComplete = ref(false)

const settings = ref({
  type: 'hr',
  difficulty: 'medium',
  vacancy: '',
  lang: 'ru'
})

const hasHistory = computed(() => messages.value.length > 0)
const progressPercent = computed(() => (currentQuestion.value / maxQuestions) * 100)
const isVacancyValid = computed(() => settings.value.vacancy.trim().length >= 3 && !vacancyError.value)

// Валидация вакансии
const validateVacancy = () => {
  const vacancy = settings.value.vacancy.trim()
  if (!vacancy) {
    vacancyError.value = 'Укажите вакансию'
  } else if (vacancy.length < 3) {
    vacancyError.value = 'Название вакансии слишком короткое (минимум 3 символа)'
  } else if (vacancy.length > 100) {
    vacancyError.value = 'Название вакансии слишком длинное (максимум 100 символов)'
  } else if (/^\d+$/.test(vacancy)) {
    vacancyError.value = 'Вакансия не может состоять только из цифр'
  } else if (/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(vacancy)) {
    vacancyError.value = 'Вакансия не может состоять только из символов'
  } else {
    vacancyError.value = ''
  }
}

marked.setOptions({
  breaks: true,
  gfm: true
})

const renderMarkdown = (content) => {
  if (!content) return ''
  try {
    return marked.parse(content)
  } catch (e) {
    console.error('Markdown parse error:', e)
    return content
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const checkProfileCompleteness = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/resume/profile`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })

    if (response.ok) {
      profileData.value = await response.json()

      // Проверяем все обязательные поля резюме
      const requiredFields = ['last_name', 'first_name', 'birth_date', 'phone', 'city', 'specialty']
      const allFieldsFilled = requiredFields.every(field => {
        const value = profileData.value[field]
        return value && value.trim() !== ''
      })

      // Проверяем возраст (не менее 16 лет)
      let ageValid = true
      if (profileData.value.birth_date) {
        const birthYear = new Date(profileData.value.birth_date).getFullYear()
        const currentYear = new Date().getFullYear()
        const age = currentYear - birthYear
        ageValid = age >= 16
      }

      const hasEducation = profileData.value.program_id !== null || profileData.value.program_master_id !== null

      isProfileComplete.value = allFieldsFilled && ageValid && hasEducation
    } else {
      isProfileComplete.value = false
    }
  } catch (err) {
    console.error('Ошибка проверки профиля:', err)
    isProfileComplete.value = false
  }
}

const goToResume = () => {
  router.push('/resume')
}

const saveHistory = () => {
  try {
    const data = {
      messages: messages.value,
      sessionId: sessionId.value,
      currentQuestion: currentQuestion.value,
      started: started.value,
      finished: finished.value,
      settings: settings.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save interview history:', e)
  }
}

const loadHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      if (data.messages && data.messages.length > 0) {
        messages.value = data.messages
        sessionId.value = data.sessionId || ''
        currentQuestion.value = data.currentQuestion || 0
        started.value = data.started || false
        finished.value = data.finished || false
        if (data.settings) {
          settings.value = data.settings
        }
        scrollToBottom()
        return true
      }
    }
  } catch (e) {
    console.error('Failed to load interview history:', e)
  }
  return false
}

const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(STORAGE_SETTINGS_KEY)
}

const saveSettings = () => {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings.value))
  } catch (e) {
    console.error('Failed to save settings:', e)
  }
}

const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_SETTINGS_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      settings.value = data
    }
  } catch (e) {
    console.error('Failed to load settings:', e)
  }
}

watch([messages, currentQuestion, started, finished], () => {
  saveHistory()
}, { deep: true })

watch(settings, () => {
  saveSettings()
}, { deep: true })

const startInterview = async () => {
  validateVacancy()
  if (!settings.value.vacancy.trim() || vacancyError.value) return

  loading.value = true

  try {
    const response = await fetch(`${API_BASE}/api/ai/interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        interview_type: settings.value.type,
        difficulty: settings.value.difficulty,
        vacancy: settings.value.vacancy,
        lang: settings.value.lang
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || 'Ошибка начала собеседования')
    }

    const data = await response.json()
    sessionId.value = data.session_id

    messages.value = [
      { role: 'bot', content: data.question }
    ]
    started.value = true
    finished.value = false
    currentQuestion.value = 1

    await scrollToBottom()

  } catch (error) {
    console.error('Error:', error)
    alert(error.message)
  } finally {
    loading.value = false
  }
}

const sendAnswer = async () => {
  if (!answer.value.trim() || loading.value || finished.value) return

  const userAnswer = answer.value
  messages.value.push({ role: 'user', content: userAnswer })
  answer.value = ''
  await scrollToBottom()
  loading.value = true

  try {
    const response = await fetch(`${API_BASE}/api/ai/interview/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        session_id: sessionId.value,
        answer: userAnswer
      })
    })

    if (!response.ok) {
      throw new Error('Ошибка отправки ответа')
    }

    const data = await response.json()
    messages.value.push({ role: 'bot', content: data.response })
    currentQuestion.value++
    await scrollToBottom()

    if (currentQuestion.value > maxQuestions ||
        data.response.includes('ИТОГИ СОБЕСЕДОВАНИЯ') ||
        data.response.includes('ФИНАЛЬНЫЙ ОТЧЁТ') ||
        data.response.includes('Вердикт')) {
      finished.value = true
    }

  } catch (error) {
    console.error('Error:', error)
    messages.value.push({
      role: 'bot',
      content: '❌ Произошла ошибка. Попробуйте ещё раз.'
    })
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}

const resetInterview = () => {
  if (confirm('Вы уверены, что хотите очистить всю историю собеседования?')) {
    clearHistory()
    started.value = false
    finished.value = false
    messages.value = []
    answer.value = ''
    sessionId.value = ''
    currentQuestion.value = 0
    vacancyError.value = ''
  }
}

const resetAndStartNew = () => {
  clearHistory()
  started.value = false
  finished.value = false
  messages.value = []
  answer.value = ''
  sessionId.value = ''
  currentQuestion.value = 0
  vacancyError.value = ''
}

const clearAndGoToSettings = () => {
  clearHistory()
  started.value = false
  finished.value = false
  messages.value = []
  answer.value = ''
  sessionId.value = ''
  currentQuestion.value = 0
  vacancyError.value = ''
}

onMounted(async () => {
  await checkProfileCompleteness()
  if (isProfileComplete.value) {
    loadSettings()
    const hasSavedHistory = loadHistory()
    if (!hasSavedHistory) {
      started.value = false
    }
  }
})
</script>

<style scoped>
.interview-page {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #f5f7fa 0%, #f8fafc 100%);
}

.interview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  color: #1e3a8a;
  font-size: 2rem;
  margin: 0;
}

.reset-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

/* Стили для предупреждения */
.warning-card {
  background: white;
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.warning-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.warning-card h2 {
  color: #dc2626;
  margin-bottom: 1rem;
}

.warning-card p {
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.warning-details {
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.go-to-resume-btn {
  margin-top: 1.5rem;
  padding: 12px 24px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.go-to-resume-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(30, 64, 175, 0.3);
}

.setup-card, .interview-container, .finished-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.setup-card h2 {
  color: #1e3a8a;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.required-star {
  color: #ef4444;
  margin-left: 4px;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 4px;
}

.hint {
  font-size: 0.7rem;
  color: #6b7280;
  margin-top: 4px;
  display: block;
}

.form-group.error .input-field {
  border-color: #ef4444;
}

.form-group.error label {
  color: #ef4444;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.start-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.5rem;
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(30, 64, 175, 0.3);
}

.start-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.progress-bar {
  background: #e2e8f0;
  border-radius: 10px;
  height: 30px;
  position: relative;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.messages-container {
  background: #f8fafc;
  border-radius: 16px;
  padding: 1rem;
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  animation: fadeIn 0.3s ease;
}

.message.user {
  justify-content: flex-end;
}

.message.bot {
  justify-content: flex-start;
}

.message-content {
  max-width: 85%;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.message.user .message-content {
  flex-direction: row-reverse;
}

.message-text {
  padding: 12px 18px;
  border-radius: 18px;
  line-height: 1.5;
}

.message.user .message-text {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.bot .message-text {
  background: white;
  color: #1e293b;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.message-icon {
  font-size: 1.2rem;
  min-width: 28px;
  text-align: center;
}

.answer-area {
  margin-top: 1rem;
}

.answer-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.answer-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.send-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(30, 64, 175, 0.3);
}

.finished-card {
  text-align: center;
  margin-top: 1rem;
}

.finished-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.finished-card h2 {
  color: #1e3a8a;
  margin-bottom: 0.5rem;
}

.finished-message {
  color: #64748b;
  margin-bottom: 2rem;
}

.finished-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.restart-btn, .settings-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.restart-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.restart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
}

.settings-btn {
  background: #6b7280;
  color: white;
}

.settings-btn:hover {
  background: #4b5563;
  transform: translateY(-2px);
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 18px;
  background: white;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #94a3b8;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .interview-page {
    padding: 1rem;
  }

  .interview-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .message-content {
    max-width: 90%;
  }

  .setup-card, .interview-container {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .finished-actions {
    flex-direction: column;
  }

  .restart-btn, .settings-btn {
    width: 100%;
  }
}
</style>