<script setup lang="ts">
const props = defineProps<{
  title: string
  // subtitle: string
}>()
</script>

<template>
  <div class="d-flex flex-column gap-2 p-3">
    <div class="d-flex flex-column">
      <h2 class="display-font fw-bold">{{ $t(props.title) }}</h2>
    </div>
    <div class="d-flex flex-column">
      <slot></slot>
    </div>
  </div>
</template>
