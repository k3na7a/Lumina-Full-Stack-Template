<script setup lang="ts">
type proptype = {
  title: string
  subtitle: string
}

const { title, subtitle } = defineProps<proptype>()
</script>

<template>
  <div class="content-view-administration d-flex flex-column gap-2">
    <div class="d-flex flex-column">
      <h4 class="text-light fw-semibold display-font">{{ $t(title) }}</h4>
      <p class="text-muted fw-normal">{{ $t(subtitle) }}</p>
    </div>
    <div class="card d-flex flex-column p-3">
      <slot name="table"></slot>
    </div>
  </div>
</template>
