<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import { ROUTE_NAMES } from '@/app/router/routes.enum'
import SubNavigationLayout from '@/app/layouts/sub-navigation/sub-navigation.layout.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout
    title="Game Library"
    :routes="[
      {
        name: ROUTE_NAMES.GAMES,
        label: 'Games'
      },
      {
        name: ROUTE_NAMES.HOME,
        label: 'Series'
      },
      {
        name: ROUTE_NAMES.HOME,
        label: 'Platforms'
      },
      {
        name: ROUTE_NAMES.HOME,
        label: 'Genres'
      },
      {
        name: ROUTE_NAMES.HOME,
        label: 'Complete'
      }
    ]"
  >
    <template v-slot:content>
      <Suspense>
        <RouterView v-slot="{ Component }" :key="route.fullPath">
          <component :is="Component" />
        </RouterView>
      </Suspense>
    </template>
  </SubNavigationLayout>
</template>
