import { apiService } from './api';
import type { User } from '../entities';

// Google OAuth конфигурация
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Интерфейс для Google Auth ответа
interface GoogleAuthResponse {
  credential: string;
  select_by: string;
}

// Интерфейс для декодированного JWT токена
interface GoogleJWT {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  iat: number;
  exp: number;
}

class AuthService {
  private isGoogleLoaded = false;

  // Загрузка Google Auth скрипта
  private async loadGoogleAuth(): Promise<void> {
    if (this.isGoogleLoaded) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isGoogleLoaded = true;
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Auth script'));
      };
      
      document.head.appendChild(script);
    });
  }

  // Инициализация Google Auth
  async initializeGoogleAuth(): Promise<void> {
    await this.loadGoogleAuth();
    
    if (typeof window.google !== 'undefined') {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: this.handleGoogleAuth.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    }
  }

  // Обработка ответа от Google Auth
  private async handleGoogleAuth(response: GoogleAuthResponse): Promise<void> {
    try {
      const user = await this.authenticateWithGoogle(response.credential);
      
      // Сохраняем токен в localStorage
      localStorage.setItem('authToken', response.credential);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Диспатчим событие для обновления состояния
      window.dispatchEvent(new CustomEvent('authSuccess', { detail: user }));
    } catch (error) {
      console.error('Google Auth error:', error);
      window.dispatchEvent(new CustomEvent('authError', { detail: error }));
    }
  }

  // Аутентификация через Google
  async authenticateWithGoogle(credential: string): Promise<User> {
    try {
      const user = await apiService.authenticateWithGoogle(credential);
      return user;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  // Декодирование JWT токена (для получения sub)
  decodeGoogleJWT(token: string): GoogleJWT | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }

  // Получение sub из токена
  getGoogleSub(token: string): string | null {
    const decoded = this.decodeGoogleJWT(token);
    return decoded?.sub || null;
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

  // Получение токена
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Выход из системы
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Диспатчим событие для обновления состояния
    window.dispatchEvent(new CustomEvent('authLogout'));
  }

  // Запуск Google Auth (заглушка для тестирования)
  async signInWithGoogle(): Promise<void> {
    // Заглушка для тестирования - имитируем успешную авторизацию
    console.log('🔧 Используется заглушка авторизации для тестирования');
    
    // Создаем тестового пользователя
    const testUser: User = {
      id: 'test_109876543210987654321',
      email: 'test@example.com',
      name: 'Тестовый Пользователь',
      avatarUrl: 'https://via.placeholder.com/150/007bff/ffffff?text=T',
    };

    // Имитируем JWT токен
    const mockToken = 'mock-jwt-token-for-test_109876543210987654321';

    // Сохраняем данные в localStorage
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('user', JSON.stringify(testUser));

    // Диспатчим событие успешной авторизации
    window.dispatchEvent(new CustomEvent('authSuccess', { detail: testUser }));
    
    console.log('✅ Пользователь авторизован:', testUser);

    // Если Google Auth настроен, используем его
    if (typeof window.google !== 'undefined' && GOOGLE_CLIENT_ID) {
      console.log('🔐 Google Auth настроен, переключаемся на реальную авторизацию');
      window.google.accounts.id.prompt();
    } else {
      console.log('⚠️ Google Client ID не настроен, используется заглушка');
    }
  }
}

// Расширение глобального объекта Window для Google Auth
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

// Экспорт экземпляра сервиса
export const authService = new AuthService();
