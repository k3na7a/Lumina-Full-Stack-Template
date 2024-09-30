<script setup lang="ts">
import DropdownComponent from '@/app/components/dropdown/dropdown.component.vue'

import { MORE_NAVIGATION } from '@/app/layouts/main-navigation/schema/more-navigation.schema'
</script>

<template>
  <DropdownComponent>
    <template #button>
      <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
    </template>
    <template #menu="{ close }">
      <div class="d-flex flex-column gap-2">
        <template v-for="(nav, index) of MORE_NAVIGATION">
          <hr v-if="index" class="dropdown-divider mx-1 my-0 bg-secondary opacity-50" />

          <div class="d-flex flex-column gap-1">
            <h5 class="p-0 py-1 px-2 text-muted fw-bolder text-nowrap">{{ $t(nav.title) }}</h5>
            <div class="d-flex flex-column gap-1">
              <template v-for="navigation_item of nav.children" :key="navigation_item.title">
                <button
                  class="dropdown-item d-flex justify-content-between align-items-center px-2 m-0"
                  type="button"
                  @click="close"
                >
                  <span class="text-truncate">{{ $t(navigation_item.title) }}</span>
                </button>
              </template>
            </div>
          </div>
        </template>
      </div>
    </template>
  </DropdownComponent>
</template>
