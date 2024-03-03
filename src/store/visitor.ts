import { defineStore } from "pinia";
import api from "../services/api.ts";

export const useVisitorStore = defineStore("visitor", {
  state: () => ({
    activeTask: {},
  }),
  actions: {
    async confirmVideo(teamId: string, taskId: string, videoName: string) {
      try {
        const response = await api.post(`/visitor/${teamId}/video`, {
          videoName,
          taskId,
        });
        if (response) {
          return response.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async checkTaskForVisitor(teamId: string) {
      try {
        const response = await api.get(`/visitor/tasks/${teamId}`);
        if (response) {
          return response.data.data.tasks.find((task: any) => task.isActive);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
});
