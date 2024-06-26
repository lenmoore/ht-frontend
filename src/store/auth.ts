import { defineStore } from "pinia";
import { User } from "../types/user.type.ts";
import TokenService from "../services/token.service.ts";
import api from "../services/api.ts";

interface AuthStoreState {
  user?: User | null;

  accessToken: string;
  refreshToken: string;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthStoreState => ({
    accessToken: "",
    refreshToken: "",
    user: null,
  }),

  actions: {
    async login(name: string, password: string) {
      try {
        const response = await api.post("/auth/login", {
          email: name,
          password,
        });
        console.log(response);
        if (response.data.data.accessToken) {
          const user: User = {
            ...response.data.data.user,
            email: name,
            accessToken: response.data.data.accessToken,
            refreshToken: response.data.data.refreshToken,
            activePerformance: response.data.data.activePerformance,
          };
          console.log(user);
          localStorage.setItem("admin", user.admin.toString());
          localStorage.setItem("actor", user.actor.toString());
          localStorage.setItem("group_name", user.group_name);
          localStorage.setItem(
            "activePerformanceId",
            user.activePerformance[0]?._id?.toString(),
          );
          localStorage.setItem(
            "activePerformance",
            user.activePerformance[0]?.toString(),
          );
          TokenService.setUser(user);

          return user;
        }
      } catch (error) {
        console.error(error);
      }
    },

    // logout()
    // restart()
    // register()
  },
});
