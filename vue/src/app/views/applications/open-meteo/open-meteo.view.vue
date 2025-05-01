<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import { ROUTE_NAMES } from '@/app/router/routes'
import SubNavigationLayout from '@/app/layouts/sub-navigation/top-nav/sub-navigation.layout.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout
    title="Open-Meteo Forecast"
    :routes="[
      {
        name: ROUTE_NAMES.OPEN_METEO_CURRENT,
        label: 'Current'
      },
      {
        name: ROUTE_NAMES.PROFILE,
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
    ]"
  >
    <template #content>
      <Suspense>
        <RouterView v-slot="{ Component }" :key="route.path">
          <component :is="Component" />
        </RouterView>
      </Suspense>
    </template>
  </SubNavigationLayout>
</template>
