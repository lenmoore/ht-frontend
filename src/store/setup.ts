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
                    return response.data.data;
                }
            } catch (error) {
                console.error(error);
            }
        },
        async getAllScenes() {
            try {
                const response = await api.get('/admin/scenes');
                if (response) {
                    console.log(response);
                }
                return response.data.data.scenes;
            } catch (error) {
                console.error(error);
            }
        },
        async createTask(payload: any) {
            try {
                const response = await api.post('/admin/tasks', payload);
                if (response) {
                    console.log(response);
                    return response.data.data;
                }
            } catch (error) {
                console.error(error);
            }
        },
        async getTaskById(id: string) {
            try {
                const response = await api.get(`/admin/tasks/${id}`);
                if (response) {
                    console.log(response);
                    return response.data.data;
                }
            } catch (error) {
                console.error(error);
            }
        },
        async getSceneById(sceneId: string) {
            try {
                console.log(sceneId);
                const response = await api.get(`/admin/scenes/${sceneId}`);
                if (response) {
                    console.log(response);
                    return response.data.data.scene;
                }

            } catch (error) {
                console.error(error);
            }
        },
        async getAllTasks() {
        },
        async updateTaskById(payload: any) {
            try {
                const response = await api.put(`/admin/tasks/${payload.id}`, payload);
                if (response) {
                    console.log(response);
                    return response.data.data;
                }
            } catch (error) {
                console.error(error);
            }
        },
        async deleteTaskById() {
        },
    },
});