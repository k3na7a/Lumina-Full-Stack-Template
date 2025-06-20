<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import { options } from './schema/navigation.schema'

import SubNavigationLayout from '@/shared/components/top-nav/sub-navigation.layout.vue'
import ErrorBoundary from '@/shared/components/error-boundary/error-boundary.v1.component.vue'
import Alert from '@/shared/components/alerts/alert.component.vue'

const $route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout title="administration.users.header" :routes="options">
    <template #content>
      <RouterView v-slot="{ Component }" :key="$route.path">
        <template v-if="Component">
          <ErrorBoundary>
            <Suspense>
              <template #default>
                <component :is="Component" />
              </template>
              <template #fallback>
                {{ $t('actions.loading') }}
              </template>
            </Suspense>
            <template #error="{ error, clearError }">
              <Alert :error="error?.message" :callback="clearError" />
            </template>
          </ErrorBoundary>
        </template>
      </RouterView>
    </template>
  </SubNavigationLayout>
</template>
