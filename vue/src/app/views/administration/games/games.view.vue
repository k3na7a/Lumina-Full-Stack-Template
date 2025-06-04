<script setup lang="ts">
import SubNavigationLayout from '@/app/layouts/navigation/top-nav/sub-navigation.layout.vue'
import ErrorBoundary from '@/app/components/error-boundary/error-boundary.component.vue'

import { options } from './schema/navigation.schema'
</script>

<template>
  <SubNavigationLayout title="administration.games-and-software.header" :routes="options">
    <template #content>
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Suspense>
            <template #default>
              <ErrorBoundary>
                <component :is="Component" />
                <template #error>
                  {{ $t('forms.error-general') }}
                </template>
              </ErrorBoundary>
            </template>
            <template #fallback>
              {{ $t('actions.loading') }}
            </template>
          </Suspense>
        </template>
      </RouterView>
    </template>
  </SubNavigationLayout>
</template>
