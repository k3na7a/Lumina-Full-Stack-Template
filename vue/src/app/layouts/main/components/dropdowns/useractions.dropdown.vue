<script setup lang="ts">
import DropdownComponent from '@/app/components/dropdown/dropdown.component.vue'

import { useRouter } from 'vue-router'

import { UserDto } from '@/library/dto/user.dto'
import { ROUTE_NAMES } from '@/app/router/routes'

type PropType = {
  authenticatedUser: UserDto | undefined
  signout: (event: MouseEvent) => void
}

const props = defineProps<PropType>()
const router = useRouter()

type actions = {
  title: string
  icon: string[]
  callback: (event: MouseEvent) => void
}[][]

const USER_ACTIONS: actions = [
  [{ title: 'general.settings', icon: ['fas', 'gear'], callback: () => router.push({ name: ROUTE_NAMES.SETTINGS }) }],
  [{ title: 'actions.log-out', icon: ['fas', 'right-from-bracket'], callback: props.signout }]
]
</script>

<template>
  <DropdownComponent dropdown-align="end" :autoclose="'inside'">
    <template v-slot:button>
      <font-awesome-icon :icon="['fas', 'user']" />
    </template>
    <template v-slot:menu="{ close }">
      <div class="px-2 my-1">
        <h5 class="d-block text-light fw-bolder text-nowrap">
          {{ props.authenticatedUser?.getFullName() }}
        </h5>
        <small class="text-muted d-block">{{ props.authenticatedUser?.email }}</small>
      </div>
      <div class="pt-1">
        <template v-for="(section, index) of USER_ACTIONS">
          <div>
            <template v-for="action of section">
              <button
                class="dropdown-item d-flex justify-content-between align-items-center px-2"
                type="button"
                v-on:click="($event: MouseEvent) => {
                    action.callback($event)
                    close()
                }"
              >
                <span>{{ $t(action.title) }}</span>
                <span style="width: 15px" class="text-center"><font-awesome-icon :icon="action.icon" /></span>
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
