import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', redirect: '/dashboard' },
        { path: '/login', name: 'Login', component: () => import('../components/view/Autorization/Login/Login.vue') },
        { path: '/register', name: 'Register', component: () => import('../components/view/Autorization/Registration/Registration.vue') },
        { path: '/dashboard', name: 'Dashboard', component: () => import('../components/view/Dashboard.vue'), meta: { requiresAuth: true } },
        { path: '/profile', name: 'Profile', component: () => import('../components/view/profile/profile.vue'), meta: { requiresAuth: true } },
        { path: '/resume', name: 'Resume', component: () => import('../components/view/resume/resume.vue'), meta: { requiresAuth: true } },
        { path: '/vacancies', name: 'Vacancies', component: () => import('../components/view/vacancies/vacancies.vue'), meta: { requiresAuth: true } },
        { path: '/ai-chat', name: 'AIChat', component: () => import('../components/view/ai/AIChat.vue'), meta: { requiresAuth: true } },
        { path: '/interview-simulator', name: 'InterviewSimulator', component: () => import('../components/view/ai/InterviewSimulator.vue'), meta: { requiresAuth: true } }
    ]
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Если не проверяли аутентификацию, проверяем
    if (!authStore.isAuthenticated && authStore.user === null) {
        await authStore.checkAuth()
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
    } else if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router