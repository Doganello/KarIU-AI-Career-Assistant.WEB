<template>
  <div class="interview-page">
    <h1 class="page-title">🎯 Симулятор собеседования</h1>

    <!-- Начало собеседования -->
    <div v-if="!started" class="setup-card">
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
        <label>Вакансия (опционально):</label>
        <input v-model="settings.vacancy" type="text" class="input-field" placeholder="Например: Junior Python Developer">
      </div>

      <div class="form-group">
        <label>Язык:</label>
        <select v-model="settings.lang" class="input-field">
          <option value="ru">Русский</option>
          <option value="en">English</option>
          <option value="kz">Қазақша</option>
        </select>
      </div>

      <button @click="startInterview" class="start-btn" :disabled="loading">
        🚀 Начать собеседование
      </button>
    </div>

    <!-- Процесс собеседования -->
    <div v-else class="interview-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${(currentQuestion / maxQuestions) * 100}%` }"></div>
        <span class="progress-text">{{ currentQuestion }} / {{ maxQuestions }} вопросов</span>
      </div>

      <div class="messages-container">
        <div class="messages">
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
        <h2>🎉 Собеседование завершено!</h2>
        <button @click="resetInterview" class="restart-btn">
          🔄 Начать новое собеседование
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { marked } from 'marked'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

const started = ref(false)
const finished = ref(false)
const loading = ref(false)
const currentQuestion = ref(0)
const maxQuestions = 6

const settings = ref({
  type: 'hr',
  vacancy: '',
  lang: 'ru'
})

const messages = ref([])
const answer = ref('')
const sessionId = ref('')

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

const startInterview = async () => {
  loading.value = true

  try {
    const response = await fetch(`${API_BASE}/api/ai/interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        interview_type: settings.value.type,
        vacancy: settings.value.vacancy,
        lang: settings.value.lang
      })
    })

    if (!response.ok) {
      throw new Error('Ошибка начала собеседования')
    }

    const data = await response.json()
    sessionId.value = data.session_id

    messages.value = [
      { role: 'bot', content: data.question }
    ]
    started.value = true
    finished.value = false
    currentQuestion.value = 1

  } catch (error) {
    console.error('Error:', error)
    alert('Ошибка начала собеседования')
  } finally {
    loading.value = false
  }
}

const sendAnswer = async () => {
  if (!answer.value.trim() || loading.value) return

  const userAnswer = answer.value
  messages.value.push({ role: 'user', content: userAnswer })
  answer.value = ''
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

    // Проверяем, завершено ли собеседование (по наличию финального отчёта)
    if (data.response.includes('ИТОГИ СОБЕСЕДОВАНИЯ') || data.response.includes('Вердикт')) {
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
  }
}

const resetInterview = () => {
  started.value = false
  finished.value = false
  messages.value = []
  answer.value = ''
  sessionId.value = ''
  currentQuestion.value = 0
}
</script>

<style scoped>
.interview-page {
  padding: 2rem;
  max-width: 1000px;
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

.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
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
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(30, 64, 175, 0.3);
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

.message-text h1, .message-text h2, .message-text h3 {
  margin: 0.5rem 0;
  color: #1e3a8a;
}

.message-text p {
  margin: 0.5rem 0;
}

.message-text ul, .message-text ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.message-text li {
  margin: 0.25rem 0;
}

.message-text strong {
  font-weight: 700;
  color: #1e40af;
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
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 1rem;
}

.answer-input:focus {
  outline: none;
  border-color: #3b82f6;
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

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(30, 64, 175, 0.3);
}

.hint {
  text-align: center;
  color: #64748b;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.finished-card {
  text-align: center;
}

.finished-card h2 {
  color: #1e3a8a;
  margin-bottom: 1rem;
}

.restart-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.restart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
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

  .message-content {
    max-width: 90%;
  }

  .setup-card, .interview-container {
    padding: 1.5rem;
  }
}
</style>