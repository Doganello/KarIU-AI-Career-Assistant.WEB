<script setup>
import { ref } from 'vue'

const currentQuestionIndex = ref(0)
const userAnswer = ref('')
const feedback = ref('')

const questions = [
  "Расскажите немного о себе.",
  "Почему вы хотите работать именно в нашей компании?",
  "Какие ваши strongest стороны и над чем вы работаете?",
  "Где вы видите себя через 5 лет?",
  "Как вы справляетесь с дедлайнами и стрессовыми ситуациями?"
]

const submitAnswer = () => {
  if (!userAnswer.value.trim()) return

  feedback.value = "Хороший ответ! Рекомендую добавлять больше конкретных примеров из опыта (метод STAR)."

  setTimeout(() => {
    if (currentQuestionIndex.value < questions.length - 1) {
      currentQuestionIndex.value++
      userAnswer.value = ''
      feedback.value = ''
    } else {
      feedback.value = "🎉 Поздравляем! Вы завершили симуляцию собеседования."
    }
  }, 1200)
}
</script>

<template>
  <div class="interview-page">
    <h1 class="page-title">🎤 Симулятор собеседования</h1>

    <div class="simulator-card">
      <div class="progress">
        Вопрос {{ currentQuestionIndex + 1 }} из {{ questions.length }}
      </div>

      <h3 class="question">{{ questions[currentQuestionIndex] }}</h3>

      <textarea
          v-model="userAnswer"
          placeholder="Введите ваш ответ здесь..."
          class="answer-input"
          rows="7"
      ></textarea>

      <button @click="submitAnswer" class="submit-btn">
        Ответить и получить обратную связь
      </button>

      <div v-if="feedback" class="feedback">
        <strong>Обратная связь ИИ:</strong>
        <p>{{ feedback }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.interview-page {
  padding: 1.5rem;
  max-width: 850px;
  margin: 0 auto;
}

.simulator-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.progress {
  color: #64748b;
  font-weight: 500;
  margin-bottom: 1rem;
}

.question {
  font-size: 1.4rem;
  line-height: 1.55;
  color: #1e3a8a;
  margin-bottom: 2rem;
}

.answer-input {
  width: 100%;
  padding: 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1.05rem;
  resize: vertical;
  min-height: 180px;
  margin-bottom: 1.5rem;
}

.submit-btn {
  width: 100%;
  padding: 16px;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
}

.feedback {
  margin-top: 2rem;
  padding: 1.8rem;
  background: #f0fdf4;
  border-radius: 12px;
  border-left: 5px solid #4ade80;
}
</style>