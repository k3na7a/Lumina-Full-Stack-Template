<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { computed, ComputedRef } from 'vue'

import { useAuthStore, AuthStore } from '@/library/store/authentication.store'

import UnauthorizedComponent from './components/unauthorized.component.vue'
import { Role } from '@/library/data/dto/user/user.dto'

const route: RouteLocationNormalizedLoaded = useRoute()
const authStore: AuthStore = useAuthStore()

const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.authenticatedUser?.role === Role.ADMIN)
</script>

<template>
  <template v-if="!isAuthenticated">
    <UnauthorizedComponent />
  </template>
  <template v-else>
    <Suspense>
      <RouterView v-slot="{ Component }" :key="route.path">
        <component :is="Component" />
      </RouterView>
    </Suspense>
  </template>
</template>
