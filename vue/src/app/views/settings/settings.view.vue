<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import { ROUTE_NAMES } from '@/app/router/routes'
import SubNavigationLayout from '@/app/layouts/sub-navigation/sub-navigation.layout.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout
    title="administration.settings.title"
    subtitle="administration.settings.subtitle"
    :routes="[
      {
        name: ROUTE_NAMES.PROFILE,
        label: 'administration.settings.profile.label'
      },
      {
        name: ROUTE_NAMES.SECURITY,
        label: 'administration.settings.security-privacy.label'
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
