import { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'main',
    redirect: '/home',
    component: () => import('@/components/layouts/main.layout.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/helloworld/App.vue'),
        meta: {
          pageTitle: 'Home',
          breadcrumbs: ['Home']
        }
      },
      {
        path: '/sign-in',
        name: 'sign-in',
        meta: {
          guest: true
        },
        component: () => import('@/views/helloworld/SingIn.vue')
      }
    ]
  }
]
