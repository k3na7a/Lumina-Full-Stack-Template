<script setup lang="ts">
import { computed, ComputedRef } from 'vue'

import UpdateEmailComponent from './components/update-email.component.vue'
import UpdatePasswordComponent from './components/update-password.component.vue'

import { AuthStore, useAuthStore } from '@/store/authentication.store'
import { UserDto } from '@/library/dto/user.dto'

import { AuthService } from '@/services/authentication.service'

const { updateEmail, updatePassword } = AuthService

const authStore: AuthStore = useAuthStore()
const authenticatedUser: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)
</script>

<template>
  <div class="content-view">
    <div class="d-flex flex-column mb-3">
      <h4 class="text-light fw-semibold mb-1">{{ $t('administration.settings.security-privacy.contact.header') }}</h4>
      <p class="text-muted fw-normal mb-2">{{ $t('administration.settings.security-privacy.contact.sub-header') }}</p>

      <div class="card d-flex flex-column mb">
        <div class="section">
          <UpdateEmailComponent :callback="updateEmail" :authenticated-user />
        </div>
        <div class="section">
          <div class="d-flex flex-column flex-sm-row p-3">
            <div class="row-header pe-3 mb-2 mb-sm-0">
              <h6 class="fw-bold">{{ $t('forms.phone') }}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column">
      <h4 class="text-light fw-semibold mb-1">{{ $t('administration.settings.security-privacy.security.header') }}</h4>
      <p class="text-muted fw-normal mb-2">{{ $t('administration.settings.security-privacy.security.sub-header') }}</p>

      <div class="card d-flex flex-column">
        <div class="section">
          <UpdatePasswordComponent :callback="updatePassword" :authenticated-user />
        </div>
        <div class="section">
          <div class="d-flex flex-column flex-sm-row p-3">
            <div class="row-header pe-3 mb-2 mb-sm-0">
              <h6 class="fw-bold">{{ $t('forms.two-factor') }}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
