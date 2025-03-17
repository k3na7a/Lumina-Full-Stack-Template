<script setup lang="ts">
import { ROUTE_NAMES } from '@/app/router/routes'
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from 'vue-router'

import AdminLayout from '../../layouts/administration-layout/admin.layout.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
const router: Router = useRouter()

const routes = [
  {
    name: ROUTE_NAMES.ADMIN_USER_LIST,
    label: 'administration.users.label',
    icon: ['fas', 'user'],
    callback: (_: MouseEvent) => {
      router.push({ name: ROUTE_NAMES.ADMIN_USER_LIST })
    }
  }
]
</script>

<template>
  <AdminLayout :routes>
    <template #content>
      <Suspense>
        <RouterView v-slot="{ Component }" :key="route.path">
          <component :is="Component" />
        </RouterView>
        <template #fallback>
          <div class="d-flex flex-column h-100 p-3">{{ $t('actions.loading') }}</div>
        </template>
      </Suspense>
    </template>
  </AdminLayout>
</template>
