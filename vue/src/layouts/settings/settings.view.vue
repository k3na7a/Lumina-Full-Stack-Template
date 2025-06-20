<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import SubNavigationLayout from '@/shared/components/top-nav/sub-navigation.layout.vue'
import { options } from './schema/navigation.schema'

const $route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout title="settings.title" subtitle="settings.subtitle" :routes="options">
    <template #content>
      <RouterView v-slot="{ Component }" :key="$route.path">
        <Suspense>
          <component :is="Component" />
          <template #fallback>{{ $t('actions.loading') }}</template>
        </Suspense>
      </RouterView>
    </template>
  </SubNavigationLayout>
</template>
