<script setup lang="ts">
import DropdownComponent from '@/app/components/dropdown/dropdown.component.vue'

import { useRouter } from 'vue-router'

import { UserDto } from '@/library/dto/user.dto'
import { user_actions } from '@/app/layouts/main-navigation/schema/user-dropdown-actions.schema'

const props = defineProps<{
  authenticatedUser: UserDto | undefined
  signout: () => void
}>()

const router = useRouter()
const USER_ACTIONS = user_actions(router, props.signout)
</script>

<template>
  <DropdownComponent v-if="props.authenticatedUser" dropdown-align="end">
    <template v-slot:button>
      <font-awesome-icon :icon="['fas', 'user']" />
    </template>
    <template v-slot:menu="{ close }">
      <div class="px-2 my-1">
        <div class="d-flex align-items-center">
          <div class="me-2">
            <img class="avatar-icon rounded-circle" :src="props.authenticatedUser.profile.avatar" />
          </div>
          <div class="d-flex flex-column flex-grow-1">
            <p class="text-light fw-semibold">{{ props.authenticatedUser?.getFullName() }}</p>
            <small class="text-light-alt d-block text-truncate">{{ props.authenticatedUser?.email }}</small>
          </div>
        </div>
      </div>
      <div class="pt-1">
        <template v-for="(section, index) of USER_ACTIONS">
          <div>
            <template v-for="action of section.children">
              <button
                class="dropdown-item d-flex justify-content-between align-items-center px-2"
                type="button"
                :disabled="action.disabled"
                v-on:click="(event: MouseEvent) => {
                    action.callback(event)
                    close()
                }"
              >
                <span class="text-truncate pe-2">{{ $t(action.title) }}</span>
                <span style="width: 1.5rem" class="text-center"><font-awesome-icon :icon="action.icon" /></span>
              </button>
            </template>
          </div>

          <template v-if="index < USER_ACTIONS.length - 1">
            <div class="py-2">
              <hr class="dropdown-divider mx-1 my-0 bg-secondary opacity-50" />
            </div>
          </template>
        </template>
      </div>
    </template>
  </DropdownComponent>
</template>
