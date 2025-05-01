<!--ErrorBoundary.vue-->
<script setup lang="ts">
import { computed, onErrorCaptured, ref } from 'vue'

// create an reactive container to store the potential error
const error = ref()

// using Vue's build in lifecycle hook
// listen for errors from components passed to the default slot
onErrorCaptured((err) => {
  // set the reactive error container to the thrown error
  error.value = err

  // return false to prevent error from bubbling further
  // (this is optional, if you have a top level error reporter catching errors
  // you probably don't want to do this.
  // Alternatively you could report your errors in the boundary and prevent bubble
  return false
})

// create a way to clear the error
function clearError() {
  error.value = null
}

// provide the error and the clear error function to the slot
// for use in consuming component to display messaging
// and clear the error
const slotProps = computed(() => {
  if (!error.value) return {}
  return { error, clearError }
})

// if there's an error show the error slot, otherwise show the default slot
const slotName = computed(() => (error.value ? 'error' : 'default'))
</script>
<template>
  <slot :name="slotName" v-bind="slotProps"></slot>
</template>
