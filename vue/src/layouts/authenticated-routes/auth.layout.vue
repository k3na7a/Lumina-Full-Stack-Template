<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { computed, ComputedRef, onMounted } from 'vue'

import { useAuthStore, AuthStore } from '@/store/authentication.store'
import { AuthService } from '@/services/authentication.service'

import UnauthorizedComponent from './components/unauthorized.component.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
const authStore: AuthStore = useAuthStore()

const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.isAuthenticated)

const { signin } = AuthService

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
