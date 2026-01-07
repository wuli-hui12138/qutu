import { defineStore } from 'pinia';
import { storage } from '../utils';

export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDark: false,
    }),
    actions: {
        initTheme() {
            const saved = storage.get('qutu_theme');
            // storage.get usually returns the value, handle null/undefined
            if (saved !== undefined && saved !== null && saved !== '') {
                this.isDark = saved === true || saved === 'true';
            } else {
                this.isDark = false; // Default to Light
            }
        },
        toggleTheme() {
            this.isDark = !this.isDark;
            storage.set('qutu_theme', this.isDark);
        },
        setTheme(value) {
            this.isDark = value;
            storage.set('qutu_theme', this.isDark);
        }
    }
});
