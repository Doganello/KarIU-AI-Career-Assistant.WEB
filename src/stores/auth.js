import { defineStore } from 'pinia'

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
                await this.checkAuth()
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
                    body: JSON.stringify({
                        email: userData.email,
                        password: userData.password
                    })
                })

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}))
                    throw new Error(errorData.detail || 'Ошибка регистрации')
                }

                await this.checkAuth()
                return await response.json()
            } finally {
                this.loading = false
            }
        },

        async checkAuth() {
            try {
                const response = await fetch(`${API_BASE}/api/auth/me`, {
                    credentials: 'include'
                })

                if (!response.ok) {
                    throw new Error('Not authenticated')
                }

                this.user = await response.json()
                this.isAuthenticated = true
                return true
            } catch (error) {
                this.user = null
                this.isAuthenticated = false
                return false
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