import {onAuthStateChanged as firebaseOnAuthStateChanged, signInWithPopup, signOut} from "firebase/auth";
import {auth, googleProvider} from "../firebase";
import type {User} from '../entities';

class FirebaseService {
    private isInitialized = false;

    async initialize(): Promise<void> {
        if (this.isInitialized) return;
        this.isInitialized = true;
    }

    async signInWithGoogle(): Promise<User> {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;
            return {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || firebaseUser.email || 'Google User',
                avatarUrl: firebaseUser.photoURL || undefined,
            };
        } catch (error) {
            console.error('Ошибка Firebase Google аутентификации:', error);
            throw error;
        }
    }

    async signOut(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Ошибка при выходе из системы:', error);
            throw error;
        }
    }

    getCurrentUser(): User | null {
        const firebaseUser = auth.currentUser;

        if (!firebaseUser) {
            return null;
        }

        return {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email || 'Firebase User',
            avatarUrl: firebaseUser.photoURL || undefined,
        };
    }

    // Проверка состояния аутентификации
    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const user: User = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    name: firebaseUser.displayName || firebaseUser.email || 'Firebase User',
                    avatarUrl: firebaseUser.photoURL || undefined,
                };
                callback(user);
            } else {
                callback(null);
            }
        });
    }
}

export const firebaseService = new FirebaseService();
