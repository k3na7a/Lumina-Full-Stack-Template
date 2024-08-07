<script setup lang="ts">
import { InputTypeHTMLAttribute, toRef } from 'vue'
import { useField } from 'vee-validate'

import { HTMLAutoComplete } from '@/library/types/autocomplete'

type PropType = {
  name: string
  type: InputTypeHTMLAttribute
  value?: string
  autocomplete?: HTMLAutoComplete
  placeholder?: string
  label?: string
}

const props = defineProps<PropType>()

const name = toRef(props, 'name')

const { value, errorMessage, handleBlur, handleChange, meta } = useField(name.value, undefined, {
  initialValue: props.value
})
</script>

<template>
  <div
    class="text-input w-100"
    :class="{
      'has-error': !!errorMessage,
      success: meta.valid && meta.dirty
    }"
  >
    <h6 class="mb-1 d-block fw-semibold" v-if="label" :for="name">{{ $t(label) }}</h6>
    <input
      class="w-100 border-radius bg-alt px-2 py-1"
      :name
      :type
      :value
      :placeholder="props.placeholder"
      :autocomplete="props.autocomplete || 'off'"
      v-on:input="handleChange"
      v-on:blur="handleBlur"
    />
  </div>
</template>
