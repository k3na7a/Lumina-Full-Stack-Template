<script setup lang="ts">
type props = { title: string }
const { title } = defineProps<props>()
</script>

<template>
  <div class="px-4 w-100">
    <div class="d-flex justify-content-center flex-nowrap align-items-center gap-2">
      <img id="logo" src="/vue.svg" style="width: 3rem" />

      <div style="overflow: hidden">
        <h4 class="text-light fw-bold display-font text-truncate">
          {{ title }}
        </h4>
      </div>
    </div>
  </div>
</template>
