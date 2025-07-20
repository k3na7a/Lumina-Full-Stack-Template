<script setup lang="ts">
import { UserDto } from '@/core/apis/localhost/administration/users/dto/user.dto'

import DropdownComponent from '@/shared/components/dropdown/base/dropdown.component.vue'
import { more_navigation } from '@/shared/components/dropdown/types/more-navigation.type'
import { actions } from '../../composables/main.composable'

const { authenticatedUser } = defineProps<{
  authenticatedUser: UserDto
  userActions: actions[]
  userNavigation: more_navigation
}>()
</script>

<template>
  <DropdownComponent v-if="authenticatedUser" dropdown-align="end" :image="authenticatedUser.profile.avatar">
    <template #menu="{ close }">
      <div class="d-flex flex-column gap-1">
        <div class="px-2 py-1">
          <div class="d-flex align-items-center gap-2">
            <div class="d-flex flex-column flex-grow-1">
              <h5 class="text-light fw-bolder display-font">{{ authenticatedUser?.getFullName() }}</h5>
              <small class="text-light-alt d-block text-truncate fst-italic">{{ authenticatedUser?.email }}</small>
            </div>
          </div>
        </div>

        <template v-for="(nav, index) of userNavigation">
          <hr v-if="index" class="dropdown-divider mx-1 my-0 bg-secondary opacity-50" />

          <div class="d-flex flex-column gap-1">
            <h5 v-if="nav?.title" class="p-0 py-1 px-2 text-muted fw-bolder text-nowrap display-font">
              {{ $t(nav.title) }}
            </h5>
            <div class="d-flex flex-column gap-1">
              <template v-for="navigation_item of nav.children" :key="navigation_item.title">
                <RouterLink
                  @click="close"
                  :to="{ name: navigation_item.redirect }"
                  class="dropdown-item d-flex justify-content-between align-items-center px-2 m-0 fw-normal"
                >
                  <span class="text-truncate">{{ $t(navigation_item.title) }}</span>
                  <span v-if="navigation_item?.icon" style="width: 1.5rem" class="text-center">
                    <font-awesome-icon :icon="navigation_item.icon" />
                  </span>
                </RouterLink>
              </template>
            </div>
          </div>
        </template>

        <hr class="dropdown-divider mx-1 my-0 bg-secondary opacity-50" />

        <div class="d-flex flex-column gap-1">
          <template v-for="action of userActions" :key="action.title">
            <button
              class="dropdown-item d-flex justify-content-between align-items-center px-2 m-0"
              :class="{ [`text-${action.theme}`]: action.theme }"
              type="button"
              :disabled="action.disabled"
              @click="(_: MouseEvent) => {
                    action.callback && action.callback()
                    close()
                }"
            >
              <span class="text-truncate pe-2">{{ $t(action.title) }}</span>
              <span style="width: 1.5rem" class="text-center"><font-awesome-icon :icon="action.icon" /></span>
            </button>
          </template>
        </div>
      </div>
    </template>
  </DropdownComponent>
</template>
