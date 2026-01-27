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
          component: () => import('@/views/List/index.vue'),
        },
        {
          path: 'home',
          component: () => import('@/views/About/index.vue'),
        },
      ],
    },
    {
      path: '/',
      component: BlankLayout,
      children: [
        {
          path: 'login',
          component: () => import('@/views/Login/index.vue'),
        },
        {
          path: 'space/apps/:app_id',
          component: () => import('@/views/space/apps/DetailView.vue'),
        },
        {
          path: 'space/apps/test',
          component: () => import('@/views/space/apps/Test.vue'),
        },
        {
          path: 'space/apps/demo',
          component: () => import('@/views/space/apps/Demo.vue'),
        },
        {
          path: 'space/apps/agent',
          component: () => import('@/views/space/apps/agent.vue'),
        },
      ],
    },
  ],
})

export default router
