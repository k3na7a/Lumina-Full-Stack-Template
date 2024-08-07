<script setup lang="ts">
import DropdownComponent from '@/app/components/dropdown/dropdown.component.vue'

type PropType = {
  navigation_list: Array<{ title: string; children: Array<{ title: string; redirect: string }> }>
}

const props = defineProps<PropType>()
</script>

<template>
  <DropdownComponent :autoclose="'inside'">
    <template v-slot:button>
      <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
    </template>
    <template v-slot:menu="{ close }">
      <template v-for="(nav, index) of props.navigation_list">
        <h5 class="p-0 my-1 px-2 text-muted fw-bolder text-nowrap">{{ $t(nav.title) }}</h5>
        <div class="pt-1">
          <template v-for="navigation_item of nav.children">
            <button
              class="dropdown-item d-flex justify-content-between align-items-center px-2"
              type="button"
              v-on:click="close"
            >
              <span>{{ $t(navigation_item.title) }}</span>
            </button>
          </template>
        </div>
        <template v-if="index < props.navigation_list.length - 1">
          <div class="py-2">
            <hr class="dropdown-divider mx-1 my-0 bg-secondary opacity-50" />
          </div>
        </template>
      </template>
    </template>
  </DropdownComponent>
</template>
