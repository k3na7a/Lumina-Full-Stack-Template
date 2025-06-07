<script setup lang="ts">
import AdminLayout from '@/app/components/side-nav/side-nav.layout.vue'
import ErrorBoundary from '@/app/components/error-boundary/error-boundary.v1.component.vue'

import { routes } from './schema/navigation.schema'
</script>

<template>
  <AdminLayout :routes="routes" title="administration.label">
    <template #content>
      <RouterView v-slot="{ Component }">
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
            <template #error>
              {{ $t('forms.error-general') }}
            </template>
          </ErrorBoundary>
        </template>
      </RouterView>
    </template>
  </AdminLayout>
</template>
