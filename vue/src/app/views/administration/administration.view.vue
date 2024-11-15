<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import SubNavigationLayout from '@/app/layouts/sub-navigation/sub-navigation.layout.vue'

import { sub_navigation } from '@/library/data/types/sub-navigation.type'
import { ROUTE_NAMES } from '@/app/router/routes'

const administration_navigation: sub_navigation = [
  {
    name: ROUTE_NAMES.ADMIN_USERS,
    label: 'administration.users.label'
  },
  {
    name: ROUTE_NAMES.ADMIN_GAMES,
    label: 'administration.game-library.label'
  }
]

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout title="administration.label" :routes="administration_navigation">
    <template #content>
      <Suspense>
        <RouterView v-slot="{ Component }" :key="route.fullPath">
          <component :is="Component" />
        </RouterView>
        <template #fallback>{{ $t('actions.loading') }}</template>
      </Suspense>
    </template>
  </SubNavigationLayout>
</template>
