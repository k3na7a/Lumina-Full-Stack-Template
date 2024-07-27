<script setup lang="ts">
import { UserDto } from '@/library/dto/user.dto'

import LanguagesDropdown from './dropdowns/languages.dropdown.vue'
import UserActionsDropdown from './dropdowns/useractions.dropdown.vue'

type PropType = {
  isAuthenticated: boolean
  authenticatedUser: UserDto | undefined
  signin: (event: MouseEvent) => void
  signout: (event: MouseEvent) => void
}

const props = defineProps<PropType>()
</script>

<template>
  <div class="d-flex me-2">
    <nav class="align-content-center flex-grow-1 px-1">
      <LanguagesDropdown />
    </nav>

    <nav v-if="!props.isAuthenticated" class="align-content-center px-1">
      <button class="btn btn-secondary px-0 border-0" v-on:click="signin">
        <div class="container fw-bold">
          <span>{{ $t('actions.log-in') }}</span>
        </div>
      </button>
    </nav>

    <nav v-if="!props.isAuthenticated" class="align-content-center flex-grow-1 px-1">
      <button class="btn btn-primary px-0 border-0">
        <div class="container fw-bold">
          <span>{{ $t('actions.sign-up') }}</span>
        </div>
      </button>
    </nav>

    <template v-if="isAuthenticated">
      <div class="d-flex py-2 mx-1">
        <div class="vr"></div>
      </div>
      <nav class="align-content-center flex-grow-1 ps-1">
        <UserActionsDropdown :authenticated-user :signout="props.signout" /></nav
    ></template>
  </div>
</template>
