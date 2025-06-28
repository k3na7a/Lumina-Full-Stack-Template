<script setup lang="ts">
import { UserDto } from '@/library/dto/user.dto'

import LanguagesDropdown from '@/shared/components/dropdown/languages-dropdown.component.vue'

import UserActionsDropdown from './dropdowns/actions.dropdown.component.vue'

type props = {
  user?: UserDto
  signin: () => void
  register: () => void
  signout: () => void
}

const { user, signin, register, signout } = defineProps<props>()
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
      <nav class="align-content-center flex-grow-1">
        <UserActionsDropdown :signout="signout" :authenticated-user="user" />
      </nav>
    </template>
  </div>
</template>
