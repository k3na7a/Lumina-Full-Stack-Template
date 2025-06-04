<script setup lang="ts">
import SubNavigationLayout from '@/app/layouts/sub-navigation/top-nav/sub-navigation.layout.vue'
import ErrorBoundary from '@/app/components/error-boundary/error-boundary.component.vue'

import { options } from './schema/navigation.schema'
</script>

<template>
  <SubNavigationLayout title="administration.games-and-software.header" :routes="options">
    <template #content>
      <ErrorBoundary>
        <Suspense>
          <RouterView v-slot="{ Component }">
            <component :is="Component" />
          </RouterView>
          <template #fallback>{{ $t('actions.loading') }}</template>
        </Suspense>
      </ErrorBoundary>
    </template>
  </SubNavigationLayout>
</template>
