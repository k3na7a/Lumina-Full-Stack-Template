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
      <span>
        <font-awesome-icon size="lg" :icon="['fas', 'ellipsis-vertical']" />
      </span>
    </template>
    <template v-slot:menu="{ close }">
      <div
        class="dropdown-menu dropdown-menu-dark p-2 border-0"
        v-on:click="($event: MouseEvent) => $event.stopPropagation()"
      >
        <template v-for="(nav, index) of props.navigation_list">
          <h3 class="dropdown-header p-0 my-1 px-2">{{ $t(nav.title) }}</h3>
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
              <hr class="dropdown-divider mx-1 my-0" />
            </div>
          </template>
        </template>
      </div>
    </template>
  </DropdownComponent>
</template>
