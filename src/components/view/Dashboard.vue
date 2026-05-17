<template>
  <div class="dashboard">
    <!-- Hero секция -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Карагандинский Индустриальный Университет</h1>
        <p class="hero-subtitle">Формируем инженерную элиту Казахстана. Качественное техническое образование, современные лаборатории и международное признание.</p>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ animatedStats.students }}+</div>
            <div class="stat-label">Студентов</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ animatedStats.programs }}+</div>
            <div class="stat-label">Программ</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ animatedStats.employment }}%</div>
            <div class="stat-label">Трудоустройство</div>
          </div>
        </div>
      </div>
    </section>

    <!-- О нас секция -->
    <section class="about">
      <div class="container">
        <h2 class="section-title">О нас</h2>
        <div class="about-content">
          <div class="about-text">
            <h3>Ведущий технический вуз региона</h3>
            <p>Более 60 лет мы готовим высококвалифицированных специалистов для промышленности Казахстана.</p>
            <div class="mission-box">
              <h4>Миссия</h4>
              <p>Подготовка эффективных технократов для индустриального региона с широким использованием R&D образовательных технологий.</p>
            </div>
            <div class="mission-box">
              <h4>Видение</h4>
              <p>Карагандинский индустриальный университет — опорный вуз для базовой отрасли региона.</p>
            </div>
          </div>
          <div class="about-stats">
            <div class="about-stat-item">
              <div class="about-stat-value">1963</div>
              <div class="about-stat-label">Год основания</div>
            </div>
            <div class="about-stat-item">
              <div class="about-stat-value">90%</div>
              <div class="about-stat-label">Практико-ориентированное обучение</div>
            </div>
            <div class="about-stat-item">
              <div class="about-stat-value">50+</div>
              <div class="about-stat-label">Партнёров-работодателей</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Наши преимущества -->
    <section class="advantages">
      <div class="container">
        <h2 class="section-title">Наши преимущества</h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon">🎓</div>
            <h3>Международная аккредитация</h3>
            <p>Образовательные программы имеют международную аккредитацию, признаваемую работодателями по всему миру.</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">🔬</div>
            <h3>Современные лаборатории</h3>
            <p>Оснащённые по последнему слову техники лаборатории для практического обучения.</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">🤝</div>
            <h3>Сотрудничество с индустрией</h3>
            <p>Партнёрство с крупнейшими промышленными предприятиями региона.</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">🌍</div>
            <h3>Академическая мобильность</h3>
            <p>Возможность обучения за рубежом по программам обмена.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Быстрые действия -->
    <section class="quick-actions">
      <div class="container">
        <h2 class="section-title">Быстрые действия</h2>
        <div class="actions-grid">
          <div class="action-card" @click="$router.push('/resume')">
            <div class="action-icon">📄</div>
            <h3>Моё резюме</h3>
            <p>Заполните и скачайте профессиональное резюме</p>
          </div>
          <div class="action-card" @click="$router.push('/vacancies')">
            <div class="action-icon">💼</div>
            <h3>Вакансии</h3>
            <p>Актуальные вакансии от компаний-партнёров</p>
          </div>
          <div class="action-card" @click="$router.push('/interview-simulator')">
            <div class="action-icon">🎤</div>
            <h3>Симулятор собеседования</h3>
            <p>Потренируйтесь проходить собеседования с ИИ</p>
          </div>
          <div class="action-card" @click="$router.push('/ai-chat')">
            <div class="action-icon">🤖</div>
            <h3>AI Помощник</h3>
            <p>Получите консультацию по карьерным вопросам</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Контакты -->
    <section class="contacts">
      <div class="container">
        <h2 class="section-title">Контакты</h2>
        <div class="contacts-grid">
          <div class="contact-card">
            <div class="contact-icon">📞</div>
            <div class="contact-text">8 (7213) 91-56-26</div>
          </div>
          <div class="contact-card">
            <div class="contact-icon">✉️</div>
            <div class="contact-text">info@tttu.edu.kz</div>
          </div>
          <div class="contact-card">
            <div class="contact-icon">📍</div>
            <div class="contact-text">г. Темиртау, пр. Республики 30</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const targetStats = {
  students: 3000,
  programs: 65,
  employment: 90
}

const animatedStats = ref({
  students: 0,
  programs: 0,
  employment: 0
})

const animateNumbers = () => {
  const duration = 2000
  const startTime = performance.now()

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    animatedStats.value.students = Math.floor(progress * targetStats.students)
    animatedStats.value.programs = Math.floor(progress * targetStats.programs)
    animatedStats.value.employment = Math.floor(progress * targetStats.employment)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

onMounted(() => {
  animateNumbers()
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f7fa;
}

/* Hero секция */
.hero {
  background: linear-gradient(135deg, #0a2472 0%, #1e3a8a 50%, #2563eb 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 800px;
  margin: 0 auto 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
}

/* Общие стили */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  color: #1e3a8a;
  margin-bottom: 3rem;
  position: relative;
  padding-bottom: 1rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  border-radius: 2px;
}

/* О нас */
.about {
  padding: 4rem 0;
  background: white;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.about-text h3 {
  font-size: 1.5rem;
  color: #1e3a8a;
  margin-bottom: 1rem;
}

.about-text p {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.mission-box {
  background: #f0f4ff;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 1rem;
  border-left: 4px solid #1e3a8a;
}

.mission-box h4 {
  color: #1e3a8a;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.mission-box p {
  margin-bottom: 0;
}

.about-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.about-stat-item {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 16px;
  text-align: center;
}

.about-stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1e3a8a;
}

.about-stat-label {
  color: #6b7280;
  font-size: 0.9rem;
}

/* Преимущества */
.advantages {
  padding: 4rem 0;
  background: #f8fafc;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.advantage-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  transition: transform 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.advantage-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.advantage-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.advantage-card h3 {
  color: #1e3a8a;
  margin-bottom: 0.5rem;
}

.advantage-card p {
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Быстрые действия */
.quick-actions {
  padding: 4rem 0;
  background: white;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.action-card {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(30, 58, 138, 0.3);
}

.action-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  margin-bottom: 0.5rem;
}

.action-card p {
  opacity: 0.9;
  font-size: 0.9rem;
}

/* Контакты */
.contacts {
  padding: 4rem 0;
  background: #0f172a;
  color: white;
}

.contacts .section-title {
  color: white;
}

.contacts .section-title::after {
  background: white;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.contact-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: background 0.3s;
}

.contact-card:hover {
  background: rgba(255, 255, 255, 0.2);
}

.contact-icon {
  font-size: 1.5rem;
}

.contact-text {
  font-size: 1rem;
}

/* Адаптивность */
@media (max-width: 768px) {
  .hero-title {
    font-size: 1.8rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .about-content {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .container {
    padding: 0 1rem;
  }

  .advantages-grid,
  .actions-grid,
  .contacts-grid {
    grid-template-columns: 1fr;
  }

  .stat-number {
    font-size: 2rem;
  }
}
</style>