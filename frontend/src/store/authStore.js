import { create } from 'zustand';

let _memoryToken = null;

const useAuthStore = create((set) => ({
    user: (() => {
        try {
            const raw = sessionStorage.getItem('user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    })(),
    token: (() => sessionStorage.getItem('token' || null)()),

    login: (user, token) => {
        _memoryToken = token;
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', token);
        set({ user, token });
    },

    logout: () => {
        _memoryToken = null;
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        set({ user: null, token: null });
    },
}));

export const getMemoryToken = () => {
    if (_memoryToken) return _memoryToken;
    const stored = sessionStorage.getItem('token');
    if (stored) {
        _memoryToken = stored;
        return stored;
    }
    return null;
};

export default useAuthStore;