<script setup lang="ts">
import { UserDto } from '@lib/dto/user.dto'

import LanguagesDropdown from '@/shared/components/dropdown/languages.dropdown.component.vue'

import UserActionsDropdown from './dropdowns/actions.dropdown.component.vue'
import { actions } from '../composables/main.composable'
import { more_navigation } from '@/shared/components/dropdown/types/more-navigation.type'

type props = {
  user?: UserDto
  loading: boolean
  signin: () => void
  register: () => void
  userActions: actions[]
  userNavigation: more_navigation
}

const { user, signin, register, userActions, userNavigation } = defineProps<props>()
</script>

<template>
  <div class="d-flex me-2 gap-2">
    <nav class="align-content-center flex-grow-1">
      <LanguagesDropdown />
    </nav>

    <template v-if="!user">
      <nav class="align-content-center">
        <button :disabled="loading" class="btn btn-secondary px-0 border-0 px-2" type="button" @click="signin">
          {{ $t('actions.log-in') }}
        </button>
      </nav>

      <nav class="align-content-center flex-grow-1">
        <button :disabled="loading" class="btn btn-primary px-0 border-0 px-2" type="button" @click="register">
          {{ $t('actions.sign-up') }}
        </button>
      </nav>
    </template>

    <template v-else="isAuthenticated">
      <nav class="align-content-center flex-grow-1">
        <UserActionsDropdown :user-actions="userActions" :user-navigation="userNavigation" :authenticated-user="user" />
      </nav>
    </template>
  </div>
</template>
