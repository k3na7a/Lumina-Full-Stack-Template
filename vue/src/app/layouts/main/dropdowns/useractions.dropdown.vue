<script setup lang="ts">
import DropdownComponent from '@/app/components/dropdown/dropdown.component.vue'

import { UserDto } from '@/library/dto/user.dto'

type PropType = {
  authenticatedUser: UserDto | undefined
  signout: (event: MouseEvent) => void
}

const props = defineProps<PropType>()

type actions = {
  title: string
  icon: string[]
  callback: (event: MouseEvent) => void
}[][]

const USER_ACTIONS: actions = [
  [
    { title: 'general.dashboard', icon: ['fas', 'chart-column'], callback: () => console.log('settings') },
    { title: 'general.settings', icon: ['fas', 'gear'], callback: () => console.log('settings') }
  ],
  [{ title: 'actions.log-out', icon: ['fas', 'right-from-bracket'], callback: props.signout }]
]
</script>

<template>
  <DropdownComponent :autoclose="'inside'">
    <template v-slot:button>
      <span>
        <font-awesome-icon size="lg" :icon="['fas', 'user']" />
      </span>
    </template>
    <template v-slot:menu="{ close }">
      <div
        id="user-dropdown"
        class="dropdown-menu dropdown-menu-dark dropdown-menu-end p-2 border-0"
        v-on:click="($event: MouseEvent) => $event.stopPropagation()"
      >
        <div class="px-2 my-1 d-flex flex-column">
          <span id="username"> {{ props.authenticatedUser?.getFullName() }} </span>
          <span id="email"> {{ props.authenticatedUser?.email }} </span>
        </div>
        <div class="py-2">
          <hr class="dropdown-divider mx-1 my-0" />
        </div>
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
                <span style="width: 12px" class="text-center"><font-awesome-icon :icon="action.icon" /></span>
              </button>
            </template>
          </div>

          <template v-if="index < USER_ACTIONS.length - 1">
            <div class="py-2">
              <hr class="dropdown-divider mx-1 my-0" />
            </div>
          </template>
        </template>
      </div>
    </template>
  </DropdownComponent>
</template>

<style lang="scss">
@import '@/app/sass/utils/utils';

#user-dropdown {
  #username {
    font-size: 13px;
    font-weight: 600;
  }

  #email {
    font-size: 10px;
    color: $muted;
  }
}
</style>
