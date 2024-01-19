import { defineStore } from 'pinia';

interface AuthStoreState {

}

export const useAuthStore = defineStore('auth', {
    state: (): AuthStoreState => ({}),

    actions: {
        // login()
        // logout()
        // restart()
        // register()
    },
});