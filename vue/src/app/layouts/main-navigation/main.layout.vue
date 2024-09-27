<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { computed, ComputedRef } from 'vue'

import NavbarComponent from '@/app/components/navbar/navbar.component.vue'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { UserDto } from '@/library/dto/user.dto'

import NavigationComponent from './components/sections/navigation.component.vue'
import ActionComponent from './components/sections/actions.component.vue'
import { MainLayoutService } from '@/app/layouts/main-navigation/services/main-layout.service'

const route: RouteLocationNormalizedLoaded = useRoute()
const authStore: AuthStore = useAuthStore()

const { signin, register, signout } = MainLayoutService

const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.isAuthenticated)
const authenticatedUser: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)
</script>

<template>
  <NavbarComponent>
    <template v-slot:left>
      <NavigationComponent :route :is-authenticated />
    </template>

    <template v-slot:right>
      <ActionComponent :signin :register :signout :is-authenticated :authenticated-user />
    </template>
  </NavbarComponent>

  <div class="content-wrapper d-flex flex-column flex-grow-1 overflow-auto">
    <Suspense>
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </Suspense>
  </div>
</template>
