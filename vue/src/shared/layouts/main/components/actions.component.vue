<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAuthHandler } from '@/core/composables/authentication.handler'
import { UserDto } from '@/core/apis/dto/user.dto'
import { AuthStore, useAuthStore } from '@/core/store/authentication.store'

import LanguagesDropdown from '@/shared/components/dropdown/languages-dropdown.component.vue'
import UserActionsDropdown from '../components/dropdowns/user-actions-dropdown.component.vue'

const { t } = useI18n()
const handler = useAuthHandler(t)

const authStore: AuthStore = useAuthStore()

const user: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)
</script>

<template>
  <div class="d-flex me-2 gap-2">
    <nav class="align-content-center flex-grow-1">
      <LanguagesDropdown />
    </nav>

    <template v-if="!user">
      <nav class="align-content-center">
        <button class="btn btn-secondary px-0 border-0" type="button" @click="handler.signin">
          <div class="px-2 fw-bold">
            {{ $t('actions.log-in') }}
          </div>
        </button>
      </nav>

      <nav class="align-content-center flex-grow-1">
        <button class="btn btn-primary px-0 border-0" type="button" @click="handler.register">
          <div class="px-2 fw-bold">
            {{ $t('actions.sign-up') }}
          </div>
        </button>
      </nav>
    </template>

    <template v-else="isAuthenticated">
      <nav class="align-content-center flex-grow-1">
        <UserActionsDropdown :signout="handler.signout" :authenticated-user="user" />
      </nav>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import '@/shared/sass/variables/index';

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
