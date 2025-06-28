<script setup lang="ts">
import { proptype, useTextInput } from './composables/text-input.composable'

const props = defineProps<proptype>()
const emit = defineEmits<{ update: [value: string | undefined] }>()

const { name, value, handleBlur, handleChange, errorMessage } = useTextInput(props, emit)
</script>

<template>
  <div class="d-flex flex-column gap-1 th-text-input w-100" :class="{ 'has-error': !!errorMessage }">
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
