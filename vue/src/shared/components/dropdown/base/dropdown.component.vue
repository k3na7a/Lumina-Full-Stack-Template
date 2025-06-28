<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as bootstrap from 'bootstrap'

const dropdownRef = ref<InstanceType<typeof HTMLElement>>()
const isOpen = ref(false)

const props = defineProps<{ dropdownAlign?: 'end' | 'start' }>()
let dropdownInstance: bootstrap.Dropdown | null = null

function closeDropdown(): void {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.hide()
}

function toggleDropdown(): void {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.toggle()
}

onMounted(() => {
  if (dropdownRef.value) {
    dropdownInstance = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value)

    dropdownRef.value.addEventListener('shown.bs.dropdown', () => {
      isOpen.value = true
    })
    dropdownRef.value.addEventListener('hidden.bs.dropdown', () => {
      isOpen.value = false
    })
  }
})

onBeforeUnmount(() => {
  if (dropdownRef.value) {
    dropdownRef.value.removeEventListener('shown.bs.dropdown', () => {})
    dropdownRef.value.removeEventListener('hidden.bs.dropdown', () => {})
  }
})
</script>

<template>
  <div v-click-outside="closeDropdown">
    <div class="dropdown d-flex align-items-center" ref="dropdownRef">
      <button class="btn btn-dark btn-icon px-0" type="button" @click="toggleDropdown">
        <div class="d-flex flex-column align-items-center">
          <slot name="button"></slot>
        </div>
      </button>
    </div>
    <div
      :class="{ 'dropdown-menu-end': props.dropdownAlign === 'end' }"
      class="dropdown-menu dropdown-menu-dark p-2"
      @click.stop
    >
      <slot name="menu" :close="closeDropdown"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/shared/sass/variables/index';
</style>
