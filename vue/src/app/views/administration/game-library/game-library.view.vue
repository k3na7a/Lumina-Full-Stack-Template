<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import SubNavigationLayout from '@/app/layouts/sub-navigation/sub-navigation.layout.vue'

import { ROUTE_NAMES } from '@/app/router/routes'
import { sub_navigation } from '@/library/data/types/sub-navigation.type'

const options: sub_navigation = [
  { label: 'administration.game-library.games.label', name: ROUTE_NAMES.ADMIN_GAMES_LIST },
  { label: 'administration.game-library.platforms.label', name: ROUTE_NAMES.ADMIN_GAMES_PLATFORMS_LIST },
  { label: 'administration.game-library.genres.label', name: ROUTE_NAMES.ADMIN_GAMES_GENRES_LIST },
  { label: 'administration.game-library.series.label', name: ROUTE_NAMES.ADMIN_GAMES_SERIES_LIST },
  { label: 'administration.game-library.developers.label', name: ROUTE_NAMES.ADMIN_GAMES_DEVELOPERS_LIST },
  { label: 'administration.game-library.publishers.label', name: ROUTE_NAMES.ADMIN_GAMES_PUBLISHERS_LIST },
  { label: 'administration.game-library.gametypes.label', name: ROUTE_NAMES.ADMIN_GAMES_GAMETYPES_LIST }
]

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout title="administration.game-library.label" :routes="options">
    <template #content>
      <Suspense>
        <RouterView v-slot="{ Component }" :key="route.path">
          <component :is="Component" />
        </RouterView>
        <template #fallback>{{ $t('actions.loading') }}</template>
      </Suspense>
    </template>
  </SubNavigationLayout>
</template>
