<script setup lang="ts">
import { toRef } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
  value: {
    type: String,
    default: undefined
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const name = toRef(props, 'name')

const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta
} = useField(name, undefined, { initialValue: props.value })
</script>

<template>
  <div
    class="TextInput"
    :class="{
      'has-error': !!errorMessage,
      success: meta.valid
    }"
  >
    <label v-if="label" :for="name">{{ $t(label) }}</label>
    <input
      :name="name"
      :id="name"
      :type="type"
      :value="inputValue"
      :placeholder
      v-on:input="handleChange"
      v-on:blur="handleBlur"
    />
  </div>
</template>

<style lang="scss">
@import '@/app/sass/utils/utils';

.TextInput {
  width: 100%;
  font-size: 12px;

  &.has-error input {
    border-color: $danger;
  }

  &.has-error input:hover {
    box-shadow: 0 0 0 1px $danger;
  }

  &.success input {
    border-color: $success;
  }

  &.success input:hover {
    box-shadow: 0 0 0 1px $success;
  }

  input:hover {
    box-shadow: 0 0 0 1px $muted;
  }

  input:focus {
    border-color: $primary !important;
    box-shadow: 0 0 0 1px $primary !important;
  }

  label {
    display: block;
    margin-bottom: 4px;
    width: 100%;
    font-size: 13px;
    font-weight: 700;
  }

  input {
    border-radius: 5px;
    padding: 4px 8px;
    outline: none;
    background-color: $backgroundAlt;
    border: 1px $muted solid;
    border-radius: $border-radius;
    width: 100%;
  }
}
</style>
