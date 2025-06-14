<script setup lang="ts" generic="T">
import { ref, toRef, watch } from 'vue'
import * as bootstrap from 'bootstrap'
import { useField } from 'vee-validate'

import { deepEqual } from '@/library/utilities/object.util'

const props = defineProps<{
  name: string
  value?: T
  options: Array<T>
  disabled?: boolean
}>()

const emit = defineEmits<{ update: [value: T | undefined] }>()

const name = toRef(props, 'name')
const options = toRef(props, 'options')

const { value, errorMessage, meta } = useField<T | undefined>(name.value, undefined, { initialValue: props.value })

const isSyncing = ref<boolean>(false)
const dropdownRef = ref<InstanceType<typeof HTMLElement>>()

const stopClick = (e: MouseEvent): void => e.stopPropagation()

const closeDropdown = (): void => {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.hide()
}

function toggleDropdown(): void {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.toggle()
}

watch(
  () => props.value,
  (val: T | undefined) => {
    if (!deepEqual(val, value.value)) {
      isSyncing.value = true
      value.value = val
    }
  }
)

watch(value, (newVal: T | undefined) => {
  if (isSyncing.value) {
    isSyncing.value = false
    return
  }

  emit('update', newVal)
  closeDropdown()
})
</script>

<template>
  <div
    class="dropdown select border-0"
    :class="{ 'has-error': !!errorMessage && meta.touched, disabled: props.disabled }"
    ref="dropdownRef"
    v-click-outside="closeDropdown"
  >
    <button
      type="button"
      class="select-btn bg-alt text-light w-100 d-flex align-items-stretch"
      @click="toggleDropdown"
      :disabled="props.disabled"
    >
      <div class="d-flex flex-grow-1 text-start px-2 align-items-center overflow-hidden">
        <span v-if="value" class="text-truncate"><slot name="option" :option="value"></slot></span>
        <span v-else class="text-grey text-truncate">select an option...</span>
      </div>
      <div class="d-flex align-items-center px-2">
        <font-awesome-icon :icon="['fas', 'angle-down']" />
      </div>
    </button>
    <ul @click="stopClick" class="dropdown-menu mt-0 w-100 text-light p-0" style="min-width: 100%">
      <li v-for="(option, index) of options" :key="`option-${index}`">
        <button
          class="dropdown-item d-flex justify-content-between align-items-center px-2"
          :class="{ active: deepEqual(value, option) }"
          :disabled="deepEqual(value, option)"
          @click="value = option"
          type="button"
        >
          <span class="text-truncate pe-2">
            <slot name="option" :option="option"></slot>
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

.select {
  .select-btn {
    outline: none;
    border: 0.1rem $muted solid;
    height: 3rem;

    transition: all 0.15s ease-in-out;

    &:disabled {
      opacity: $disabled-opacity;
      color: $muted !important;
    }
  }

  .dropdown-menu {
    border: 0.1rem $muted solid;

    button {
      margin-bottom: 0px !important;
      outline: none;
    }
  }

  &:hover {
    .select-btn {
      box-shadow: 0 0 0 0.1rem $muted;
    }
  }

  &.has-error {
    .select-btn {
      border-color: $danger !important;
    }

    &:hover {
      .select-btn {
        box-shadow: 0 0 0 0.1rem $danger;
      }
    }
  }

  &:focus-within {
    .select-btn {
      border-color: $primary !important;
      box-shadow: 0 0 0 0.1rem $primary !important;
    }
  }

  &.disabled {
    pointer-events: none;
  }
}
</style>
