<script setup lang="ts">
const props = defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <div class="content-view-administration d-flex flex-column gap-2">
    <div class="d-flex flex-column">
      <h4 class="text-light fw-semibold">{{ $t(props.title) }}</h4>
      <p class="text-muted fw-normal">{{ $t(props.subtitle) }}</p>
    </div>
    <div class="card d-flex flex-column p-3">
      <div class="d-flex flex-column gap-2">
        <slot name="table"></slot>
      </div>
    </div>
  </div>
</template>
