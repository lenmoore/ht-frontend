import { defineStore } from "pinia";
import api from "../services/api.ts";

interface ActorStoreState {
  tasks: [];
  performances: [];
  activePerformance: any;
  activePerformanceScenes: [];
}

export const useActorStore = defineStore("actor", {
  state: (): ActorStoreState => ({
    tasks: [],
    performances: [],
    activePerformance: null,
    activePerformanceScenes: [],
  }),

  actions: {
    async getPerformances() {
      try {
        const response = await api.get("/actor/performances");
        if (response) {
          console.log(response);
          return response.data.data.performances;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getPerformanceById(id: string) {
      try {
        const response = await api.get(`/actor/performances/${id}`);
        if (response) {
          console.log(response);
          return response.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async editPerformance(payload: any) {
      try {
        console.log(payload);
        if (localStorage.admin === "true") {
          const response = await api.put(
            `/admin/performances/${payload.performanceId}`,
            payload,
          );
          if (response) {
            console.log(response);
            return response.data.data;
          }
        } else {
          const response = await api.put(
            `/actor/performances/${payload.performanceId}`,
            payload,
          );
          if (response) {
            console.log(response);
            return response.data.data;
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getAllScenesForActor() {
      try {
        const response = await api.get("/actor/template-scenes");
        return response.data.data.scenes
          .filter(
            (scene: any) =>
              scene.groupName === localStorage.getItem("group_name"),
          )
          .map((scene: any) => ({
            ...scene,
            isCompleted: scene.tasks.filter(
              (task: any) => !task.isConfirmedByTeam,
            ).length,
          }));
      } catch (error) {
        console.error(error);
      }
    },
    async getActorPerformanceScenes(query: any) {
      try {
        const response = await api.get("/actor/performance-scenes", {
          params: query,
        });
        if (response) {
          console.log(response);
        }
        return response.data.data;
      } catch (error) {
        console.error(error);
      }
    },
    async startScene(payload: any) {
      try {
        const response = await api.post("/actor/performance-scenes", payload);
        if (response) {
          console.log(response);
          return response.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async toggleTask(payload: any) {
      try {
        const response = await api.put(
          `/actor/performance-scenes/toggle-task/${payload._id}`,
          payload,
        );
        if (response) {
          console.log(response);
          const task: any = this.tasks.find(
            (task: any) => task._id === payload._id,
          );
          if (task) {
            task.isActive = payload.isActive;
          }
          return response.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
});
