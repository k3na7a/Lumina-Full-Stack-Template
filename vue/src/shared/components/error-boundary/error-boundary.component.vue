<script setup lang="ts">
import { computed, onErrorCaptured, ref } from 'vue'

const error = ref<Error>()

onErrorCaptured((err) => {
  error.value = err
  return false
})

function clearError() {
  error.value = undefined
}

const slotProps = computed(() => {
  if (!error.value) return {}
  return { error: error.value, clearError }
})

const slotName = computed(() => (error.value ? 'error' : 'default'))
</script>

<template>
  <slot :name="slotName" v-bind="slotProps"></slot>
</template>
