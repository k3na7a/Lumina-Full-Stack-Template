<script setup lang="ts">
import NavbarComponent from '@/shared/components/navbar/navbar.component.vue'
import RenderedView from '@/shared/components/page/page.component.vue'

import NavigationComponent from './components/navigation.component.vue'
import ActionComponent from './components/actions.component.vue'
import { MAIN_NAVIGATION } from './config/main-navigation.schema'
import { useMainLayout } from './composables/main.composable'

const { register, signin, signout, user, isAuthenticated } = useMainLayout()
</script>

<template>
  <NavbarComponent class="th-navbar">
    <template #left>
      <NavigationComponent :navigation="MAIN_NAVIGATION" :is-authenticated="isAuthenticated" />
    </template>

    <template #right>
      <ActionComponent :user :register="register" :signin="signin" :signout="signout" />
    </template>
  </NavbarComponent>

  <div class="content-wrapper d-flex flex-column flex-grow-1 overflow-auto">
    <RenderedView />
  </div>
</template>
