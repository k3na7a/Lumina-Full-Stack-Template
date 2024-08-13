<script setup lang="ts">
type PropType = { title: string }
const props = defineProps<PropType>()
</script>

<template>
  <div class="d-flex justify-content-center pb-3">
    <div class="d-flex align-items-center">
      <div class="flex-shrink-0 me-2">
        <img id="logo" src="/media/logo.svg" style="width: 30px" />
      </div>
      <div class="flex-grow-1">
        <h4 class="text-light fw-bold display-font">
          {{ $t(props.title) }}
        </h4>
      </div>
    </div>
  </div>
</template>
