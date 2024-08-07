<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { computed, ComputedRef, onMounted } from 'vue'

import { useAuthStore, AuthStore } from '@/app/store/authentication.store'

import { AuthController } from '@/app/controllers/auth.controller'

import UnauthorizedComponent from './components/unauthorized.component.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
const authStore: AuthStore = useAuthStore()

const { signin } = AuthController

const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.isAuthenticated)

onMounted((): void => {
  !isAuthenticated.value && signin()
})
</script>

<template>
  <template v-if="!isAuthenticated">
    <UnauthorizedComponent />
  </template>
  <template v-else>
    <RouterView v-slot="{ Component }" :key="route.fullPath">
      <component :is="Component" />
    </RouterView>
  </template>
</template>
