import { defineStore } from "pinia";
import api from "../services/api.ts";

interface ActorStoreState {}

export const useActorStore = defineStore("actor", {
  state: (): ActorStoreState => ({}),

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
        const response = await api.put(
          `/actor/performances/${payload.performanceId}`,
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
    async getAllScenesForActor() {
      try {
        const response = await api.get("/actor/template-scenes");
        if (response) {
          console.log(response);
        }
        return response.data.data.scenes;
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
        return response.data.data.scenes;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
