<script setup lang="ts">
import { useDropdown } from '../composables/dropdown.composable'
import { useSlots } from 'vue'

const slots = useSlots()

const { dropdownRef, closeDropdown, toggleDropdown } = useDropdown()
const { dropdownAlign, image, disabled } = defineProps<{
  dropdownAlign?: 'end' | 'start'
  disabled?: boolean
  image?: string
}>()
</script>

<template>
  <div v-click-outside="closeDropdown">
    <div v-if="slots.button" class="dropdown d-flex align-items-center" ref="dropdownRef">
      <button :disabled="disabled" class="btn btn-dark btn-icon px-0" type="button" @click="toggleDropdown">
        <div class="d-flex flex-column align-items-center">
          <slot name="button"></slot>
        </div>
      </button>
    </div>

    <div v-if="image" class="dropdown d-flex align-items-center" ref="dropdownRef">
      <img class="dropdown-image hover-cursor-pointer" :src="image" @click="toggleDropdown" />
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
