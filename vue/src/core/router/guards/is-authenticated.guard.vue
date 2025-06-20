<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAuthStore, AuthStore } from '@/core/store/authentication.store'
import { useMainHandler } from '@/shared/layouts/main/handlers/main.handler'

import ErrorBoundary from '@/shared/components/error-boundary/error-boundary.v1.component.vue'
import UnauthorizedComponent from '@/shared/components/unauthorized.layout.vue'

const { t } = useI18n()
const handler = useMainHandler(t)

const authStore: AuthStore = useAuthStore()
const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.isAuthenticated)

const bootstrap = (): void => {
  if (!isAuthenticated.value) handler.signin()
}

bootstrap()
</script>

<template>
  <template v-if="!isAuthenticated">
    <UnauthorizedComponent title="authentication.not-logged-in" />
  </template>
  <template v-else>
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
</template>
