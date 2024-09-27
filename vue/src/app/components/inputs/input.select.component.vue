<script setup lang="ts" generic="T">
import { onMounted, Ref, ref, toRef, watch } from 'vue'
import * as bootstrap from 'bootstrap'
import { useField } from 'vee-validate'

const props = defineProps<{
  name: string
  default?: T
  options: Array<T>
  disabled?: boolean
}>()

const options = ref<T[]>(props.options) as Ref<T[]>

const dropdownRef = ref<InstanceType<typeof HTMLElement>>()
const closeDropdown = (): void => {
  const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownRef.value || '')
  dropdown.hide()
}

const name = toRef(props, 'name')
const { value, errorMessage, meta } = useField<T | undefined>(name.value, undefined, { initialValue: props.default })

const emit = defineEmits<{ update: [value: T | undefined] }>()
watch(value, (newVal: T | undefined) => {
  emit('update', newVal)
  closeDropdown()
})

onMounted(() => {
  emit('update', value.value)
})

function deepEqual(x: any, y: any): boolean {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length && ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y
}
</script>

<template>
  <div class="custom-input">
    <div
      class="dropdown select border-0"
      :class="{ 'has-error': !!errorMessage && meta.touched, disabled: props.disabled }"
      ref="dropdownRef"
    >
      <button
        class="select-btn bg-alt text-light w-100 d-flex align-items-stretch"
        data-bs-toggle="dropdown"
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
      <div
        v-on:click="($event: MouseEvent) => $event.stopPropagation()"
        class="dropdown-menu mt-0 w-100 text-light p-0"
        style="min-width: 100%"
      >
        <button
          v-for="option of options"
          class="dropdown-item d-flex justify-content-between align-items-center px-2"
          :class="{ active: deepEqual(value, option) }"
          :disabled="deepEqual(value, option)"
          v-on:click="value = option"
          type="button"
        >
          <span class="text-truncate pe-2">
            <slot name="option" :option="option"></slot>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
