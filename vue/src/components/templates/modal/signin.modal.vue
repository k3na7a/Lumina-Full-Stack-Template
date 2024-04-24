<script setup lang="ts">
const props = defineProps<{
  title: string
  text: string
  close: () => void
}>()
</script>

<template>
  <div class="modal-header rounded-0 border-0 d-flex justify-content-between align-items-center">
    <span class="modal-title fw-bold fs-6">{{ props.title }}</span>
    <button type="button" class="btn btn-link link-light link-opacity-75-hover p-0" @click="props.close">
      <font-awesome-icon :icon="['fas', 'close']" />
    </button>
  </div>
  <div class="modal-body">
    <span>{{ props.text }}</span>
  </div>
</template>
