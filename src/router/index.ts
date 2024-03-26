import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "app-home",
    redirect: { name: "login" },
    component: () => import("../App.vue"),
    children: [
      {
        path: "/login",
        name: "login",
        component: () => import("../views/Auth/LoginView.vue"),
        children: [],
      },
      {
        path: "/visitor",
        name: "visitor",
        component: () => import("../views/VisitorView/index.vue"),
        children: [],
      },
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("../views/ActorDashboard/ActorDashboard.vue"),
        children: [],
      },
      {
        path: "/admin",
        name: "admin-home",
        component: () => import("../views/Admin/index.vue"),
        children: [
          {
            path: "games",
            name: "games",
            component: () => import("../views/Admin/Games/AdminGames.vue"),
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(""),
  routes,
});

export default router;
