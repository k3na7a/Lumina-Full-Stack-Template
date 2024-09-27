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
  <div class="d-flex me-2">
    <nav class="align-content-center flex-grow-1 px-1">
      <LanguagesDropdown />
    </nav>

    <nav v-if="!props.isAuthenticated" class="align-content-center px-1">
      <button class="btn btn-secondary px-0 border-0" type="button" v-on:click="props.signin">
        <div class="px-2 fw-bold">
          {{ $t('actions.log-in') }}
        </div>
      </button>
    </nav>

    <nav v-if="!props.isAuthenticated" class="align-content-center flex-grow-1 px-1">
      <button class="btn btn-primary px-0 border-0" type="button" v-on:click="props.register">
        <div class="px-2 fw-bold">
          {{ $t('actions.sign-up') }}
        </div>
      </button>
    </nav>

    <template v-if="props.isAuthenticated">
      <div class="d-flex py-2 mx-1">
        <div class="vr bg-secondary"></div>
      </div>
      <nav class="align-content-center flex-grow-1 ps-1">
        <UserActionsDropdown :signout="props.signout" :authenticated-user="props.authenticatedUser" />
      </nav>
    </template>
  </div>
</template>
