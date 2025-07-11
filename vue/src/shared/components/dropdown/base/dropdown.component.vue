<script setup lang="ts">
import { useDropdown } from '../composables/dropdown.composable'

const { dropdownRef, closeDropdown, toggleDropdown } = useDropdown()
const { dropdownAlign } = defineProps<{ dropdownAlign?: 'end' | 'start'; disabled?: boolean }>()
</script>

<template>
  <div v-click-outside="closeDropdown">
    <div class="dropdown d-flex align-items-center" ref="dropdownRef">
      <button :disabled="disabled" class="btn btn-dark btn-icon px-0" type="button" @click="toggleDropdown">
        <div class="d-flex flex-column align-items-center">
          <slot name="button"></slot>
        </div>
      </button>
    </div>
    <div
      :class="{ 'dropdown-menu-end': dropdownAlign === 'end' }"
      class="dropdown-menu dropdown-menu-dark p-2"
      @click.stop
    >
      <slot name="menu" :close="closeDropdown"></slot>
    </div>
  </div>
</template>
