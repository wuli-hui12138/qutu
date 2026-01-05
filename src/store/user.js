import { defineStore } from 'pinia';
import { generateUUID, storage } from '../utils';

export const useUserStore = defineStore('user', {
    state: () => ({
        id: storage.get('qutu_user')?.id || null,
    }),
    actions: {
        initUser() {
            if (!this.id) {
                const newId = generateUUID()
                const user = { id: newId, createdAt: new Date().toISOString() }
                storage.set('qutu_user', user)
                this.id = newId
            }
            return this.id
        },
    },
});
