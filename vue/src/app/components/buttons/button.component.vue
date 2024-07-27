<script setup lang="ts">
type proptype = {
  onClick?: (props: unknown) => unknown
  btn?: 'link' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
  type?: 'button' | 'submit' | 'reset' | undefined
  disabled?: boolean
}
const props = defineProps<proptype>()
</script>

<template>
  <button
    v-on:click="onClick"
    class="btn"
    :class="{ 'btn-link': props.btn == 'link' }"
    type="button"
    :disabled="props.disabled"
  >
    <div class="flex flex-column align-items-center">
      <slot></slot>
    </div>
  </button>
</template>
