import { create } from 'zustand';

const useThemeStore = create((set) => ({
    isDark: sessionStorage.getItem('darkMode') === 'true',
    toggleDark: () =>
        set((state) => {
            const next = !state.isDark;
            sessionStorage.setItem('darkMode', String(next));
            return { isDark: next };
        }),
}));

export default useThemeStore;