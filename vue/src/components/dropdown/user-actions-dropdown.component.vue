<script setup lang="ts">
import DropdownComponent from '@/components/dropdown/base/dropdown.component.vue'

import { useRouter } from 'vue-router'

import { UserDto } from '@/library/dto/user.dto'
import { user_actions } from '@/config/user-dropdown-actions.config'

type PropType = {
  authenticatedUser: UserDto | undefined
  signout: () => void
}

const props = defineProps<PropType>()
const router = useRouter()

const USER_ACTIONS = user_actions(router, props.signout)
</script>

<template>
  <DropdownComponent dropdown-align="end" :autoclose="'inside'">
    <template v-slot:button>
      <font-awesome-icon :icon="['fas', 'user']" />
    </template>
    <template v-slot:menu="{ close }">
      <div class="px-2 my-1">
        <h5 class="d-block text-light fw-bolder text-nowrap text-truncate">
          {{ props.authenticatedUser?.getFullName() }}
        </h5>
        <small class="text-muted d-block text-truncate">{{ props.authenticatedUser?.email }}</small>
      </div>
      <div class="pt-1">
        <template v-for="(section, index) of USER_ACTIONS">
          <div>
            <template v-for="action of section.children">
              <button
                class="dropdown-item d-flex justify-content-between align-items-center px-2"
                type="button"
                :disabled="action.disabled"
                v-on:click="($event: MouseEvent) => {
                    action.callback($event)
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
