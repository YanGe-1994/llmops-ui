import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '@/components/baseLayout.vue'
import BlankLayout from '@/components/blankLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: BaseLayout,
      children: [
        {
          path: '',
          redirect: '/home',
        },
        {
          path: 'list',
          component: () => import('@/views/list/index.vue'),
        },
        {
          path: 'home',
          component: () => import('@/views/home/index.vue'),
        },
      ],
    },
    {
      path: '/',
      component: BlankLayout,
      children: [
        {
          path: 'login',
          component: () => import('@/views/auth/login/index.vue'),
        },
        {
          path: 'space/apps/:app_id',
          component: () => import('@/views/space/apps/detail/index.vue'),
        },
        {
          path: 'space/apps/test',
          component: () => import('@/views/_demo/Test.vue'),
        },
        {
          path: 'space/apps/demo',
          component: () => import('@/views/_demo/Demo.vue'),
        },
        {
          path: 'space/apps/agent',
          component: () => import('@/views/space/apps/agent/index.vue'),
        },
      ],
    },
  ],
})

export default router
