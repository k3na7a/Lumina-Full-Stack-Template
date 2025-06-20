<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { second } from '@/shared/constants/time.constants'
import { deepEqual } from '@/core/utilities/object.util'

const props = defineProps<{ disabled?: boolean; value?: string }>()
const value = ref<string | undefined>(props.value)
const emit = defineEmits<{ update: [value: string | undefined]; submit: [value: string | undefined] }>()

const debouncedFn = useDebounceFn((val: string | undefined) => {
  emit('update', val || undefined)
}, 0.75 * second)

const inputRef = ref<InstanceType<typeof HTMLElement>>()
function giveFocus(event: PointerEvent): void {
  event.preventDefault()
  const input = inputRef.value as HTMLInputElement
  input.focus()
}

watch(
  () => props.value,
  (val) => {
    if (!deepEqual(val, value.value)) {
      value.value = val
    }
  }
)

watch(value, debouncedFn)
</script>

<template>
  <div class="search-input input-group flex-nowrap bg-alt d-flex align-items-stretch">
    <span class="input-group-text text-light" @pointerdown="giveFocus">
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
    </span>
    <input
      ref="inputRef"
      v-model="value"
      type="text"
      class="w-100 mb-0 p-1"
      name="search"
      :class="{ disabled }"
      :placeholder="$t('actions.search.placeholder')"
      :disabled="props.disabled"
      autocomplete="off"
    />
    <button :disabled="!value || disabled" class="text-light px-2" @pointerdown.prevent @click="value = undefined">
      <div class="d-flex align-items-center">
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </div>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import '@/shared/sass/variables/index';

.search-input.input-group {
  background-color: $backgroundAlt;
  border: 0.1rem $muted solid;
  height: 3rem;
  transition: all 0.15s ease-in-out;

  &:has(.disabled) {
    pointer-events: none;
    opacity: $disabled-opacity;
  }

  button {
    outline: none;

    &:focus {
      color: $primary !important;
    }
  }

  :disabled {
    color: $muted !important;
    opacity: 0.7;
  }

  &:hover {
    box-shadow: 0 0 0 0.1rem $muted;
  }

  &:focus-within {
    border-color: $primary !important;
    box-shadow: 0 0 0 0.1rem $primary !important;
  }

  & > * {
    border: none;
    background-color: transparent;
  }

  input {
    outline: none;
    min-width: none !important;
  }
}
</style>
