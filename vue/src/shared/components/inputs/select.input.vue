<script setup lang="ts" generic="T">
import { deepEqual } from '@/../../library/utilities/object.util'
import { proptype, useSelectInput } from './composables/select-input.composable'

const props = defineProps<proptype<T>>()
const emit = defineEmits<{ update: [value: T | undefined] }>()

const {
  value,
  meta,
  activeIndex,
  errorMessage,
  dropdownRef,
  setOptionRef,
  closeDropdown,
  openDropdown,
  onFocusOut,
  onKeydownResolver,
  stopClick,
  selectItem
} = useSelectInput<T>(props, emit)
</script>

<template>
  <div
    class="dropdown th-select border-0"
    :class="{ 'has-error': !!errorMessage && meta.touched, disabled: props.disabled }"
    ref="dropdownRef"
    v-click-outside="closeDropdown"
  >
    <button
      type="button"
      :disabled="props.disabled"
      class="select-btn bg-alt text-light w-100 d-flex align-items-stretch"
      @keydown="onKeydownResolver"
      @focusout="onFocusOut"
      @focus="openDropdown"
      @blur="closeDropdown"
      @click="openDropdown"
    >
      <div v-if="props.icon" class="d-flex align-items-center ps-2 text-light">
        <font-awesome-icon :icon="props.icon" />
      </div>
      <div class="d-flex flex-grow-1 text-start align-items-center ps-2 overflow-hidden">
        <span v-if="value" class="text-truncate"><slot name="option" :option="value"></slot></span>
        <span v-else class="text-grey text-truncate">{{ $t('actions.select-option') }}</span>
      </div>
      <div class="d-flex align-items-center px-2">
        <font-awesome-icon :icon="['fas', 'angle-down']" />
      </div>
    </button>
    <ul
      @click="stopClick"
      role="listbox"
      class="dropdown-menu mt-0 w-100 text-light p-0"
      style="min-width: 100%"
      :aria-activedescendant="`option-${activeIndex}`"
    >
      <li
        v-for="(option, index) of props.options"
        :key="`option-${index}`"
        role="option"
        :data-index="index"
        :aria-selected="index === activeIndex"
      >
        <button
          tabindex="-1"
          ref="setOptionRef"
          class="dropdown-item d-flex justify-content-between align-items-center px-2"
          :class="{ active: deepEqual(value, option), highlight: index === activeIndex }"
          :disabled="deepEqual(value, option)"
          @mousedown.prevent="selectItem(option)"
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
