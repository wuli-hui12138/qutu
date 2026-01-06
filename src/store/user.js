import { defineStore } from 'pinia';
import { generateUUID, storage } from '../utils';
import { usersService } from '../services/api';

export const useUserStore = defineStore('user', {
    state: () => ({
        id: storage.get('qutu_user_id') || null, // Database Int ID
        openid: storage.get('qutu_openid') || null, // Device UUID
        userInfo: storage.get('qutu_user_info') || null,
    }),
    actions: {
        async initUser() {
            // 1. Get or generate persistent UUID (openid)
            if (!this.openid) {
                this.openid = storage.get('qutu_openid') || generateUUID();
                storage.set('qutu_openid', this.openid);
            }

            // 2. Login to backend to get/create numeric ID
            try {
                const user = await usersService.login(this.openid);
                if (user && user.id) {
                    this.id = user.id;
                    this.userInfo = user;
                    storage.set('qutu_user_id', this.id);
                    storage.set('qutu_user_info', user);
                }
            } catch (err) {
                console.error('User login failed', err);
            }

            return this.id;
        },
    },
});
