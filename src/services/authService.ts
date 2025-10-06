import type {User} from '../entities';
import {firebaseService} from "./firebaseService.ts";

class AuthService {
    async initialize(): Promise<void> {
        await firebaseService.initialize();
    }

    // Проверка авторизации
    isAuthenticated(): boolean {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        return !!(token && user);
    }

    // Получение текущего пользователя
    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (error) {
                console.error('Failed to parse user data:', error);
                return null;
            }
        }
        return null;
    }

    // Получение ID пользователя из localStorage
    getUserId(): string | null {
        return localStorage.getItem('userId');
    }

    // Проверка, есть ли сохраненный пользователь
    hasStoredUser(): boolean {
        const userId = localStorage.getItem('userId');
        const user = localStorage.getItem('user');
        return !!(userId && user);
    }

    // Получение токена
    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    // Выход из системы
    async logout(): Promise<void> {
        try {
            await firebaseService.signOut();

            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
            window.dispatchEvent(new CustomEvent('authLogout'));
        } catch (error) {
            console.error('Ошибка при выходе из системы:', error);
            throw error;
        }
    }

    // Запуск аутентификации через Firebase Google
    async signIn(): Promise<void> {
        try {
            const user = await firebaseService.signInWithGoogle();

            const token = `firebase-google-token-${user.id}`;
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userId', user.id);

            window.dispatchEvent(new CustomEvent('authSuccess', {detail: user}));
        } catch (error) {
            console.error('Firebase Google authentication failed:', error);
            window.dispatchEvent(new CustomEvent('authError', {detail: error}));
            throw error;
        }
    }
}

// Экспорт экземпляра сервиса
export const authService = new AuthService();
