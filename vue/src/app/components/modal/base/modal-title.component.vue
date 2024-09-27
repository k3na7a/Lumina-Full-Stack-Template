<script setup lang="ts">
type PropType = { title: string }
const props = defineProps<PropType>()
</script>

<template>
  <div class="pb-3 px-4 w-100">
    <div class="d-flex justify-content-center align-items-center">
      <div class="me-2">
        <img id="logo" src="/vue.svg" style="width: 3rem" />
      </div>
      <div style="overflow: hidden">
        <h4 class="text-light fw-bold display-font text-truncate">
          {{ $t(props.title) }}
        </h4>
      </div>
    </div>
  </div>
</template>
