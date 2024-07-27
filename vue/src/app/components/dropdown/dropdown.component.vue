<script setup lang="ts">
import { ref } from 'vue'

import * as bootstrap from 'bootstrap'

const dropdownRef = ref<InstanceType<typeof HTMLElement>>()

const closeDropdown = (): void => {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.hide()
}
</script>

<template>
  <div id="dropdown" class="dropdown d-flex align-items-center" ref="dropdownRef">
    <button id="button" class="btn btn-dark btn-icon border-0 px-0" type="button" data-bs-toggle="dropdown">
      <slot name="button"></slot>
    </button>
    <slot name="menu" :close="closeDropdown"></slot>
  </div>
</template>

<style lang="scss">
@import '@/app/sass/utils/utils';

#dropdown {
  & .dropdown-menu {
    border-radius: $border-radius;
    background-color: $backgroundAlt;
    box-shadow: $boxShadow;
    width: max-content;
    min-width: 200px;
    max-height: 600px;

    overflow-y: auto;

    & .dropdown-item:hover,
    .dropdown-item:focus {
      background-color: rgba(255, 255, 255, 0.05);
    }

    & .dropdown-item.active {
      background-color: rgba(255, 255, 255, 0.15);
    }

    button:not(:last-child) {
      margin-bottom: 4px;
    }
    h3 {
      font-size: 14px;
      font-weight: 600;
      color: $muted;
    }
    button {
      font-size: 12px !important;
      font-weight: 300 !important;
      border-radius: $border-radius;
    }
    hr {
      background-color: $muted;
      opacity: 0.15;
    }
  }

  & #button {
    opacity: 0.85;
  }

  & #button:hover {
    opacity: 1;
  }

  ::-webkit-scrollbar-track {
    border-radius: $border-radius;
  }
}
</style>
