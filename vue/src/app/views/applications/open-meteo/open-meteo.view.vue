<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import { ROUTE_NAMES } from '@/app/router/routes'
import SubNavigationLayout from '@/app/layouts/sub-navigation/top-nav/sub-navigation.layout.vue'
import ErrorBoundary from '@/app/components/error-boundary/error-boundary.component.vue'

const routes = [
  {
    name: ROUTE_NAMES.OPEN_METEO_CURRENT,
    label: 'Current'
  },
  {
    name: ROUTE_NAMES.OPEN_METEO_HOURLY,
    label: 'Hourly'
  },
  {
    name: ROUTE_NAMES.PROFILE,
    label: '7 Days'
  },
  {
    name: ROUTE_NAMES.PROFILE,
    label: '14 Days'
  },
  {
    name: ROUTE_NAMES.PROFILE,
    label: 'Historical'
  }
]

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout title="Open-Meteo Forecast" :routes>
    <template #content>
      <ErrorBoundary>
        <Suspense>
          <RouterView v-slot="{ Component }" :key="route.path">
            <component :is="Component" />
          </RouterView>
        </Suspense>
      </ErrorBoundary>
    </template>
  </SubNavigationLayout>
</template>
