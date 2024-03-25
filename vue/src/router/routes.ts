import { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'main',
    redirect: '/home',
    component: () => import('@/layouts/base.layout.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/app/App.vue'),
        meta: {
          pageTitle: 'Home',
          breadcrumbs: ['Home']
        }
      }
    ]
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    meta: {
      guest: true
    },
    component: () => import('@/views/app/singIn.vue')
  }
]
