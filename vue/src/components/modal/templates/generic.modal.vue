<script setup lang="ts">
const props = defineProps<{ text: string }>()
</script>

<template>
  <div>{{ props.text }}</div>
</template>
