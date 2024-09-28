<script setup lang="ts" generic="T">
import { onMounted, Ref, ref, toRef, watch } from 'vue'
import * as bootstrap from 'bootstrap'
import { useField } from 'vee-validate'

import { deepEqual } from '@/library/helpers/object.util'

const emit = defineEmits<{ update: [value: T[] | undefined] }>()
const props = defineProps<{
  name: string
  filterKey: string
  default?: T
  options: Array<T>
}>()

const name = toRef(props, 'name')

const options = ref<T[]>(props.options) as Ref<T[]>
const filter = ref<string>('')

const dropdownRef = ref<InstanceType<typeof HTMLElement>>()
const inputRef = ref<InstanceType<typeof HTMLElement>>()

const { value, errorMessage, meta } = useField<T[] | undefined>(name.value, undefined, { initialValue: [] })

function closeDropdown(): void {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.hide()
}

function openDropdown(): void {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.show()
}

function giveFocus(event: Event): void {
  event.preventDefault()
  const input = inputRef.value as HTMLInputElement
  input.focus()
}

function render(option: any): boolean {
  const key = option[props.filterKey] as string
  return key.toLowerCase().includes(filter.value.toLowerCase())
}

function removeValue(event: MouseEvent): void {
  event.preventDefault()
  closeDropdown()

  const target = event.target as HTMLElement
  target.focus()

  if (value.value) value.value = value.value.filter((_, idx) => idx != parseInt(target.id))
}

function getFilterQuery(option: any): void {
  return option[props.filterKey]
}

watch(value, (newVal: T[] | undefined) => {
  emit('update', newVal)
})

onMounted(() => {
  emit('update', value.value)
})
</script>

<template>
  <div class="custom-input">
    <div class="dropdown select border-0" :class="{ 'has-error': !!errorMessage && meta.touched }" ref="dropdownRef">
      <div class="multi-select d-flex align-items-stretch bg-alt">
        <div
          @pointerdown="(e) => e.preventDefault()"
          v-if="value?.length"
          :style="{ display: 'inline-flex' }"
          class="flex-shrink-1 align-items-center flex-wrap p-1 gap-1 overflow-hidden"
        >
          <div
            v-for="(selection, idx) of value"
            class="px-1 d-flex align-items-stretch gap-1 overflow-hidden"
            :key="`${idx}:${JSON.stringify(selection)}`"
          >
            <button
              :id="`${idx}`"
              v-tooltip="{ text: getFilterQuery(selection), position: 'bottom', trigger: 'hover' }"
              @click="removeValue"
              class="option-button btn btn-link text-decoration-underline fw-normal text-truncate"
            >
              <slot name="option" :option="selection"></slot>
            </button>
          </div>
        </div>

        <input
          ref="inputRef"
          v-model="filter"
          type="text"
          class="d-flex flex-grow-1 mb-0 p-1 px-2 text-truncate"
          :placeholder="$t('actions.search.placeholder')"
          autocomplete="off"
          bs-data-toggle="dropdown"
          @click="giveFocus"
          @focus="openDropdown"
          @focusout="closeDropdown"
        />

        <div class="d-flex flex-shrink-1 align-items-center px-2" @pointerdown="giveFocus">
          <font-awesome-icon size="sm" :icon="['fas', 'list-check']" />
        </div>
      </div>

      <div
        class="dropdown-menu mt-0 w-100 text-light p-0"
        style="min-width: 100%"
        @pointerdown="(e) => e.preventDefault()"
      >
        <template v-if="options.filter((value) => render(value)).length">
          <template v-for="option of options.filter((value) => render(value))" :key="JSON.stringify(option)">
            <button
              class="dropdown-item d-flex justify-content-between align-items-center px-2"
              :class="{ active: value?.some((e) => deepEqual(e, option)) }"
              :disabled="value?.some((e) => deepEqual(e, option))"
              v-on:click="value?.push(option)"
              type="button"
            >
              <span class="text-truncate pe-2">
                <slot name="option" :option="option"></slot>
              </span>
            </button>
          </template>
        </template>
        <template v-else>
          <div class="d-flex justify-content-between align-items-center p-1 px-2">
            <p class="text-grey">No results found</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';
.multi-select {
  border: 0.1rem $muted solid;
  transition: all 0.15s ease-in-out;

  .option-button {
    max-width: 12.5rem;
  }

  input {
    background-color: transparent;
    outline: none;
    border: none;
    min-width: 10rem;
  }

  &:hover {
    box-shadow: 0 0 0 0.1rem $muted;
  }

  &:has(:focus) {
    border: 0.1rem $primary solid;
    box-shadow: 0 0 0 0.1rem $primary !important;
  }
}
/* background-color: color-mix(in srgb, $primary 50%, transparent); */
</style>
