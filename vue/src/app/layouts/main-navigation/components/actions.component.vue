<script setup lang="ts">
import { computed, ComputedRef } from 'vue'

import LanguagesDropdown from '@/app/layouts/main-navigation/components/dropdowns/languages-dropdown.component.vue'
import UserActionsDropdown from '@/app/layouts/main-navigation/components/dropdowns/user-actions-dropdown.component.vue'

import { MainLayoutController } from '../controllers/main-layout.controller'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { UserDto } from '@/library/data/dto/user.dto'

const authStore: AuthStore = useAuthStore()
const { signin, register, signout } = MainLayoutController

const user: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)
</script>

<template>
  <div class="d-flex me-2 gap-2">
    <nav class="align-content-center flex-grow-1">
      <LanguagesDropdown />
    </nav>

    <template v-if="!user">
      <nav class="align-content-center">
        <button class="btn btn-secondary px-0 border-0" type="button" @click="signin">
          <div class="px-2 fw-bold">
            {{ $t('actions.log-in') }}
          </div>
        </button>
      </nav>

      <nav class="align-content-center flex-grow-1">
        <button class="btn btn-primary px-0 border-0" type="button" @click="register">
          <div class="px-2 fw-bold">
            {{ $t('actions.sign-up') }}
          </div>
        </button>
      </nav>
    </template>

    <template v-else="isAuthenticated">
      <!-- <nav class="align-content-center flex-grow-1">
        <button class="btn btn-dark btn-icon" type="button">
          <font-awesome-icon :icon="['fas', 'bell']" />
          <small class="custom-badge px-1 rounded-pill">99+</small>
        </button>
      </nav> -->
      <nav class="align-content-center flex-grow-1">
        <UserActionsDropdown :signout="signout" :authenticated-user="user" />
      </nav>
    </template>
  </div>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

.btn:has(.custom-badge) {
  position: relative;

  .custom-badge {
    z-index: 100;
    position: absolute;
    top: -0.25rem;
    left: calc(100% - 1.25rem);
    background-color: $danger;
    pointer-events: none;
    border: 2px solid rgba(0, 0, 0, 0.8);
  }
}
</style>
