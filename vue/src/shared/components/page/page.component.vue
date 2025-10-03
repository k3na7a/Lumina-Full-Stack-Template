<script setup lang="ts">
import { RouterView } from 'vue-router'

import ErrorBoundary from '@/shared/components/error-boundary/error-boundary.component.vue'
</script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <!-- <ErrorBoundary> -->
      <Suspense>
        <template #default>
          <component :is="Component" />
        </template>
        <template #fallback>
          {{ $t('actions.loading') }}
        </template>
      </Suspense>

      <!-- <template #error="{ error }">
        {{ error }}
      </template> -->
      <!-- </ErrorBoundary> -->
    </template>
  </RouterView>
</template>
