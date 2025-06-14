<script setup lang="ts">
import { ref, toRef, watch } from 'vue'
import { useField } from 'vee-validate'
import { deepEqual } from '@/library/utilities/object.util'

const props = defineProps<{
  name: string
  rows: number
  disabled?: boolean
  value?: string
  placeholder?: string
  label?: string
}>()

const name = toRef(props, 'name')
const isSyncing = ref<boolean>(false)

const { value, errorMessage, handleBlur, handleChange } = useField<string | undefined>(name.value, undefined, {
  initialValue: props.value
})

const emit = defineEmits<{ update: [value: string | undefined] }>()
watch(value, (newVal: string | undefined) => {
  emit('update', newVal)
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
    <textarea
      class="w-100 border-radius bg-alt px-2 py-1"
      :disabled="props.disabled"
      :name
      :value
      :placeholder="props.placeholder"
      :rows="props.rows"
      @input="handleChange"
      @blur="handleBlur"
    ></textarea>
  </div>
</template>

<style lang="scss" scoped>
@import '@/library/sass/variables/index';

.text-input {
  &.has-error textarea {
    border-color: $danger;
  }

  &.has-error textarea:hover {
    box-shadow: 0 0 0 0.1rem $danger;
  }

  &.success textarea {
    border-color: $success;
  }

  &.success textarea:hover {
    box-shadow: 0 0 0 0.1rem $success;
  }

  textarea:hover {
    box-shadow: 0 0 0 0.1rem $muted;
  }

  textarea:focus {
    border-color: $primary !important;
    box-shadow: 0 0 0 0.1rem $primary !important;
  }

  textarea {
    outline: none;
    border: 0.1rem $muted solid;
    transition: all 0.15s ease-in-out;
    resize: none;
  }

  textarea:disabled {
    pointer-events: none;
    border-color: grey;
    opacity: 75%;
  }
}
</style>
