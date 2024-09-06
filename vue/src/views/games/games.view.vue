<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import { ROUTE_NAMES } from '@/router/routes'
import SubNavigationLayout from '@/layouts/sub-navigation/sub-navigation.layout.vue'

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
      <RouterView v-slot="{ Component }" :key="route.fullPath">
        <component :is="Component" />
      </RouterView>
    </template>
  </SubNavigationLayout>
</template>
