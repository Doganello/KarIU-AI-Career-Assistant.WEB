<template>
  <div class="ai-chat-page">
    <div class="chat-header">
      <h1 class="page-title">🤖 AI Карьерный Помощник</h1>
      <button @click="clearChat" class="clear-btn" title="Очистить историю чата">
        🗑️ Очистить чат
      </button>
    </div>

    <div class="chat-container">
      <div class="messages" ref="messagesContainer">
        <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message', msg.role]"
        >
          <div class="message-content">
            <span class="message-icon">{{ msg.role === 'user' ? '👤' : '🤖' }}</span>
            <div class="message-text" v-html="renderMarkdown(msg.content)"></div>
          </div>
        </div>
        <div v-if="isLoading" class="message bot typing">
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

      <div class="input-area">
        <input
            v-model="input"
            @keyup.enter="sendMessage"
            :disabled="isLoading"
            placeholder="Напишите сообщение..."
            class="chat-input"
        />
        <button @click="sendMessage" :disabled="isLoading" class="send-btn">
          {{ isLoading ? '...' : 'Отправить' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { marked } from 'marked'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

// Ключ для localStorage
const STORAGE_KEY = 'kariu_chat_history'

const messages = ref([])
const input = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)

// Настройка marked для красивых списков
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

// Сохранение истории в localStorage
const saveHistory = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
  } catch (e) {
    console.error('Failed to save chat history:', e)
  }
}

// Загрузка истории из localStorage
const loadHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        messages.value = parsed
        scrollToBottom()
        return true
      }
    }
  } catch (e) {
    console.error('Failed to load chat history:', e)
  }
  return false
}

// Очистка истории
const clearChat = () => {
  if (confirm('Вы уверены, что хотите очистить всю историю чата?')) {
    messages.value = [
      {
        role: 'bot',
        content: 'Здравствуйте! Я ваш AI карьерный помощник. Чем могу помочь сегодня?'
      }
    ]
    saveHistory()
    scrollToBottom()
  }
}

// Следим за изменениями сообщений и сохраняем
watch(messages, () => {
  saveHistory()
}, { deep: true })

const sendMessage = async () => {
  if (!input.value.trim() || isLoading.value) return

  const userMessage = input.value
  messages.value.push({ role: 'user', content: userMessage })
  input.value = ''
  await scrollToBottom()
  isLoading.value = true

  try {
    const response = await fetch(`${API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        lang: 'ru'
      }),
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`)
    }

    const data = await response.json()
    messages.value.push({ role: 'bot', content: data.response })
    await scrollToBottom()
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error)
    messages.value.push({
      role: 'bot',
      content: '❌ Произошла ошибка при соединении с сервером. Попробуйте позже.'
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

// При монтировании компонента загружаем историю
onMounted(() => {
  const hasHistory = loadHistory()
  if (!hasHistory) {
    // Если истории нет, добавляем приветственное сообщение
    messages.value = [
      {
        role: 'bot',
        content: 'Здравствуйте! Я ваш AI карьерный помощник. Чем могу помочь сегодня?'
      }
    ]
  }
})
</script>

<style scoped>
.ai-chat-page {
  padding: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  color: #1e3a8a;
  font-size: 1.8rem;
  margin: 0;
}

.clear-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.chat-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f8fafc;
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

/* Стили для markdown в сообщениях бота */
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

.message-text strong, .message-text b {
  font-weight: 700;
  color: #1e40af;
}

.message-text code {
  background: #e2e8f0;
  padding: 0.2rem 0.4rem;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.9em;
}

.message-text pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.message-text hr {
  margin: 0.75rem 0;
  border: none;
  border-top: 1px solid #e2e8f0;
}

.message.user .message-text {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.user .message-text strong {
  color: #fcd34d;
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

.input-area {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
  background: white;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;
}

.chat-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.send-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(30, 64, 175, 0.3);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .ai-chat-page {
    padding: 1rem;
  }

  .message-content {
    max-width: 90%;
  }

  .message-text {
    font-size: 0.9rem;
  }

  .page-title {
    font-size: 1.4rem;
  }

  .chat-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>