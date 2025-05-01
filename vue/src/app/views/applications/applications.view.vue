<script setup lang="ts">
import { ROUTE_NAMES } from '@/app/router/routes'
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from 'vue-router'

import AdminLayout from '@/app/layouts/sub-navigation/side-nav/side-nav.layout.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
const router: Router = useRouter()

const routes = [
  {
    name: ROUTE_NAMES.APPS_OPEN_METEO,
    label: 'Open-Meteo Forecast',
    icon: ['fas', 'cloud-showers-heavy'],
    callback: (_: MouseEvent) => {
      router.push({ name: ROUTE_NAMES.APPS_OPEN_METEO })
    }
  }
]
</script>

<template>
  <AdminLayout :routes title="applications.label">
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
