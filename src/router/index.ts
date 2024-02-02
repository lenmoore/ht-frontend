import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('../App.vue'),
        children: [],
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Auth/LoginView.vue'),
        children: [],
    },
    {
        path: '/visitor',
        name: 'visitor',
        component: () => import('../views/VisitorView/index.vue'),
        children: [],
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/ActorDashboard/index.vue'),
        children: [],
    },
    {
        path: '/admin',
        name: 'home',
        component: () => import('../views/Admin/index.vue'),
        children: [
            {
                path: 'games',
                name: 'games',
                component: () => import('../views/Admin/Games/AdminGames.vue'),
                children: [
                    {
                        path: 'groups/:group',
                        name: 'groups',
                        component: () => import('../views/Admin/Games/GroupGame/GroupGame.vue'),
                        children: [],
                    },
                ],
            },
            {
                path: 'performances',
                name: 'performances',
                component: () => import('../views/Admin/Performances/index.vue'),
                children: [],
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(''),
    routes,
});

export default router;