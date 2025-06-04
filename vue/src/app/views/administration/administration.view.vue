<script setup lang="ts">
import AdminLayout from '@/app/layouts/navigation/side-nav/side-nav.layout.vue'
import ErrorBoundary from '@/app/components/error-boundary/error-boundary.component.vue'

import { routes } from './schema/navigation.schema'
</script>

<template>
  <AdminLayout :routes="routes" title="administration.label">
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
  </AdminLayout>
</template>
