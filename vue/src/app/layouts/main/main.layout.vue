<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { computed, ComputedRef } from 'vue'

import NavbarComponent from '@/app/components/navbar/navbar.component.vue'
import NavigationComponent from '@/app/layouts/main/components/navbar/navigation.component.vue'
import ActionComponent from '@/app/layouts/main/components/navbar/actions.component.vue'

import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { UserDto } from '@/library/dto/user.dto'

import { MainLayoutController } from './controllers/main-layout.controller'

const route: RouteLocationNormalizedLoaded = useRoute()
const authStore: AuthStore = useAuthStore()

const { signin, register, signout } = MainLayoutController

const path: ComputedRef<string | undefined> = computed(() => route.name?.toString())
const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.isAuthenticated)
const authenticatedUser: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)
</script>

<template>
  <NavbarComponent>
    <template v-slot:left>
      <NavigationComponent :path :is-authenticated />
    </template>

    <template v-slot:right>
      <ActionComponent :signin :register :signout :is-authenticated :authenticated-user />
    </template>
  </NavbarComponent>

  <div class="content-wrapper d-flex flex-column flex-grow-1 overflow-auto">
    <RouterView v-slot="{ Component }" :key="route.fullPath">
      <component :is="Component" />
    </RouterView>
  </div>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

.th-navbar {
  z-index: map-get($header-config, z-index);

  .top-nav {
    height: map-get($header-config, height, desktop);
  }
}
</style>
