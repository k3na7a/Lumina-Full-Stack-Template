<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import SubNavigationLayout from '@/app/layouts/sub-navigation/top-nav/sub-navigation.layout.vue'
import ErrorBoundary from '@/app/components/error-boundary/error-boundary.component.vue'

import { routes } from './schema/navigation.schema'

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
