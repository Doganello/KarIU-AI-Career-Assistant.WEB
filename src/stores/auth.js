import { defineStore } from 'pinia'

// API_BASE берётся из .env фронтенда (VITE_API_BASE)
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isAuthenticated: false,
        loading: false
    }),

    actions: {
        async login(email, password) {
            this.loading = true
            try {
                const response = await fetch(`${API_BASE}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                })

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}))
                    throw new Error(errorData.detail || 'Неверный email или пароль')
                }

                const data = await response.json()
                this.user = data
                this.isAuthenticated = true
                return data
            } finally {
                this.loading = false
            }
        },

        async register(userData) {
            this.loading = true
            try {
                const response = await fetch(`${API_BASE}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(userData)
                })

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}))
                    throw new Error(errorData.detail || 'Ошибка регистрации')
                }

                const data = await response.json()
                this.user = data
                this.isAuthenticated = true
                return data
            } finally {
                this.loading = false
            }
        },

        async checkAuth() {
            try {
                const response = await fetch(`${API_BASE}/api/auth/me`, {
                    credentials: 'include'
                })

                if (!response.ok) throw new Error()

                this.user = await response.json()
                this.isAuthenticated = true
            } catch {
                this.user = null
                this.isAuthenticated = false
            }
        },

        async logout() {
            try {
                await fetch(`${API_BASE}/api/auth/logout`, {
                    method: 'POST',
                    credentials: 'include'
                })
            } catch (e) {
                console.warn('Logout request failed', e)
            }

            this.user = null
            this.isAuthenticated = false
        }
    }
})