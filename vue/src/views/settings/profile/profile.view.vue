<script setup lang="ts">
import { computed, ComputedRef } from 'vue'

import UpdateProfileComponent from './components/update-profile.component.vue'
import DisableAccountComponent from './components/disable-account.component.vue'

import { AuthStore, useAuthStore } from '@/store/authentication.store'
import { UserDto } from '@/library/dto/user.dto'

import { AuthService } from '@/services/authentication.service'

const authStore: AuthStore = useAuthStore()
const { updateProfile, disableAccount } = AuthService
const authenticatedUser: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)
</script>

<template>
  <div class="content-view">
    <div class="d-flex flex-column mb-3">
      <h4 class="text-light fw-semibold mb-1">
        {{ $t('administration.settings.profile.profile-settings.header') }}
      </h4>
      <p class="text-muted fw-normal mb-2">{{ $t('administration.settings.profile.profile-settings.sub-header') }}</p>

      <div class="card d-flex flex-column">
        <UpdateProfileComponent :callback="updateProfile" :authenticated-user />
      </div>
    </div>

    <div class="d-flex flex-column">
      <h4 class="text-light fw-semibold mb-1">
        {{ $t('administration.settings.profile.disable-account.header') }}
      </h4>
      <p class="text-muted fw-normal mb-2">
        {{ $t('administration.settings.profile.disable-account.sub-header') }}
      </p>

      <div class="card d-flex flex-column">
        <div class="section">
          <DisableAccountComponent :callback="disableAccount" />
        </div>
      </div>
    </div>
  </div>
</template>
