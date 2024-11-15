<script setup lang="ts">
import { ref } from 'vue'
import * as bootstrap from 'bootstrap'

const dropdownRef = ref<InstanceType<typeof HTMLElement>>()
const props = defineProps<{ dropdownAlign?: 'end' | 'start' }>()

function closeDropdown(): void {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.hide()
}

function toggleDropdown(): void {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.toggle()
}
</script>

<template>
  <div class="dropdown d-flex align-items-center" ref="dropdownRef" v-click-outside="closeDropdown">
    <button class="btn btn-dark btn-icon px-0" type="button" @click="toggleDropdown">
      <div class="d-flex flex-column align-items-center">
        <slot name="button"></slot>
      </div>
    </button>
    <div
      :class="{ 'dropdown-menu-end': props.dropdownAlign == 'end' }"
      class="dropdown-menu dropdown-menu-dark p-2"
      @click="($event: MouseEvent) => $event.stopPropagation()"
    >
      <slot name="menu" :close="closeDropdown"></slot>
    </div>
  </div>
</template>
