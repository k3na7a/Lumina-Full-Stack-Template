<script setup lang="ts">
import { computed, ComputedRef } from 'vue'

import UpdateProfileComponent from './components/update-profile.component.vue'
import DisableAccountComponent from './components/disable-account.component.vue'
import UpdateEmailComponent from './components/update-email.component.vue'
import UpdatePasswordComponent from './components/update-password.component.vue'

import { AuthStore, useAuthStore } from '@/store/authentication.store'
import { UserDto } from '@/library/dto/user.dto'

import { AuthController } from '@/controllers/authentication.controller'

const authStore: AuthStore = useAuthStore()
const authenticatedUser: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)

const { disableAccount, updateProfile, updateEmail, updatePassword } = AuthController
</script>

<template>
  <div id="profile-settings" class="pt-2 pb-3 flex-grow-1">
    <div class="d-flex flex-column mb-3">
      <h4 class="text-light fw-semibold mb-1">Profile Settings</h4>
      <p class="text-muted fw-normal mb-2">Change identifying details for your account</p>

      <div class="card d-flex flex-column">
        <UpdateProfileComponent :callback="updateProfile" :authenticated-user />
      </div>
    </div>

    <div class="d-flex flex-column mb-3">
      <h4 class="text-light fw-semibold mb-1">Security</h4>
      <p class="text-muted fw-normal mb-2">Keep your account safe and sound</p>

      <div class="card d-flex flex-column">
        <div class="section">
          <UpdateEmailComponent :callback="updateEmail" :authenticated-user />
        </div>
        <div class="section">
          <UpdatePasswordComponent :callback="updatePassword" :authenticated-user />
        </div>
      </div>
    </div>

    <div class="d-flex flex-column">
      <h4 class="text-light fw-semibold mb-1">Disabling Your Testhub Account</h4>
      <p class="text-muted fw-normal mb-2">Completely deactivate your account</p>

      <div class="card d-flex flex-column">
        <div class="section">
          <DisableAccountComponent :callback="disableAccount" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/sass/variables/index';

#profile-settings {
  max-width: 900px;

  .row-header {
    width: 18rem;
    min-width: 18rem;
  }
}
</style>
