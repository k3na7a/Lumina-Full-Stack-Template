<script setup lang="ts">
import { computed, ComputedRef } from 'vue'

import NavbarComponent from '@/app/components/navbar/navbar.component.vue'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { UserDto } from '@/library/dto/user.dto'

import NavigationComponent from './components/sections/navigation.component.vue'
import ActionComponent from './components/sections/actions.component.vue'
import { MainLayoutService } from '@/app/layouts/main-navigation/services/main-layout.service'

const authStore: AuthStore = useAuthStore()

const { signin, register, signout } = MainLayoutService

const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.isAuthenticated)
const authenticatedUser: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)
</script>

<template>
  <NavbarComponent>
    <template #left>
      <NavigationComponent />
    </template>

    <template #right>
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
