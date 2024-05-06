import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

//@ts-ignore
const visitorLoginGuard = (to: any, from: any, next: any) => {
  if (
    localStorage.getItem("user") &&
    localStorage.getItem("admin") === "false" &&
    localStorage.getItem("actor") === "false"
  ) {
    next({ name: "visitor" });
  } else {
    next();
  }
};
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
        beforeEnter: visitorLoginGuard,
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
      {
        path: "/testpublik",
        name: "test-audience",
        component: () => import("../views/PublicViews/Index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(""),
  routes,
});

export default router;
