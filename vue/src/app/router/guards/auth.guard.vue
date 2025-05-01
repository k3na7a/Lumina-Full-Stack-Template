<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { computed, ComputedRef, onMounted } from 'vue'

import { useAuthStore, AuthStore } from '@/app/store/authentication.store'
import { MainLayoutService } from '@/app/services/main-layout.service'

import UnauthorizedComponent from '@/app/layouts/unauthorized/unauthorized.layout.vue'

const { signin } = MainLayoutService

const route: RouteLocationNormalizedLoaded = useRoute()
const authStore: AuthStore = useAuthStore()

const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.isAuthenticated)

onMounted((): void => {
  !isAuthenticated.value && signin()
})
</script>

<template>
  <template v-if="!isAuthenticated">
    <UnauthorizedComponent title="authentication.not-logged-in" />
  </template>
  <template v-else>
    <Suspense>
      <RouterView v-slot="{ Component }" :key="route.path">
        <component :is="Component" />
      </RouterView>
    </Suspense>
  </template>
</template>
