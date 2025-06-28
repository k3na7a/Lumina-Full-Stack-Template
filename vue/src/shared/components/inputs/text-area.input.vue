<script setup lang="ts">
import { proptype, useTextAreaInput } from './composables/text-area-inpute.composable'

const emit = defineEmits<{ update: [value: string | undefined] }>()
const props = defineProps<proptype>()

const { name, value, errorMessage, handleBlur, handleChange } = useTextAreaInput(props, emit)
</script>

<template>
  <div class="d-flex flex-column gap-1 th-text-area-input w-100" :class="{ 'has-error': !!errorMessage }">
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
