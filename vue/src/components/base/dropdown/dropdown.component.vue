<script setup lang="ts">
import { ref } from 'vue'

import * as bootstrap from 'bootstrap'

const dropdownRef = ref<InstanceType<typeof HTMLElement>>()

const props = defineProps<{
  'auto-close'?: {
    type: boolean | 'inside' | 'outside'
    default: true
  }
}>()

const closeDropdown = (): void => {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.hide()
}
</script>

<template>
  <div id="dropdown" class="dropdown d-flex align-items-center" ref="dropdownRef">
    <button
      id="button"
      class="btn btn-link link-light p-2 rounded-0"
      type="button"
      data-bs-toggle="dropdown"
      :data-bs-auto-close="props['auto-close']"
    >
      <slot name="button"></slot>
    </button>
    <div class="dropdown-menu dropdown-menu-dark p-0" @click="($event: MouseEvent) => $event.stopPropagation()">
      <slot name="menu" :close="closeDropdown"></slot>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/sass/utils/utils';

#dropdown {
  & .dropdown-menu {
    font-size: 12px;
    border-radius: 0px;
    background-color: $backgroundLight;
    box-shadow: $boxShadow;
    width: max-content;

    & .dropdown-header {
      font-size: 12px;
    }

    & .dropdown-item:hover,
    .dropdown-item:focus {
      background-color: rgba(255, 255, 255, 0.05);
    }

    & .dropdown-item.active {
      background-color: rgba(255, 255, 255, 0.15);
    }
  }

  & #button {
    opacity: 0.85;
  }

  & #button:hover {
    opacity: 1;
  }
}
</style>
