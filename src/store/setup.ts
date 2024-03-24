import { defineStore } from "pinia";
import Scene from "../types/scene.type.ts";
import api from "../services/api.ts";

interface SetupStoreState {
  teams: any[];
}

export const useSetupStore = defineStore("setup", {
  state: (): SetupStoreState => ({ teams: [] }),

  actions: {
    async createScene(payload: Scene) {
      console.log(payload);

      try {
        const response = await api.post("/admin/scenes", payload);
        if (response) {
          console.log(response);
          return response.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getAllScenes(groupName: string) {
      try {
        const response = await api.get("/admin/scenes");
        if (response) {
          console.log(response);
        }
        return response.data.data.scenes.filter(
          (scene: any) => scene.groupName === groupName,
        );
      } catch (error) {
        console.error(error);
      }
    },
    async createTask(payload: any) {
      try {
        console.log(payload);
        const response = await api.post("/admin/tasks", payload);
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
    async getAllTasks() {},
    async updateTaskById(payload: any) {
      try {
        const response = await api.put(`/admin/tasks/${payload._id}`, payload);
        if (response) {
          console.log(response);
          return response.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async deleteTaskById(id: number) {
      try {
        const response = await api.delete(`/admin/tasks/${id}`);
        if (response) {
          console.log(response);
          return response.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getAllTeamsInGroup(payload: any) {
      try {
        console.log("getAllTeamsInGroup payload", payload);
        const response = await api.get("/teams", { params: payload });
        if (response) {
          console.log(response.data.data);
          this.teams = response.data.data;
          return this.teams;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async addPerformance(payload: any) {
      try {
        const response = await api.post("/admin/performances", payload);
        if (response) {
          console.log(response);
          return response.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    },

    async updatePerformanceById(payload: any) {
      try {
        const response = await api.put(
          `/admin/performances/${payload.id}`,
          payload,
        );
        if (response) {
          console.log(response);
          return response.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getPerformances() {
      try {
        const response = await api.get("/admin/performances");
        if (response) {
          console.log(response);
          return response.data.data.performances;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
});
