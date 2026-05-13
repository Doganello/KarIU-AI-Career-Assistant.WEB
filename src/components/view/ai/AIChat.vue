<script setup>
import { ref } from 'vue'

const messages = ref([
  {
    type: 'bot',
    text: 'Здравствуйте! Я ваш AI карьерный помощник. Чем могу помочь сегодня?'
  }
])

const input = ref('')

const sendMessage = () => {
  if (!input.value.trim()) return

  messages.value.push({ type: 'user', text: input.value })

  // Симуляция ответа ИИ
  setTimeout(() => {
    const responses = [
      'Отличный вопрос! Давайте разберёмся подробнее...',
      'Я могу помочь улучшить ваше резюме, подготовиться к собеседованию или найти подходящие вакансии.',
      'Расскажите подробнее о вашей ситуации, и я дам максимально полезный совет.'
    ]
    messages.value.push({
      type: 'bot',
      text: responses[Math.floor(Math.random() * responses.length)]
    })
  }, 700)

  input.value = ''
}
</script>

<template>
  <div class="ai-chat-page">
    <h1 class="page-title">🤖 AI Карьерный Помощник</h1>

    <div class="chat-container">
      <div class="messages">
        <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message', msg.type]"
        >
          {{ msg.text }}
        </div>
      </div>

      <div class="input-area">
        <input
            v-model="input"
            @keyup.enter="sendMessage"
            placeholder="Напишите сообщение..."
            class="chat-input"
        />
        <button @click="sendMessage" class="send-btn">Отправить</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-chat-page {
  padding: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.chat-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  height: 75vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  max-width: 80%;
  padding: 14px 18px;
  border-radius: 18px;
  line-height: 1.5;
}

.message.bot {
  align-self: flex-start;
  background: #f1f5f9;
  border-bottom-left-radius: 5px;
}

.message.user {
  align-self: flex-end;
  background: #1e40af;
  color: white;
  border-bottom-right-radius: 5px;
}

.input-area {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
  background: white;
}

.chat-input {
  flex: 1;
  padding: 14px 18px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
}

.send-btn {
  padding: 0 28px;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
}
</style>