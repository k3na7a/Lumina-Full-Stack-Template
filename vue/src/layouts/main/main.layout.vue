<script setup lang="ts">
import NavbarComponent from '@/shared/components/navbar/navbar.component.vue'

import NavigationComponent from './components/navigation.component.vue'
import ActionComponent from './components/actions.component.vue'

import ErrorBoundary from '@/shared/components/error-boundary/error-boundary.v1.component.vue'
</script>

<template>
  <NavbarComponent>
    <template #left>
      <NavigationComponent />
    </template>

    <template #right>
      <ActionComponent />
    </template>
  </NavbarComponent>

  <div class="content-wrapper d-flex flex-column flex-grow-1 overflow-auto">
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
  </div>
</template>
