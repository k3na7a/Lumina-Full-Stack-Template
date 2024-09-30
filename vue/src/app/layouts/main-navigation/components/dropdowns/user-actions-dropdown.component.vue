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
    <template #button>
      <font-awesome-icon :icon="['fas', 'user']" />
    </template>
    <template #menu="{ close }">
      <div class="d-flex flex-column gap-1">
        <div class="px-2 py-1">
          <div class="d-flex align-items-center gap-2">
            <img class="avatar-icon rounded-circle" :src="props.authenticatedUser.profile.avatar" />

            <div class="d-flex flex-column flex-grow-1">
              <p class="text-light fw-semibold">{{ props.authenticatedUser?.getFullName() }}</p>
              <small class="text-light-alt d-block text-truncate">{{ props.authenticatedUser?.email }}</small>
            </div>
          </div>
        </div>
        <div class="d-flex flex-column gap-2">
          <template v-for="(section, index) of USER_ACTIONS" :key="index">
            <hr v-if="index" class="dropdown-divider mx-1 my-0 bg-secondary opacity-50" />
            <div class="d-flex flex-column gap-1">
              <template v-for="action of section.children" :key="action.title">
                <button
                  class="dropdown-item d-flex justify-content-between align-items-center px-2 m-0"
                  type="button"
                  :disabled="action.disabled"
                  @click="(event: MouseEvent) => {
                    action.callback(event)
                    close()
                }"
                >
                  <span class="text-truncate pe-2">{{ $t(action.title) }}</span>
                  <span style="width: 1.5rem" class="text-center"><font-awesome-icon :icon="action.icon" /></span>
                </button>
              </template>
            </div>
          </template>
        </div>
      </div>
    </template>
  </DropdownComponent>
</template>
