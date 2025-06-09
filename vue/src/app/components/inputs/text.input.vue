<script setup lang="ts">
import { InputTypeHTMLAttribute, ref, toRef, watch } from 'vue'
import { useField } from 'vee-validate'

import { HTMLAutoComplete } from '@/library/data/types/HTMLautocomplete.type'
import { deepEqual } from '@/library/utils/object.util'

const emit = defineEmits<{ update: [value: string | undefined] }>()

const props = defineProps<{
  name: string
  disabled?: boolean
  type: InputTypeHTMLAttribute
  value?: string
  autocomplete?: HTMLAutoComplete
  placeholder?: string
  label?: string
}>()

const name = toRef(props, 'name')
const isSyncing = ref<boolean>(false)

const { value, errorMessage, handleBlur, handleChange } = useField<string | undefined>(name.value, undefined, {
  initialValue: props.value
})

watch(
  () => props.value,
  (val: string | undefined) => {
    if (!deepEqual(val, value.value)) {
      isSyncing.value = true
      value.value = val
    }
  }
)

watch(value, (newVal: string | undefined) => {
  if (isSyncing.value) {
    isSyncing.value = false
    return
  }

  emit('update', newVal)
})
</script>

<template>
  <div class="d-flex flex-column gap-1 text-input w-100" :class="{ 'has-error': !!errorMessage }">
    <h6 class="d-block fw-semibold" v-if="label" :for="name">{{ $t(label) }}</h6>
    <input
      class="w-100 border-radius bg-alt px-2 py-1"
      :disabled="props.disabled"
      :name
      :type
      :value
      :placeholder="props.placeholder"
      :autocomplete="props.autocomplete || 'off'"
      @input="handleChange"
      @blur="handleBlur"
    />
  </div>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

.text-input {
  &.has-error input {
    border-color: $danger;
  }

  &.has-error input:hover {
    box-shadow: 0 0 0 0.1rem $danger;
  }

  &.success input {
    border-color: $success;
  }

  &.success input:hover {
    box-shadow: 0 0 0 0.1rem $success;
  }

  input:hover {
    box-shadow: 0 0 0 0.1rem $muted;
  }

  input:focus {
    border-color: $primary !important;
    box-shadow: 0 0 0 0.1rem $primary !important;
  }

  input {
    outline: none;
    border: 0.1rem $muted solid;
    height: 3rem;

    transition: all 0.15s ease-in-out;
  }

  input:disabled {
    pointer-events: none;
    border-color: grey;
    opacity: 75%;
  }
}
</style>
