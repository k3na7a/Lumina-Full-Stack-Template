<script setup lang="ts">
import { computed, ComputedRef } from 'vue'

import ErrorBoundary from '@/shared/components/error-boundary/error-boundary.v1.component.vue'
import UnauthorizedComponent from '@/shared/components/unauthorized.layout.vue'
import { Role } from '@/core/apis/dto/user.dto'
import { AuthStore, useAuthStore } from '@/core/store/authentication.store'

const authStore: AuthStore = useAuthStore()
const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.authenticatedUser?.role === Role.ADMIN)
</script>

<template>
  <template v-if="!isAuthenticated">
    <UnauthorizedComponent title="authentication.not-authorized" />
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
