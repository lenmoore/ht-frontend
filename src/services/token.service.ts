import { User } from '../types/user.type.ts';
import { useAuthStore } from '../store/auth.ts';

class TokenService {
    getLocalRefreshToken() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user?.refreshToken;
    }

    getLocalAccessToken() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user?.accessToken;
    }

    getUser() {
        return JSON.parse(localStorage.getItem('user') || '{}');
    }

    setUser(user: User) {
        console.log(user);
        const authStore = useAuthStore();
        authStore.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', user.accessToken); // it has " at beginning and end
        localStorage.setItem('refreshToken', user.refreshToken);
    }

    removeUser() {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
    }
}

export default new TokenService();