<script setup lang="ts">
const props = defineProps<{
  error: any
  callback: (() => void) | undefined
}>()
</script>

<template>
  <div class="content-view-settings error-alert box-shadow bg-alt">
    <div class="d-flex align-items-center px-2 py-1 bg-alt2 gap-2">
      <h6 class="fw-bold">Something went wrong!</h6>
    </div>
    <div class="toast-body d-flex flex-column p-2 flex-grow-1 gap-1">
      <p class="text-light-alt">
        {{ props.error }}
      </p>
      <div class="d-flex justify-content-end">
        <button class="btn btn-danger text-light px-2" @click="callback">Try Again</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/shared/sass/variables/index';

.error-alert {
  border: 1px solid $danger;
}
</style>
