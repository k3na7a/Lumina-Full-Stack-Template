<script setup lang="ts">
import { computed, ComputedRef } from 'vue'

import ProfileSettingsComponent from './components/profile-settings.component.vue'
import DeleteProfileComponent from './components/delete-profile.component.vue'

import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { UserDto } from '@/library/dto/user.dto'

import { AuthController } from '@/app/controllers/auth.controller'

const authStore: AuthStore = useAuthStore()
const { disableAccount } = AuthController

const authenticatedUser: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)
</script>

<template>
  <div id="profile-settings" class="pt-2 flex-grow-1 overflow-auto">
    <ProfileSettingsComponent :authenticated-user />
    <DeleteProfileComponent :callback="disableAccount" />
  </div>
</template>

<style lang="scss">
@import '@/app/sass/variables/index';

#profile-settings {
  // min-height: 200vh; // FOR TESTING ONLY

  & .card {
    max-width: 900px;
  }

  .section {
    & .row-header {
      width: 18rem;
      min-width: 18rem;
    }

    &:not(:last-child) {
      border-bottom: 1px $secondary solid;
    }
  }
}
</style>
