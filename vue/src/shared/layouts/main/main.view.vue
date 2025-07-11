<script setup lang="ts">
import NavbarComponent from '@/shared/components/navbar/navbar.component.vue'
import RenderedView from '@/shared/components/page/page.component.vue'

import NavigationComponent from './components/navigation.component.vue'
import ActionComponent from './components/actions.component.vue'
import { MAIN_NAVIGATION } from './config/main-navigation.schema'
import { useMainLayout } from './composables/main.composable'

const { register, signin, user, isAuthenticated, loading, MORE_NAVIGATION, USER_NAVIGATION, USER_ACTIONS } =
  useMainLayout()
</script>

<template>
  <NavbarComponent class="th-navbar">
    <template #left>
      <NavigationComponent
        :navigation="MAIN_NAVIGATION"
        :more-navigation="MORE_NAVIGATION"
        :is-authenticated="isAuthenticated"
      />
    </template>

    <template #right>
      <ActionComponent
        :user-navigation="USER_NAVIGATION"
        :user-actions="USER_ACTIONS"
        :loading="loading"
        :user
        :register="register"
        :signin="signin"
      />
    </template>
  </NavbarComponent>

  <div class="content-wrapper d-flex flex-column flex-grow-1 overflow-auto">
    <template v-if="loading">
      <div class="d-flex flex-column flex-grow-1 justify-content-center align-items-center p-3">
        <div class="d-flex flex-column align-items-center gap-1">
          <h4 class="display-font fw-semibold">
            {{ $t('actions.authenticating') }}
          </h4>
          <div class="loader-line"></div>
        </div>
      </div>
    </template>
    <template v-else>
      <RenderedView />
    </template>
  </div>
</template>
