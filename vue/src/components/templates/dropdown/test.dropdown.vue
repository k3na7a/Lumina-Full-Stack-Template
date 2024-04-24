<script setup lang="ts">
const props = defineProps<{
  close: () => void
}>()
</script>

<template>
  <div class="py-2">
    <button class="dropdown-item active" type="button" @click="props.close">Action</button>
    <button class="dropdown-item" type="button">Another action</button>
    <button class="dropdown-item" type="button">Something else here</button>
  </div>
</template>
