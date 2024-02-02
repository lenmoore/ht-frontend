import { defineStore } from 'pinia';
import Scene from '../types/scene.type.ts';
import api from '../services/api.ts';

interface SetupStoreState {

}

export const useSetupStore = defineStore('setup', {
    state: (): SetupStoreState => ({}),

    actions: {
        async createScene(payload: Scene) {
            console.log(payload);

            try {

                const response = await api.post('/admin/scenes', payload);
                if (response) {
                    console.log(response);
                }
            } catch (error) {
                console.error(error);
            }
        },
    },
});