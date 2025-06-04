<script setup lang="ts">
import NavbarComponent from '@/app/components/navbar/navbar.component.vue'

import NavigationComponent from './components/navigation.component.vue'
import ActionComponent from './components/actions.component.vue'

import ErrorBoundary from '@/app/components/error-boundary/error-boundary.component.vue'

import { useAuthStore } from '@/app/store/authentication.store'

const authStore = useAuthStore()

const bootstrap = async () => {
  await authStore.verifyToken().catch(() => console.warn('[Auth] Failed to initialize user session.'))
}

await bootstrap()
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
  </div>
</template>
