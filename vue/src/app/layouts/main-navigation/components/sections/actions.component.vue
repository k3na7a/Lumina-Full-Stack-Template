<script setup lang="ts">
import { UserDto } from '@/library/dto/user.dto'

import LanguagesDropdown from '@/app/layouts/main-navigation/components/dropdowns/languages-dropdown.component.vue'
import UserActionsDropdown from '@/app/layouts/main-navigation/components/dropdowns/user-actions-dropdown.component.vue'

const props = defineProps<{
  isAuthenticated: boolean
  authenticatedUser: UserDto | undefined
  signin: () => void
  register: () => void
  signout: () => void
}>()
</script>

<template>
  <div class="d-flex me-2 gap-2">
    <nav class="align-content-center flex-grow-1">
      <LanguagesDropdown />
    </nav>

    <template v-if="!props.isAuthenticated">
      <nav class="align-content-center">
        <button class="btn btn-secondary px-0 border-0" type="button" @click="props.signin">
          <div class="px-2 fw-bold">
            {{ $t('actions.log-in') }}
          </div>
        </button>
      </nav>

      <nav class="align-content-center flex-grow-1">
        <button class="btn btn-primary px-0 border-0" type="button" @click="props.register">
          <div class="px-2 fw-bold">
            {{ $t('actions.sign-up') }}
          </div>
        </button>
      </nav>
    </template>

    <template v-else="props.isAuthenticated">
      <nav class="align-content-center flex-grow-1">
        <button class="btn btn-dark btn-icon" type="button">
          <font-awesome-icon :icon="['fas', 'bell']" />
          <small class="custom-badge px-1 rounded-pill">99+</small>
        </button>
      </nav>
      <nav class="align-content-center flex-grow-1">
        <UserActionsDropdown :signout="props.signout" :authenticated-user="props.authenticatedUser" />
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
  }
}
</style>
