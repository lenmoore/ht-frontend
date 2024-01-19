import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('../App.vue'),
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
                component: () => import('../views/Admin/Games/index.vue'),
                children: [],
            },
            {
                path: 'performances',
                name: 'performances',
                component: () => import('../views/Admin/Performances/index.vue'),
                children: [],
            },
        ],
    },
    {
        path: '/restart',
        name: 'restart',
        component: () => import('../views/Restart/index.vue'),
        children: [],
    },
];

const router = createRouter({
    history: createWebHistory(''),
    routes,
});

export default router;