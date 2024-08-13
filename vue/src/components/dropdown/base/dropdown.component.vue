<script setup lang="ts">
import { ref } from 'vue'

import * as bootstrap from 'bootstrap'

const dropdownRef = ref<InstanceType<typeof HTMLElement>>()

type PropType = {
  dropdownAlign?: 'end' | ''
}

const props = defineProps<PropType>()

const closeDropdown = (): void => {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.hide()
}
</script>

<template>
  <div class="dropdown d-flex align-items-center" ref="dropdownRef">
    <button class="btn btn-dark btn-icon px-0" type="button" data-bs-toggle="dropdown">
      <slot name="button"></slot>
    </button>
    <div
      :class="{ 'dropdown-menu-end': props.dropdownAlign == 'end' }"
      class="dropdown-menu dropdown-menu-dark p-2 border-0"
      v-on:click="($event: MouseEvent) => $event.stopPropagation()"
    >
      <slot name="menu" :close="closeDropdown"></slot>
    </div>
  </div>
</template>
