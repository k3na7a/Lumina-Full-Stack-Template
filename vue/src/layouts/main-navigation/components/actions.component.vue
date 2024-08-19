<script setup lang="ts">
import { UserDto } from '@/library/dto/user.dto'

import LanguagesDropdown from '@/components/dropdown/languages-dropdown.component.vue'
import UserActionsDropdown from '@/components/dropdown/user-actions-dropdown.component.vue'

type PropType = {
  isAuthenticated: boolean
  authenticatedUser: UserDto | undefined
  signin: () => void
  register: () => void
  signout: () => void
}

const props = defineProps<PropType>()
</script>

<template>
  <div class="d-flex me-2">
    <nav class="align-content-center flex-grow-1 px-1">
      <LanguagesDropdown />
    </nav>

    <nav v-if="!props.isAuthenticated" class="align-content-center px-1">
      <button class="btn btn-secondary px-0 border-0" type="button" v-on:click="signin">
        <div class="container px-2 fw-bold">
          {{ $t('actions.log-in') }}
        </div>
      </button>
    </nav>

    <nav v-if="!props.isAuthenticated" class="align-content-center flex-grow-1 px-1">
      <button class="btn btn-primary px-0 border-0" type="button" v-on:click="register">
        <div class="container px-2 fw-bold">
          {{ $t('actions.sign-up') }}
        </div>
      </button>
    </nav>

    <template v-if="isAuthenticated">
      <div class="d-flex py-2 mx-1">
        <div class="vr bg-secondary"></div>
      </div>
      <nav class="align-content-center flex-grow-1 ps-1">
        <UserActionsDropdown :signout :authenticated-user />
      </nav>
    </template>
  </div>
</template>
