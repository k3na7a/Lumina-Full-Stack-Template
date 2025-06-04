<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { computed, ComputedRef } from 'vue'

import { useAuthStore, AuthStore } from '@/app/store/authentication.store'

import UnauthorizedComponent from '@/app/layouts/unauthorized/unauthorized.layout.vue'
import { Role } from '@/library/apis/localhost/dto/user.dto'

const route: RouteLocationNormalizedLoaded = useRoute()
const authStore: AuthStore = useAuthStore()

const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.authenticatedUser?.role === Role.ADMIN)
</script>

<template>
  <template v-if="!isAuthenticated">
    <UnauthorizedComponent title="authentication.not-authorized" />
  </template>
  <template v-else>
    <Suspense>
      <RouterView v-slot="{ Component }" >
        <component :is="Component" />
      </RouterView>
    </Suspense>
  </template>
</template>
