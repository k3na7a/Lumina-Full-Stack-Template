<script setup lang="ts">
import { computed, ComputedRef } from 'vue'

import UpdateProfileComponent from './components/update-profile.component.vue'
import DisableAccountComponent from './components/disable-account.component.vue'
import ProfilePictureComponent from './components/profile-picture.component.vue'

import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { UserDto } from '@/library/dto/user.dto'
import { SettingsService } from '../../services/settings.service'

const authStore: AuthStore = useAuthStore()
const { updateProfile, disableAccount, updateAvatar } = SettingsService
const authenticatedUser: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)
</script>

<template>
  <div class="content-view-settings d-flex flex-column gap-3">
    <div class="d-flex flex-column gap-2">
      <h4 class="text-light fw-semibold">
        {{ $t('administration.settings.profile.avatar.label') }}
      </h4>
      <div class="card d-flex flex-column">
        <ProfilePictureComponent v-if="authenticatedUser" :user="authenticatedUser" :callback="updateAvatar" />
      </div>
    </div>

    <div class="d-flex flex-column gap-2">
      <div class="d-flex flex-column">
        <h4 class="text-light fw-semibold">
          {{ $t('administration.settings.profile.profile-settings.header') }}
        </h4>
        <p class="text-muted fw-normal">{{ $t('administration.settings.profile.profile-settings.sub-header') }}</p>
      </div>
      <div class="card d-flex flex-column">
        <UpdateProfileComponent :callback="updateProfile" :authenticated-user />
      </div>
    </div>

    <div class="d-flex flex-column gap-2">
      <div class="d-flex flex-column">
        <h4 class="text-light fw-semibold">
          {{ $t('administration.settings.profile.disable-account.header') }}
        </h4>
        <p class="text-muted fw-normal">
          {{ $t('administration.settings.profile.disable-account.sub-header') }}
        </p>
      </div>
      <div class="card d-flex flex-column">
        <div class="section">
          <DisableAccountComponent :callback="disableAccount" />
        </div>
      </div>
    </div>
  </div>
</template>
